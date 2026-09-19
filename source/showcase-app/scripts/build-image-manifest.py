"""Every image the showcase can show, with where it comes from: knowledge/image-manifest.json.

    uv run --no-project --with pillow python scripts/build-image-manifest.py [--films DIR]

- the 104 deck slides (public/slides), each with its slide link and its moment in the narrated walkthrough, found by
  matching the slide's narration to the walkthrough's captions (public/media/captions/master.vtt)
- the memorandum figures, renders, film posters and diagrams under public/images, public/media and public/diagrams
- keyframes of the six product films, one every 6 seconds, written to public/media/keyframes/<film>-<t>.webp so an
  answer can show the frame and open the film at that second; needs --films, a folder holding <film>.mp4

The manifest records provenance only. What an image shows comes from scripts/describe-images.py, never from here.
"""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
notes = json.loads((ROOT / 'app/slide-notes.json').read_text())

# the walkthrough narrates each slide in order; a slide's start is the first caption cue that carries its narration
cues = []
for block in (PUB / 'media/captions/master.vtt').read_text().split('\n\n'):
    lines = block.strip().split('\n')
    if len(lines) >= 2 and '-->' in lines[0]:
        h, m, s = lines[0].split(' --> ')[0].split(':')
        cues.append((int(h) * 3600 + int(m) * 60 + float(s), ' '.join(lines[1:])))
norm = lambda t: re.sub(r'[^a-z0-9 ]', '', t.lower()).split()


def walkthrough_time(n, after):
    target = norm(notes[n - 1]['script'])[:10]
    best = (0.0, None)
    for i, (t, _) in enumerate(cues):
        if t < after:
            continue
        words = set(norm(' '.join(c for _, c in cues[i:i + 2])))
        score = sum(w in words for w in target) / max(1, len(target))
        if score > best[0]:
            best = (score, int(t))
        if score >= 0.9:
            break
    return best[1] if best[0] >= 0.7 else None


images = []
t = 0
for n in range(1, 105):
    at = walkthrough_time(n, t)
    if at is not None:
        t = at
    images.append({'id': f'slide-{n:03d}', 'file': f'public/slides/slide_{n:02d}.png', 'source': 'Product portfolio deck',
                   'slide': n, 'title': notes[n - 1]['title'], 'nav': f'slides?slide={n}',
                   **({'film': 'master', 't': at, 'filmNav': f'film?v=master&t={at}'} if at is not None else {})})

FILM_POSTERS = {'truck', 'ddrive', 'forklift', 'yard', 'sentinel', 'computebox'}
for f in sorted((PUB / 'images').rglob('*')):
    if f.suffix.lower() not in ('.png', '.jpg', '.webp') or f.name == 'og.jpg':
        continue
    rel = str(f.relative_to(ROOT))
    if f.name.startswith('figure-'):
        entry = {'source': 'Information Memorandum (figure)', 'nav': 'investment?chapter=summary'}
    elif f.parent.name == 'posters' and f.stem in FILM_POSTERS:
        entry = {'source': 'Product film (poster frame)', 'film': f.stem, 't': 0, 'filmNav': f'film?v={f.stem}'}
    elif f.name == 'semiconductor-hero.png':
        entry = {'source': 'Generated illustration (IMAGE-SOURCES.md), not a photograph'}
    else:
        entry = {'source': 'DeepGrid product visualisation (IMAGE-SOURCES.md)'}
    images.append({'id': 'img-' + f.stem, 'file': rel, **entry})
provenance = json.loads((ROOT / 'knowledge/image-provenance.json').read_text())['images'] if (ROOT / 'knowledge/image-provenance.json').exists() else {}
for f in sorted((PUB / 'media').glob('*')):
    if f.suffix.lower() in ('.png', '.jpg', '.webp'):
        rel = str(f.relative_to(ROOT))
        p = provenance.get(rel)
        images.append({'id': 'media-' + f.stem, 'file': rel, 'source': p['source'] if p else 'Added with the DG32 visual assets (provenance not recorded)',
                       **({'url': p['url']} if p and p.get('url') else {})})
for f in sorted((PUB / 'diagrams').glob('*.svg')):
    images.append({'id': 'diagram-' + f.stem, 'file': str(f.relative_to(ROOT)), 'source': 'DG32 architecture diagram (draw.io)'})

films = sys.argv[sys.argv.index('--films') + 1] if '--films' in sys.argv else None
if films:
    out = PUB / 'media/keyframes'
    out.mkdir(exist_ok=True)
    for film in sorted(FILM_POSTERS):
        src = pathlib.Path(films) / f'{film}.mp4'
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(src)]))
        for sec in range(3, int(dur) - 1, 6):
            dst = out / f'{film}-{sec:03d}.webp'
            if not dst.exists():
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(sec), '-i', str(src), '-frames:v', '1',
                                '-vf', 'scale=960:-2', '-c:v', 'libwebp', '-quality', '72', str(dst)], check=True)
            images.append({'id': f'frame-{film}-{sec:03d}', 'file': str(dst.relative_to(ROOT)), 'source': 'Product film (keyframe)',
                           'film': film, 't': sec, 'filmNav': f'film?v={film}&t={sec}'})

(ROOT / 'knowledge/image-manifest.json').write_text(json.dumps({'images': images}, indent=1) + '\n')
kinds = {}
for i in images:
    kinds[i['source']] = kinds.get(i['source'], 0) + 1
print(f'{len(images)} images:', kinds)
print('slides placed in the walkthrough:', sum('t' in i for i in images if i['id'].startswith('slide-')), 'of 104')
