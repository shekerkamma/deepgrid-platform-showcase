"""Assembles every DeepGrid document into knowledge/sources/, the folder graphify runs on. Two parts:
  1. dr/        the 42 documents the DG32 site's Ask DeepGrid graph was built from (8 PDFs + 34 markdown), copied
                from a deepgrid-dr-silicon checkout (DR_SITE, default ../../../deepgrid-dr-site) with their paths,
                exactly the list in its graphify-out/manifest.json
  2. the rest   this repository's own DeepGrid documents (below)

    npm run graph:sources     then   npm run graph:extract

graphify reads PDF, markdown, .docx and .xlsx natively, so those are copied as they are. Two kinds are
converted to markdown because graphify cannot read them: the 104-slide .pptx (slide text + speaker notes),
and image-only PDFs (the June 2026 Information Memorandum and the investor briefing), whose text comes from
their OCR. The showcase page's own content (investment memorandum, product dossiers, use cases) is written
out as markdown too.

Left out on purpose: developer documents about the site (READMEs, provenance, retrieval notes, graph reports),
and the business plan's Payroll and Cap Table sheets, which are not published. knowledge/sources/ is gitignored
(it holds confidential originals); knowledge/sources.json records each file's origin and SHA-256.
"""
import hashlib
import html
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
WIN = Path('/mnt/c/Users/sheke')
OUT = ROOT / 'knowledge/sources'

NATIVE = [
    ('papers', WIN / 'OneDrive/Desktop/DeepGrid Semi - IM - v2.pdf', 'information-memorandum-v2-aug-2026.pdf'),
    ('papers', WIN / 'OneDrive/Desktop/DeepGrid_BP1A_India_AutonomousTrucking_Plan (4).pdf', 'bp1a-india-autonomous-trucking-plan.pdf'),
    ('papers', WIN / 'OneDrive/Desktop/DeepGrid_BP1B_USA_Proposal_Shravan (4).pdf', 'bp1b-usa-proposal.pdf'),
    ('papers', WIN / 'OneDrive/Desktop/DeepGrid_Brief_Shravan_Mayookh.pdf', 'deepgrid-brief-shravan-mayookh.pdf'),
    ('office', REPO / 'documents/Deepgrid_Semi_Financial_Model_Corrected_v3-sept.xlsx', 'financial-model-v3-sept-2026.xlsx'),
    ('office', WIN / 'Downloads/DeepGrid ICP and GTM Strategy.docx', 'icp-and-gtm-strategy-jul-2026.docx'),
]
MARKDOWN = sorted((REPO / 'original-platform/src/a2ui/data/research').glob('*.md')) + \
    sorted((REPO / 'original-platform/public/deck_assets').glob('*.md'))
EXCLUDED_SHEETS = {'Payroll', 'Cap Table'}
DR = Path(__import__('os').environ.get('DR_SITE', str(REPO.parent.parent / 'deepgrid-dr-site'))).resolve()
DOC_EXT = ('.pdf', '.md', '.docx', '.xlsx', '.txt')


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def pptx_markdown(path):
    """Slide text and speaker notes, in slide order."""
    z = zipfile.ZipFile(path)
    text = lambda xml: html.unescape(re.sub(r'\s+', ' ', ' '.join(re.findall(r'<a:t>([^<]*)</a:t>', xml))).strip())
    slides = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)), key=lambda n: int(re.search(r'\d+', n.split('/')[-1]).group()))
    out = ['# DeepGrid Semi — Product Portfolio deck (104 slides)\n']
    for n in slides:
        k = int(re.search(r'(\d+)', n.split('/')[-1]).group(1))
        rels = f'ppt/slides/_rels/slide{k}.xml.rels'
        notes = ''
        if rels in z.namelist():
            m = re.search(r'Target="\.\./notesSlides/(notesSlide\d+\.xml)"', z.read(rels).decode('utf8', 'ignore'))
            if m:
                notes = text(z.read(f'ppt/notesSlides/{m.group(1)}').decode('utf8', 'ignore'))
        body = text(z.read(n).decode('utf8', 'ignore'))
        out.append(f'## Slide {k}\n\n{body}\n' + (f'\nSpeaker notes: {notes}\n' if notes else ''))
    return '\n'.join(out)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    manifest = []

    def record(kind, dest, origin, how):
        manifest.append({'file': str(dest.relative_to(OUT)), 'kind': kind, 'origin': origin, 'sha256': sha(dest), 'read': how})

    # part 1: the DG32 site's documents, the same set its graph was built from
    dr_manifest = json.loads((DR / 'graphify-out/manifest.json').read_text())
    dr_docs = sorted(f for f in dr_manifest if f.lower().endswith(DOC_EXT))
    for rel in dr_docs:
        src, dest = DR / rel, OUT / 'dr' / rel
        if not src.exists():
            sys.exit(f'MISSING {src}')
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)
        record('dr', dest, f'deepgrid-dr-silicon/{rel}', 'graphify native')

    for kind, src, name in NATIVE:
        if not src.exists():
            sys.exit(f'MISSING {src}')
        dest = OUT / kind / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)
        record(kind, dest, str(src).replace(str(WIN), 'C:/Users/sheke'), 'graphify native')

    # the business plan without the sheets that are not published
    import openpyxl
    wb = openpyxl.load_workbook(REPO / 'documents/DeepGrid_Semi_Business_Plan_v2.xlsx', data_only=True)
    for s in list(wb.sheetnames):
        if s.strip() in EXCLUDED_SHEETS or wb[s].max_row <= 1 and wb[s].max_column <= 1:
            del wb[s]
    dest = OUT / 'office/business-plan-v2.xlsx'
    wb.save(dest)
    record('office', dest, 'source/documents/DeepGrid_Semi_Business_Plan_v2.xlsx (values; Payroll and Cap Table removed)', 'graphify native')

    for md in MARKDOWN:
        dest = OUT / 'markdown' / md.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(md, dest)
        record('markdown', dest, str(md.relative_to(REPO.parent)), 'graphify native')

    conv = OUT / 'converted'
    conv.mkdir(parents=True, exist_ok=True)
    deck = REPO / 'documents/DeepGrid-Semi-Product-Portfolio-104-Slides-Embedded-reviewed.pptx'
    (conv / 'product-portfolio-deck-104-slides.md').write_text(pptx_markdown(deck), encoding='utf-8')
    record('converted', conv / 'product-portfolio-deck-104-slides.md', str(deck.relative_to(REPO.parent)), 'pptx: slide text + speaker notes')

    im = json.loads((REPO / 'original-platform/src/a2ui/data/research/information-memorandum.json').read_text())
    (conv / 'information-memorandum-june-2026.md').write_text(
        f"# {im['source']} ({im['date']})\n\n" + '\n'.join(f"## Page {p['page']}\n\n{p['text']}\n" for p in im['pages']), encoding='utf-8')
    record('converted', conv / 'information-memorandum-june-2026.md', 'original-platform information-memorandum.json (33 pages, RapidOCR)', 'image-only PDF: OCR text')

    docs = json.loads((ROOT / 'knowledge/documents.json').read_text())['units']
    brief = [u for u in docs if u['id'].startswith('pd:briefing:')]
    (conv / 'investor-briefing-jul-2026.md').write_text('# DeepGrid Semi Investor Briefing (Jul 2026)\n\n' +
        '\n'.join(f"## {u['source']['label'].split(' · ')[-1]}\n\n{u['text']}\n" for u in brief), encoding='utf-8')
    record('converted', conv / 'investor-briefing-jul-2026.md', 'C:/Users/sheke/Downloads/DeepGrid_Semi_Investor_Briefing.pdf', 'image-only PDF: OCR text (RapidOCR)')

    # the page itself: memorandum, dossiers, use cases (scripts/lib/showcase-content.mjs reads the same app files)
    import subprocess
    page = json.loads(subprocess.run(['node', '-e', "import('./scripts/lib/showcase-content.mjs').then(m=>{const c=m.loadContent();"
        "process.stdout.write(JSON.stringify(c.units.filter(u=>['memo','product','usecase'].includes(u.kind))))})"],
        cwd=ROOT, capture_output=True, text=True, check=True).stdout)
    for kind, name, title in [('memo', 'showcase-investment-memorandum.md', 'DeepGrid Semi — investment memorandum (showcase)'),
                              ('product', 'showcase-product-dossiers.md', 'DeepGrid Semi — the fifteen product dossiers'),
                              ('usecase', 'showcase-use-cases.md', 'DeepGrid Semi — the six commercial use cases')]:
        units = [u for u in page if u['kind'] == kind]
        (conv / name).write_text(f'# {title}\n\n' + '\n'.join(f"## {u['title']}\n\n{u['text']}\n" for u in units), encoding='utf-8')
        record('converted', conv / name, 'source/showcase-app/app (page content)', 'page content as markdown')

    (ROOT / 'knowledge/sources.json').write_text(json.dumps({'files': manifest}, indent=1) + '\n', encoding='utf-8')
    by = {}
    for m in manifest:
        by[m['kind']] = by.get(m['kind'], 0) + 1
    print(f'sources: {len(manifest)} files -> knowledge/sources/ {by}', file=sys.stderr)


if __name__ == '__main__':
    main()
