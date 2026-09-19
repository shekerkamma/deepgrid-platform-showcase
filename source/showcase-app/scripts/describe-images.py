"""Describe images from what they show, so captions and the image index never rest on a guess.

    uv run --no-project --with pillow --with pyyaml python scripts/describe-images.py [public/media/x.png ...]
    (no arguments: every image listed in knowledge/image-manifest.json)

For each image a vision model (CLIProxyAPI, gemini-3.8-flash-high on the antigravity subscription; never a free tier)
returns: the kind of image (photograph, render, screenshot, slide, diagram, chart), what it shows, and the text that is
visible in it. It is told not to name a product, specification or place unless it is visible. SVGs are rasterised with
Playwright first. Results are cached by file content in knowledge/image-descriptions.json, which is the ground truth for
every caption on the site: a caption may only say what this file says.
"""
import base64
import hashlib
import io
import json
import pathlib
import subprocess
import sys
import time
import urllib.error
import urllib.request

import yaml
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'knowledge/image-descriptions.json'
MODEL = 'gemini-3.8-flash-high'
KINDS = ['photograph', 'render', 'screenshot', 'slide', 'diagram', 'chart']
PROMPT = """You are cataloguing an image for a company's investor website. Look only at the image.
Return JSON only:
{"kind": one of %s,
 "shows": "two sentences on what is in the image, concretely",
 "visibleText": ["headings, labels and figures you can read in the image, verbatim, at most 12"],
 "subjects": ["3 to 6 short tags for what it is about"]}
Rules: a photograph is a camera image of real objects; a render is computer-generated imagery of objects or scenes;
a screenshot is software on a screen (including a simulator); a slide is a presentation page; a diagram is a block,
flow or layout drawing; a chart plots data. Never name a product, chip, process node, company, place or number unless
it is legible in the image. If the image is a render, say so in "shows".""" % KINDS


def proxy():
    gw = subprocess.check_output("ip route show default | awk '{print $3}'", shell=True).decode().strip()
    creds = yaml.safe_load(pathlib.Path('~/.dsh/.credentials.yaml').expanduser().read_text())

    def walk(o, p=''):
        if isinstance(o, dict):
            for k, v in o.items():
                yield from walk(v, f'{p}/{k}')
        elif isinstance(o, str) and 'cliproxy' in p.lower():
            yield o
    return gw, next(walk(creds), '')


def pixels(path: pathlib.Path) -> bytes:
    if path.suffix.lower() == '.svg':
        png = path.with_suffix('.render.png')
        # size the page to the drawing's own viewBox; a full-page capture of a 1 MB draw.io SVG times out
        head = path.read_text(errors='ignore')[:4000]
        import re
        vb = re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', head)
        w, h = (int(float(vb.group(1))), int(float(vb.group(2)))) if vb else (1600, 1200)
        scale = min(1.0, 2000 / max(w, h))
        subprocess.run(['node', '-e', f"""
import('/home/sheke/content-ideas/node_modules/playwright/index.mjs').then(async ({{chromium}}) => {{
  const b = await chromium.launch(); const p = await b.newPage({{viewport: {{width: {int(w * scale)}, height: {int(h * scale)}}}}});
  await p.goto('file://{path}');
  await p.evaluate(() => {{ const s = document.querySelector('svg'); s.setAttribute('width', innerWidth); s.setAttribute('height', innerHeight); document.documentElement.style.background = '#fff'; }});
  await p.waitForTimeout(1500); await p.screenshot({{path: '{png}', timeout: 120000}}); await b.close(); }});"""], check=True)
        # a rasterised SVG that came out blank is a rendering failure, not a description
        if Image.open(png).convert('L').getextrema()[0] > 200:
            raise RuntimeError(f'{path.name} rendered blank')
        data = png.read_bytes()
        png.unlink()
        path = io.BytesIO(data)
    im = Image.open(path).convert('RGB')
    im.thumbnail((1400, 1400))
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=88)
    return buf.getvalue()


def describe(gw, key, jpeg: bytes) -> dict:
    msg = [{'role': 'user', 'content': [{'type': 'text', 'text': PROMPT},
            {'type': 'image_url', 'image_url': {'url': 'data:image/jpeg;base64,' + base64.b64encode(jpeg).decode()}}]}]
    for attempt in range(1, 7):
        req = urllib.request.Request(f'http://{gw}:8317/v1/chat/completions',
                                     data=json.dumps({'model': MODEL, 'max_tokens': 1200, 'temperature': 0, 'messages': msg}).encode(),
                                     headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
        try:
            raw = json.load(urllib.request.urlopen(req, timeout=180))['choices'][0]['message']['content']
            d = json.loads(raw[raw.index('{'):raw.rindex('}') + 1])
            if d.get('kind') in KINDS and d.get('shows'):
                return d
        except (urllib.error.HTTPError, urllib.error.URLError, ValueError, KeyError) as e:
            print(f'  attempt {attempt}: {e}', file=sys.stderr)
        time.sleep(5 * attempt)
    raise RuntimeError('vision model gave no usable description')


def main(files):
    gw, key = proxy()
    cache = json.loads(OUT.read_text()) if OUT.exists() else {}
    for f in files:
        path = (ROOT / f).resolve()
        rel = str(path.relative_to(ROOT))
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
        if cache.get(rel, {}).get('sha') == digest:
            continue
        d = describe(gw, key, pixels(path))
        cache[rel] = {'sha': digest, 'model': MODEL, **d}
        OUT.write_text(json.dumps(cache, indent=1, ensure_ascii=False) + '\n')
        print(f'{rel}: {d["kind"]}: {d["shows"][:110]}')


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        args = [x['file'] for x in json.loads((ROOT / 'knowledge/image-manifest.json').read_text())['images']]
    main(args)
