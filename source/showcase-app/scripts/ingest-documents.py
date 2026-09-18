"""Extracts the primary DeepGrid documents into citable passages for Ask DeepGrid.

    npm run graph:documents      (uv run --with rapidocr_onnxruntime --with python-docx --with wordninja python ...)

Writes knowledge/documents.json. The source files are NOT copied into this repository (the IM is marked
"Strictly Confidential"); each is recorded with its path and SHA-256 so a re-extraction can prove it read the
same bytes. They were found on 2026-09-18 by querying the Windows Search index for DeepGrid documents.

  - text-layer PDF pages are read with pdftotext; a page under TEXT_FLOOR characters (a cover, a diagram)
    is also rendered at 150 dpi and OCR'd, because a slide PDF keeps its figures as images: IM v2 page 10
    names the eleven sensors only inside its block diagram
  - image-only documents are OCR'd page by page (RapidOCR, the engine the IM OCR in ../original-platform used)
  - DOCX is split at its headings
Deliberately left out: DeepGrid_Semi_-Aravind.pdf, which is the June 2026 Information Memorandum already
indexed from ../original-platform (same title page, same 33 pages).
"""
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WIN = Path('/mnt/c/Users/sheke')
TEXT_FLOOR = 600
MAX = 1400
DOCS = [
    # (path, id, label, mode)
    (WIN / 'OneDrive/Desktop/DeepGrid Semi - IM - v2.pdf', 'im2', 'Information Memorandum v2 (Emani Capital, Aug 2026)', 'pdf'),
    (WIN / 'OneDrive/Desktop/DeepGrid_BP1A_India_AutonomousTrucking_Plan (4).pdf', 'bp1a', 'BP1A India Autonomous Trucking Plan', 'pdf'),
    (WIN / 'OneDrive/Desktop/DeepGrid_BP1B_USA_Proposal_Shravan (4).pdf', 'bp1b', 'BP1B USA Proposal', 'pdf'),
    (WIN / 'OneDrive/Desktop/DeepGrid_Brief_Shravan_Mayookh.pdf', 'brief', 'DeepGrid Brief (Shravan, Mayookh)', 'pdf'),
    (WIN / 'Downloads/DeepGrid_Semi_Investor_Briefing.pdf', 'briefing', 'DeepGrid Semi Investor Briefing (Jul 2026)', 'pdf'),
    (WIN / 'Downloads/DeepGrid ICP and GTM Strategy.docx', 'icp', 'ICP and GTM Strategy (Jul 2026)', 'docx'),
]

_ocr = None


def ocr(pdf, page):
    global _ocr
    if _ocr is None:
        from rapidocr_onnxruntime import RapidOCR
        _ocr = RapidOCR()
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-r', '150', '-png', str(pdf), f'{d}/p'], check=True)
        img = next(Path(d).glob('p*.png'))
        res, _ = _ocr(str(img))
    return despace(' '.join(r[1] for r in (res or [])))


def despace(text):
    """RapidOCR drops spaces on some slide fonts ("DataFailureandPowerBottleneck"), which exact-word search
    cannot match. Only long letter runs are re-split, by word frequency; numbers, units and codes are left."""
    import wordninja

    def fix(m):
        w = m.group(0)
        parts = wordninja.split(w)
        if len(parts) < 2 or any(len(x) == 1 and x.lower() not in ('a', 'i') for x in parts):
            return w
        # keep the original letters (and their case), only insert the spaces
        out, i = [], 0
        for x in parts:
            out.append(w[i:i + len(x)])
            i += len(x)
        return ' '.join(out)
    return re.sub(r'[A-Za-z]{15,}', fix, text)


def clean(t):
    return re.sub(r'\s+', ' ', t.replace('\x0c', ' ')).strip()


def pdf_pages(path):
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', str(path)], capture_output=True, text=True).stdout).group(1))
    for p in range(1, n + 1):
        text = clean(subprocess.run(['pdftotext', '-q', '-f', str(p), '-l', str(p), str(path), '-'], capture_output=True, text=True).stdout)
        how = 'text'
        if len(text) < TEXT_FLOOR:
            fig = clean(ocr(path, p))
            if fig and len(fig) > len(text) * 0.5:
                text = (text + ' Figure text (OCR): ' + fig).strip() if text else fig
                how = 'text+ocr' if len(text) > len(fig) + 20 else 'ocr'
        yield p, text, how


def docx_sections(path):
    import docx
    doc = docx.Document(str(path))
    heading, buf = 'Introduction', []
    for para in doc.paragraphs:
        t = clean(para.text)
        if not t:
            continue
        if para.style.name.lower().startswith(('heading', 'title')):
            if buf:
                yield heading, ' '.join(buf)
            heading, buf = t, []
        else:
            buf.append(t)
    if buf:
        yield heading, ' '.join(buf)


def split(text):
    """~MAX-character passages on sentence boundaries."""
    parts, buf = [], ''
    for s in re.split(r'(?<=[.!?])\s+', text):
        if buf and len(buf) + len(s) > MAX:
            parts.append(buf.strip())
            buf = ''
        buf += s + ' '
    return parts + ([buf.strip()] if buf.strip() else [])


def main():
    units, provenance = [], []
    for path, code, label, mode in DOCS:
        if not path.exists():
            print(f'MISSING {path}', file=sys.stderr)
            sys.exit(1)
        sha = hashlib.sha256(path.read_bytes()).hexdigest()
        modes = {}
        if mode == 'pdf':
            for p, text, how in pdf_pages(path):
                modes[how] = modes.get(how, 0) + 1
                if len(text) < 40:
                    continue
                head = text[:90].rsplit(' ', 1)[0]
                for k, part in enumerate(split(text)):
                    units.append({'id': f'pd:{code}:p{p}' + (f'-{k + 1}' if k else ''), 'title': f'{head} …' if k == 0 else f'{head} … (cont.)',
                                  'text': part, 'source': {'kind': 'document', 'label': f'{label} · p. {p}', 'docKind': 'Primary document'}})
        else:
            for i, (heading, body) in enumerate(docx_sections(path)):
                for k, part in enumerate(split(body)):
                    units.append({'id': f'pd:{code}:s{i + 1}' + (f'-{k + 1}' if k else ''), 'title': heading[:110],
                                  'text': part, 'source': {'kind': 'document', 'label': f'{label} · {heading[:60]}', 'docKind': 'Primary document'}})
            modes['docx'] = 1
        provenance.append({'file': str(path).replace(str(WIN), 'C:/Users/sheke'), 'sha256': sha, 'label': label, 'read': modes})
        print(f'  {label}: {modes}', file=sys.stderr)
    out = ROOT / 'knowledge/documents.json'
    out.write_text(json.dumps({'provenance': provenance, 'units': units}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'documents: {len(units)} passages from {len(DOCS)} files -> knowledge/documents.json', file=sys.stderr)


if __name__ == '__main__':
    main()
