"""Connect images to the knowledge graph by what they show: app/data/image-links.json.

    uv run --no-project --with pillow python scripts/build-image-links.py [--report]

A multimodal embedding model puts images and text in one space. The default is NVIDIA's
llama-nemotron-embed-vl-1b-v2 (NIM free credit pool, NVIDIA_NIM_API_KEY): built for retrieving document pages from
images, it ranked twelve same-template product slides against their own text 12/12 in a first test, and has no daily
cap. EMBED_PROVIDER=gemini uses gemini-embedding-2 instead (free tier: 1,000 requests a day). Every image in knowledge/image-manifest.json is embedded from its
pixels (never from a caption), and so is every text target an answer can rest on: the GraphRAG passages
(app/data/graphrag-unified-index.json), the curated themes, and the fifteen products. An image is linked to a target when
their similarity clears a threshold, and the links become graph edges ("depicts") the page uses to put the right image
beside an answer. The page never calls the model: all of this is offline, and search stays in the browser.

The threshold is not a guess. The 104 deck slides are the answer key: each slide image has exactly one passage that is
its own text. The report measures how often a slide's own passage ranks first, and picks the similarity at which links
are right, and writes both into the output so the site states what it was built at.

Vectors are cached by provider and content hash in knowledge/.embedding-cache/ (not committed); on a daily-quota error
the run stops and the next run resumes. Keys are read from the environment or the local Claude Code settings, never
written anywhere.
"""
import base64
import hashlib
import io
import json
import math
import os
import pathlib
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / 'knowledge/.embedding-cache'
PROVIDER = os.environ.get('EMBED_PROVIDER', 'nvidia')
MODEL = {'nvidia': 'nvidia/llama-nemotron-embed-vl-1b-v2', 'gemini': 'models/gemini-embedding-2'}[PROVIDER]
DIMS = 768  # gemini only: Matryoshka truncation; the NVIDIA model returns 2,048


def api_key():
    name = {'nvidia': 'NVIDIA_NIM_API_KEY', 'gemini': 'GOOGLE_GENERATIVE_AI_API_KEY'}[PROVIDER]
    k = os.environ.get(name)
    if k:
        return k
    for p in [ROOT.parents[2] / 'content-ideas/.claude/settings.local.json', pathlib.Path.home() / 'content-ideas/.claude/settings.local.json']:
        if p.exists():
            k = json.loads(p.read_text()).get('env', {}).get(name)
            if k:
                return k
    sys.exit(f'{name} not set')


class QuotaSpent(Exception):
    pass


def embed(key, parts, role):
    """role: 'image' or 'text'. The NVIDIA model embeds images as passages and texts as queries."""
    if PROVIDER == 'nvidia':
        inp = ('data:image/jpeg;base64,' + parts[0]['inline_data']['data']) if 'inline_data' in parts[0] else parts[0]['text'][:6000]
        url = 'https://integrate.api.nvidia.com/v1/embeddings'
        body = json.dumps({'model': MODEL, 'input': [inp], 'input_type': 'passage' if role == 'image' else 'query', 'encoding_format': 'float'}).encode()
        headers = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}
        pick = lambda d: d['data'][0]['embedding']
    else:
        url = f'https://generativelanguage.googleapis.com/v1beta/{MODEL}:embedContent?key={key}'
        body = json.dumps({'content': {'parts': parts}, 'outputDimensionality': DIMS}).encode()
        headers = {'Content-Type': 'application/json'}
        pick = lambda d: d['embedding']['values']
    for attempt in range(1, 7):
        try:
            v = pick(json.load(urllib.request.urlopen(urllib.request.Request(url, data=body, headers=headers), timeout=180)))
            n = math.sqrt(sum(x * x for x in v)) or 1.0
            return [x / n for x in v]
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='ignore')
            if e.code == 429 and 'PerDay' in detail:
                raise QuotaSpent()
            print(f'  {e.code} (attempt {attempt}): {detail[:120]}', file=sys.stderr)
            time.sleep(6 * attempt)
        except (urllib.error.URLError, TimeoutError) as e:
            print(f'  {e} (attempt {attempt})', file=sys.stderr)
            time.sleep(6 * attempt)
    raise RuntimeError('embedding failed')


def image_part(path):
    if path.suffix.lower() == '.svg':
        png = path.with_suffix('.render.png')
        subprocess.run(['node', '-e', f"""
import('/home/sheke/content-ideas/node_modules/playwright/index.mjs').then(async ({{chromium}}) => {{
  const b = await chromium.launch(); const p = await b.newPage({{viewport: {{width: 1600, height: 1000}}}});
  await p.goto('file://{path}');
  await p.evaluate(() => {{ const s = document.querySelector('svg'); s.setAttribute('width', innerWidth); s.setAttribute('height', innerHeight); }});
  await p.waitForTimeout(1500); await p.screenshot({{path: '{png}', timeout: 120000}}); await b.close(); }});"""], check=True)
        im = Image.open(png).convert('RGB')
        png.unlink()
    else:
        im = Image.open(path).convert('RGB')
    im.thumbnail((1024, 1024))
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=85)
    return [{'inline_data': {'mime_type': 'image/jpeg', 'data': base64.b64encode(buf.getvalue()).decode()}}]


def cached(key, kind, ident, content_hash, make_parts, stats):
    f = CACHE / f'{PROVIDER}-{kind}-{content_hash}.json'
    if f.exists():
        return json.loads(f.read_text())
    v = embed(key, make_parts(), 'image' if kind == 'img' else 'text')
    f.write_text(json.dumps(v))
    stats['new'] += 1
    return v


def targets():
    idx = json.loads((ROOT / 'app/data/graphrag-unified-index.json').read_text())
    out = [{'id': c['id'], 'type': 'passage', 'label': f"{c['docTitle']}, {c['section']}", 'nav': c.get('nav', ''),
            'text': f"{c['docTitle']}. {c['section']}. {c['text'][:3000]}"} for c in idx['chunks']]
    for t in json.loads((ROOT / 'app/data/showcase-themes.json').read_text()):
        out.append({'id': 'theme:' + t['title'], 'type': 'theme', 'label': t['title'], 'nav': t.get('nav', ''),
                    'text': f"{t['title']}. {t['lead']} {' '.join(t['explanation'])}"})
    eng = (ROOT / 'app/data/graphrag-engine.ts').read_text()
    for m in re.finditer(r"title: '([^']+)',\s*tag: '[^']+',\s*lead:\s*'((?:[^'\\]|\\.)+)'", eng):
        out.append({'id': 'theme:' + m.group(1), 'type': 'theme', 'label': m.group(1), 'nav': '', 'text': f'{m.group(1)}. {m.group(2)}'})
    for p in json.loads((ROOT / 'app/products.json').read_text()):
        out.append({'id': 'product:' + p['id'], 'type': 'product', 'label': p['name'], 'nav': f"portfolio?product={p['id']}",
                    'text': f"{p['name']}. {p['category']}. {p['description']} {p['role']}"})
    return out


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    key = api_key()
    images = json.loads((ROOT / 'knowledge/image-manifest.json').read_text())['images']
    texts = targets()
    stats = {'new': 0}
    iv, tv = {}, {}
    try:
        for im in images:  # images first: they are the point, and a partial run still links what it has
            path = ROOT / im['file']
            h = hashlib.sha256(path.read_bytes()).hexdigest()[:20]
            iv[im['id']] = cached(key, 'img', im['id'], h, lambda: image_part(path), stats)
            if stats['new'] and stats['new'] % 25 == 0:
                print(f'  {stats["new"]} embedded', flush=True)
        for t in texts:
            h = hashlib.sha256(t['text'].encode()).hexdigest()[:20]
            tv[t['id']] = cached(key, 'txt', t['id'], h, lambda: [{'text': t['text']}], stats)
    except QuotaSpent:
        print(f'daily quota spent after {stats["new"]} new embeddings: {len(iv)}/{len(images)} images, {len(tv)}/{len(texts)} texts cached. Run again tomorrow.')
        sys.exit(3)
    print(f'embedded {stats["new"]} new; {len(iv)} images, {len(tv)} texts')

    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    by_id = {t['id']: t for t in texts}
    tids = list(tv)
    sims = {i: sorted(((dot(v, tv[t]), t) for t in tids), reverse=True) for i, v in iv.items()}

    # the answer key: a deck slide's own passage is the passage placed on that slide
    own = {}
    for t in texts:
        m = re.match(r'slides\?slide=(\d+)$', t['nav'])
        if t['type'] == 'passage' and m:
            own.setdefault(int(m.group(1)), set()).add(t['id'])
    ranks, own_scores, other_top = [], [], []
    for im in images:
        n = im.get('slide')
        if not n or n not in own or im['id'] not in sims:
            continue
        order = [t for _, t in sims[im['id']]]
        r = min(order.index(t) for t in own[n]) + 1
        ranks.append(r)
        own_scores.append(max(s for s, t in sims[im['id']] if t in own[n]))
        other_top.append(next(s for s, t in sims[im['id']] if t not in own[n]))
    top1 = sum(r == 1 for r in ranks) / max(1, len(ranks))
    top5 = sum(r <= 5 for r in ranks) / max(1, len(ranks))
    # threshold: the lowest similarity at which at least 90% of links from slides are to their own passage
    pairs = sorted([(s, True) for s in own_scores] + [(s, False) for s in other_top], reverse=True)
    threshold, good, seen = 1.0, 0, 0
    for s, ok in pairs:
        seen += 1
        good += ok
        if good / seen >= 0.9:
            threshold = s
    print(f'answer key ({len(ranks)} slides): own passage first {top1:.0%}, in top 5 {top5:.0%}; link threshold {threshold:.3f}')

    # Scenes (film frames, figures, diagrams) sit further from any prose than a slide does from its own text, so they
    # get their own threshold from their own answer key: each product film belongs to known deck slides (its
    # "simulator running" pages). The lowest similarity at which 90% of frames' best slide is their film's own sets it.
    FILM_SLIDES = {'forklift': {16, 17}, 'yard': {72, 73}, 'sentinel': {91, 92}, 'ddrive': {22, 23}, 'truck': {26, 27}, 'computebox': {24, 25}}
    slide_of = {t['id']: int(m.group(1)) for t in texts if (m := re.match(r'slides\?slide=(\d+)$', t['nav']))}
    frames = []
    for im in images:
        if im['id'].startswith('frame-') and im['id'] in sims:
            s, t = next((s, t) for s, t in sims[im['id']] if t in slide_of)
            frames.append((s, slide_of[t] in FILM_SLIDES[im['film']]))
    frames.sort(reverse=True)
    scene_threshold, good = 1.0, 0
    for n, (s, ok) in enumerate(frames, 1):
        good += ok
        if good / n >= 0.9:
            scene_threshold = s
    frame_ok = sum(ok for _, ok in frames) / max(1, len(frames))
    print(f'answer key ({len(frames)} film frames): film\'s own slide first {frame_ok:.0%}; scene threshold {scene_threshold:.3f}')

    links = []
    for im in images:
        if im['id'] not in sims:
            continue
        floor = threshold if im.get('slide') else scene_threshold
        top = sims[im['id']][0][0]
        keep = [(s, t) for s, t in sims[im['id']][:6] if s >= floor and s >= top - 0.05]
        links.append({'image': im['id'], 'file': im['file'][len('public/'):], 'links': [
            {'target': t, 'type': by_id[t]['type'], 'label': by_id[t]['label'], 'score': round(s, 3)} for s, t in keep]})
    # Themes: measured, not used. Abstract investor themes match images far less reliably than slides or frames, so
    # themes take their image from knowledge/theme-images.json; this records how the embeddings would have done.
    labels = json.loads((ROOT / 'knowledge/theme-images.json').read_text())['themes']
    theme_hits = []
    for title, ok_ids in labels.items():
        tid = 'theme:' + title
        if tid in tv:
            best = max(iv, key=lambda i: dot(iv[i], tv[tid]))
            theme_hits.append(best in ok_ids)
    theme_top1 = sum(theme_hits) / max(1, len(theme_hits))
    print(f'theme images by embedding ({len(theme_hits)} themes): right {theme_top1:.0%}; themes use knowledge/theme-images.json')

    out = {'model': MODEL, 'themeTop1': round(theme_top1, 3), 'dims': len(next(iter(iv.values()))), 'threshold': round(threshold, 3), 'sceneThreshold': round(scene_threshold, 3),
           'answerKey': {'slides': len(ranks), 'ownFirst': round(top1, 3), 'ownTop5': round(top5, 3),
                         'frames': len(frames), 'frameOwnSlideFirst': round(frame_ok, 3)}, 'images': links}
    (ROOT / 'app/data/image-links.json').write_text(json.dumps(out, indent=1) + '\n')
    print(f'{sum(bool(l["links"]) for l in links)} of {len(links)} images linked; app/data/image-links.json')


if __name__ == '__main__':
    main()
