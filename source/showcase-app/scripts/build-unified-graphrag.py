#!/usr/bin/env python3
"""Builds Ask DeepGrid's unified GraphRAG index (app/data/graphrag-unified-index.json).

    npm run graph:index      (uv run --with pymupdf python scripts/build-unified-graphrag.py)

The DG32 site's scripts/build-unified-graphrag.py, extended to the showcase's two-part corpus:
  1. graph nodes and edges from graphify's graph over knowledge/sources/ (the DG32 site's 42 documents and this
     repository's DeepGrid documents), with their community names
  2. catalog nodes: the DG32 catalog in app/data/deepgrid-knowledge.ts (parsed exactly as the DG32 builder does)
     and the showcase catalog in app/data/showcase-catalog.json, plus the catalog's domain edges
  3. chunks: every page of the DG32 site's 8 PDFs (as the DG32 builder does, with its document numbers), and every
     showcase document as Doc #7 (product portfolio), #8 (memoranda and research) or #9 (financial workbooks).
     A showcase chunk carries `nav`, the place on this page that shows it (a slide, a dossier, a memorandum chapter).
  4. one TF-IDF vocabulary over all of it
"""
import json
import math
import re
import subprocess
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'knowledge/sources'

# DG32 documents: the DG32 builder's own metadata
DR_PDF_META = {
    'deepgrid-mature-node-silicon-master-whitepaper-v3.pdf': {'title': 'Master Whitepaper v3 (Mature-Node Silicon)', 'docNum': '05', 'size': '5.4 MB', 'spec': './downloads/docs/deepgrid-mature-silicon-architecture.md'},
    'deepgrid-sku-compendium-technical-annex-v3.pdf': {'title': 'Technical Annex v3 (10 SKUs, D100 & SDV)', 'docNum': '02', 'size': '4.8 MB', 'spec': './downloads/docs/deepgrid-sku-compendium-architecture.md'},
    'deepgrid-dg32-ai-30-use-cases.pdf': {'title': 'Thirty Use Cases, No Accelerator', 'docNum': '01', 'size': '414 KB', 'spec': './downloads/docs/deepgrid-dg32-ai-architecture.md'},
    'deepgrid-dshot-rx-block-spec.pdf': {'title': 'Hardware DShot RX Specification', 'docNum': '03', 'size': '345 KB', 'spec': './downloads/docs/deepgrid-dshot-rx-architecture.md'},
    'deepgrid-dg32-2dom-system-architecture.pdf': {'title': 'DG32-2DOM System Architecture', 'docNum': '04', 'size': '77 KB', 'spec': './downloads/docs/deepgrid-2dom-architecture.md'},
    'deepgrid-datasheets-qfn64.pdf': {'title': 'DG32 QFN-64 Engineering Datasheet', 'docNum': '06', 'size': '76 KB', 'spec': './downloads/docs/deepgrid-datasheets-engineering-spec.md'},
    'deepgrid-dg32-2dom-preliminary-datasheet.pdf': {'title': 'DG32-2DOM Preliminary Datasheet', 'docNum': '04', 'size': '40 KB', 'spec': './downloads/docs/deepgrid-2dom-architecture.md'},
    'deepgrid-dg32-lite-preliminary-datasheet.pdf': {'title': 'DG32-LITE Preliminary Datasheet', 'docNum': '06', 'size': '38 KB', 'spec': './downloads/docs/deepgrid-datasheets-engineering-spec.md'},
}
# showcase documents: title and pillar (Doc #7 portfolio, #8 memoranda & research, #9 financials)
SC_DOCS = {
    'papers/information-memorandum-v2-aug-2026.pdf': ('Information Memorandum v2 (Aug 2026)', '08'),
    'papers/bp1a-india-autonomous-trucking-plan.pdf': ('BP1A India Autonomous Trucking Plan', '08'),
    'papers/bp1b-usa-proposal.pdf': ('BP1B USA Proposal', '08'),
    'papers/deepgrid-brief-shravan-mayookh.pdf': ('DeepGrid Brief (Shravan, Mayookh)', '08'),
    'converted/information-memorandum-june-2026.md': ('Information Memorandum (June 2026)', '08'),
    'converted/investor-briefing-jul-2026.md': ('Investor Briefing (Jul 2026)', '08'),
    'converted/showcase-investment-memorandum.md': ('Investment Memorandum', '08'),
    'converted/showcase-use-cases.md': ('Commercial Use Cases', '08'),
    'converted/showcase-product-dossiers.md': ('Product Dossiers', '07'),
    'converted/product-portfolio-deck-104-slides.md': ('Product Portfolio Deck (104 slides)', '07'),
}
CHAPTERS = {'Executive summary': 'summary'}
# this site's source documents, published as downloads (./downloads/showcase/), so a showcase answer offers its
# file the way a DG32 answer offers its PDF. The business plan is the copy without Payroll and Cap Table.
DOWNLOADS = {
    'papers/information-memorandum-v2-aug-2026.pdf': 'deepgrid-information-memorandum-v2-aug-2026.pdf',
    'papers/bp1a-india-autonomous-trucking-plan.pdf': 'deepgrid-bp1a-india-autonomous-trucking-plan.pdf',
    'papers/bp1b-usa-proposal.pdf': 'deepgrid-bp1b-usa-proposal.pdf',
    'papers/deepgrid-brief-shravan-mayookh.pdf': 'deepgrid-brief-shravan-mayookh.pdf',
    'office/icp-and-gtm-strategy-jul-2026.docx': 'deepgrid-icp-and-gtm-strategy-jul-2026.docx',
    'office/financial-model-v3-sept-2026.xlsx': 'deepgrid-financial-model-v3-sept-2026.xlsx',
    'office/business-plan-v2.xlsx': 'deepgrid-business-plan-v2.xlsx',
    # documents indexed from converted text (image-only PDFs via OCR, the deck via slide text): the originals
    'converted/information-memorandum-june-2026.md': 'deepgrid-information-memorandum-june-2026.pdf',
    'converted/investor-briefing-jul-2026.md': 'deepgrid-investor-briefing-jul-2026.pdf',
    'converted/product-portfolio-deck-104-slides.md': 'deepgrid-product-portfolio-104-slides.pptx',
}
# where those originals come from (the rest are copied from knowledge/sources/)
ORIGINALS = {
    'converted/information-memorandum-june-2026.md': Path('/mnt/c/Users/sheke/OneDrive/Desktop/DeepGrid_Semi_-Aravind.pdf'),
    'converted/investor-briefing-jul-2026.md': Path('/mnt/c/Users/sheke/Downloads/DeepGrid_Semi_Investor_Briefing.pdf'),
    'converted/product-portfolio-deck-104-slides.md': ROOT.parent / 'documents/DeepGrid-Semi-Product-Portfolio-104-Slides-Embedded-reviewed.pptx',
}


def strip_em_dash(s):
    """Runs on the serialised JSON, where an em dash is the escape \\u2014 and a newline is \\n."""
    s = re.sub(r'(\\n) *\\u2014 *', r'\1', s)
    s = re.sub(r' *\\u2014 *', ', ', s)
    s = re.sub(r', *,', ',', s)
    return re.sub(r', *([.;:!?])', r'\1', s)


def human(n):
    return f'{n / 1048576:.1f} MB' if n >= 1048576 else f'{max(1, round(n / 1024))} KB'


def publish_downloads():
    import shutil
    out = ROOT / 'public/downloads/showcase'
    out.mkdir(parents=True, exist_ok=True)
    published = {}
    for rel, name in DOWNLOADS.items():
        src = ORIGINALS.get(rel, SRC / rel)
        if src.exists():
            shutil.copyfile(src, out / name)
        if (out / name).exists():
            published[rel] = (f'./downloads/showcase/{name}', human((out / name).stat().st_size))
    return published


def pdf_pages(path):
    doc = fitz.open(path)
    for i in range(len(doc)):
        text = doc[i].get_text().strip()
        if len(text) >= 60:
            yield i + 1, text


def pack(text, limit=1800):
    """Split text into passages of at most `limit` characters without losing any of it: break at sentence ends, and
    split a longer sentence at a space, never inside a word or a figure. (Passages used to be cut at exactly 1,800
    characters: PDF pages lost everything after that, about 94,000 characters across 124 pages, and Markdown sections
    were split mid-number, turning "-Rs 5.81 Cr" into "-Rs 5.")"""
    text = re.sub(r'\s+', ' ', text).strip()
    parts, cur = [], ''
    for seg in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9(₹$|])', text):
        while len(seg) > limit:
            cut = seg.rfind(' ', 0, limit)
            cut = cut if cut > limit // 2 else limit
            if cur:
                parts.append(cur)
                cur = ''
            parts.append(seg[:cut].strip())
            seg = seg[cut:].strip()
        if cur and len(cur) + 1 + len(seg) > limit:
            parts.append(cur)
            cur = seg
        else:
            cur = f'{cur} {seg}'.strip()
    if cur:
        parts.append(cur)
    return parts


def md_sections(path):
    """'## ' sections without their heading line, packed to ~1,800 characters. Lines of scraped page furniture
    (link lists, app promos, share buttons) are dropped: they are not the document's content."""
    text = path.read_text(encoding='utf-8', errors='ignore')
    junk = re.compile(r'\]\(https?://|download the .* app|on your smartphone|subscribe|sign in|cookie|share on|follow us', re.I)
    for part in re.split(r'\n(?=## )', text):
        lines = part.strip().splitlines()
        if not lines:
            continue
        head = lines[0].lstrip('#').strip() if lines[0].startswith('#') else ''
        body_lines = [l for l in (lines[1:] if head else lines) if not junk.search(l)]
        body = re.sub(r'\s+', ' ', ' '.join(l.lstrip('#').strip() for l in body_lines)).strip()
        if len(body) < 60 or junk.search(head):
            continue
        for part in pack(body):
            yield head or path.stem, part


def main():
    graph = json.loads((ROOT / 'knowledge/graphify-out/graph.json').read_text())
    nodes = {}
    for n in graph['nodes']:
        cname = n.get('community_name') or 'DeepGrid'
        src = str(n.get('source_file', '')).replace('sources/', '').split('graphify-out/converted/')[-1]
        nodes[n['id']] = {'id': n['id'], 'name': n.get('label', n['id']), 'shortName': n.get('norm_label', n.get('label', n['id'])),
                          'category': n.get('file_type', 'concept'), 'communityId': n.get('community', 0), 'communityName': cname,
                          'description': f"{n.get('label', n['id'])} — {cname}. {n.get('rationale') or ''} (from {src})".replace('  ', ' '),
                          'origin': 'graphify'}
    edges = [{'from': l['source'], 'to': l['target'], 'label': l.get('relation', 'relates_to'), 'weight': l.get('weight', 1.0)} for l in graph['links']]
    print(f"Graphify base: {len(nodes)} nodes, {len(edges)} edges")

    # DG32 catalog, parsed exactly as the DG32 builder does
    ts_code = (ROOT / 'app/data/deepgrid-knowledge.ts').read_text(encoding='utf-8')
    catalog_blocks = re.findall(
        r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"],.*?tagline:\s*['\"]([^'\"]+)['\"].*?summary:\s*['\"]([^'\"]+)['\"].*?citation:\s*['\"]([^'\"]+)['\"]",
        ts_code, re.DOTALL)
    domain_communities = {
        'sku': (20, '10-SKU Sovereign Silicon Portfolio'), 'ai': (21, '30 Industrial Edge AI Use Cases & Scalar DSP'),
        'strategy': (22, 'Sovereign Dual-Foundry & Mature-Node Economics'), 'architecture': (23, 'Deterministic Motor Control & Lockstep Safety RTL'),
        'defense': (24, 'Statutory Defence Moats & DAP-2020 Make-II'), 'finance': (25, 'Seed Capital, Financial Model & Charlie Munger Audits')}
    for item_id, name, tagline, summary, citation in catalog_blocks:
        if item_id.startswith('sc-'):
            continue
        cat = 'architecture'
        if 'sku' in item_id or 'd100' in item_id: cat = 'sku'
        elif 'ai' in item_id or 'usecases' in item_id or 'dsp' in item_id or 'tree' in item_id: cat = 'ai'
        elif 'dap' in item_id or 'boxes' in item_id or 'pil' in item_id: cat = 'defense'
        elif 'fund' in item_id or 'munger' in item_id or 'crash' in item_id or 'price' in item_id: cat = 'finance'
        elif 'three-factory' in item_id or 'import' in item_id or 'loop' in item_id: cat = 'strategy'
        cid, cname = domain_communities.get(cat, (23, 'Deterministic Motor Control & Lockstep Safety RTL'))
        nodes[item_id] = {'id': item_id, 'name': name, 'shortName': name[:30], 'category': cat, 'communityId': cid, 'communityName': cname,
                          'description': f"{tagline}. {summary}", 'citation': citation, 'origin': 'domain_knowledge'}
    for src, dst, lbl in re.findall(r"\{\s*from:\s*['\"]([^'\"]+)['\"],\s*to:\s*['\"]([^'\"]+)['\"],\s*label:\s*['\"]([^'\"]+)['\"]", ts_code):
        edges.append({'from': src, 'to': dst, 'label': lbl, 'weight': 1.5})

    # showcase catalog, and its links into the graph: a catalog item describes the graph entities named after it
    # Doc #8/#9 cards (sc-theme-*) restate the curated themes for the Specification Dossiers tab only; as graph
    # entities they compete with the themes they restate (measured: DG32 routing fell from 24/33 to 23/33)
    sc = [it for it in json.loads((ROOT / 'app/data/showcase-catalog.json').read_text()) if not it['id'].startswith('sc-theme-')]
    for it in sc:
        nodes[it['id']] = {'id': it['id'], 'name': it['name'], 'shortName': it['name'][:30], 'category': it['category'], 'communityId': 30,
                           'communityName': 'DeepGrid Product Portfolio', 'description': f"{it['tagline']}. {it['summary']}",
                           'citation': it['citation'], 'origin': 'domain_knowledge'}
    alias = {'sc-soc2': ['soc2', '28nm automotive soc']}
    for it in sc:
        key = it['id'][3:]
        words = [key.replace('-', ' '), key] + ([w.lower() for w in re.findall(r'\b[A-Z]{1,3}\d{1,3}\b', it['name'])])
        alias.setdefault(it['id'], [w for w in words if len(w) >= 3])
    for n in list(nodes.values()):
        if n['origin'] != 'graphify':
            continue
        label = n['name'].lower()
        for cid, words in alias.items():
            if any(re.search(rf'(^|[^a-z0-9]){re.escape(w)}([^a-z0-9]|$)', label) for w in words):
                edges.append({'from': cid, 'to': n['id'], 'label': 'describes', 'weight': 1.5})
    for it in sc:
        if it['id'] != 'sc-soc2':
            edges.append({'from': it['id'], 'to': 'sc-soc2', 'label': 'runs_on', 'weight': 1.5})
    print(f"Unified graph: {len(nodes)} nodes, {len(edges)} edges")

    chunks = []
    # part 1: the DG32 PDFs, page by page, as the DG32 builder does
    for p in sorted((SRC / 'dr').rglob('*.pdf')):
        meta = DR_PDF_META.get(p.name, {'title': p.stem, 'docNum': '05', 'size': '', 'spec': ''})
        for page, text in pdf_pages(p):
            lines = [l.strip() for l in text.splitlines() if len(l.strip()) > 3]
            section = next((l for l in lines[:5] if re.match(r"^[0-9]+(\.[0-9]+)*\s+[A-Z]", l) or 'Section' in l or 'Specification' in l), f'Page {page}')
            # a long page becomes several passages; the first keeps the page's id so existing references hold
            for n, part in enumerate(pack(text), 1):
                chunks.append({'id': f'pdf_{p.stem}_p{page}' + (f'_{n}' if n > 1 else ''), 'docTitle': meta['title'], 'docNum': meta['docNum'],
                               'pdfPath': f'./downloads/docs/{p.name}', 'pdfSize': meta['size'], 'specPath': meta['spec'],
                               'pageLabel': f'p. {page}', 'section': section, 'text': part})

    # part 2: every showcase document
    page_units = json.loads(subprocess.run(['node', '-e', "import('./scripts/lib/showcase-content.mjs').then(m=>process.stdout.write(JSON.stringify(m.loadContent().units.filter(u=>['memo','product','usecase','slide'].includes(u.kind)))))"],
                                           cwd=ROOT, capture_output=True, text=True, check=True).stdout)
    nav_by_title = {}
    for u in page_units:
        s = u['source']
        nav = {'product': f"portfolio?product={s.get('productId')}", 'slide': f"slides?slide={s.get('slide')}",
               'memo': f"investment?chapter={s.get('chapter')}", 'usecase': f"investment?chapter=usecases&usecase={s.get('useCase', '')}"}[s['kind']]
        nav_by_title.setdefault(u['title'], nav)

    per_doc = {}

    downloads = publish_downloads()
    office_key = {'financial-model': 'office/financial-model-v3-sept-2026.xlsx', 'business-plan': 'office/business-plan-v2.xlsx',
                  'icp-and-gtm': 'office/icp-and-gtm-strategy-jul-2026.docx'}

    def add(doc_key, title, num, section, page_label, text, nav=''):
        # stable ids: numbered within their own document, so editing one document never renumbers another
        slug = re.sub(r'[^a-z0-9]+', '_', doc_key.lower())
        per_doc[slug] = per_doc.get(slug, 0) + 1
        file = downloads.get(doc_key) or downloads.get(next((v for k, v in office_key.items() if k in doc_key), ''), ('', ''))
        chunks.append({'id': f"sc_{slug}_{per_doc[slug]}", 'docTitle': title, 'docNum': num, 'pdfPath': file[0], 'pdfSize': file[1],
                       'specPath': '', 'pageLabel': page_label, 'section': section, 'text': text, 'nav': nav})

    # The converted deck numbers only the slides that carry text, so after the first video-only slide its "Slide N"
    # falls behind the real slide (and the slide images). knowledge/deck-slides.json is the deck itself, read with
    # python-pptx; each deck section is placed on the slide whose text it shares most (all 114 matched at 0.6 or more).
    deck_slides = json.loads((ROOT / 'knowledge/deck-slides.json').read_text()) if (ROOT / 'knowledge/deck-slides.json').exists() else []
    words = lambda t: set(w for w in re.findall(r'[a-z0-9]+', t.lower()) if len(w) > 2)
    deck_words = [words(d['text'] + ' ' + d['notes']) for d in deck_slides]
    def true_slide(text):
        if not deck_words: return None
        t = words(text)
        score = [len(t & d) / max(1, len(t)) for d in deck_words]
        best = max(range(len(score)), key=score.__getitem__)
        return str(best + 1) if score[best] >= 0.6 else None

    for rel, (title, num) in SC_DOCS.items():
        path = SRC / rel
        if rel.endswith('.pdf'):
            for page, text in pdf_pages(path):
                head = next((l.strip() for l in text.splitlines() if len(l.strip()) > 8), f'Page {page}')[:90]
                for part in pack(text):
                    add(rel, title, num, head, f'p. {page}', part)
        else:
            for head, body in md_sections(path):
                m = re.match(r'Slide (\d+)', head)
                n = m and (true_slide(body) or m.group(1))
                if n: head = f'Slide {n}'
                nav = f'slides?slide={n}' if n else nav_by_title.get(head, '')
                add(rel, title, num, head[:90], (f'slide {n}' if n else ''), body, nav)
    for md in sorted((SRC / 'markdown').glob('*.md')):
        title = 'Deck narration' if md.name.startswith(('narration', 'storyboard')) else f"Research — {md.stem.replace('-', ' ')}"
        for head, body in md_sections(md):
            add(f'markdown/{md.name}', title, '07' if title == 'Deck narration' else '08', head[:90], '', body)
    for side in sorted((SRC / 'graphify-out/converted').glob('*.md')):
        title = {'financial-model': 'Financial Model v3 (Sept 2026)', 'business-plan': 'Business Plan v2', 'icp-and-gtm': 'ICP and GTM Strategy (Jul 2026)'}
        name = next((v for k, v in title.items() if side.name.startswith(k)), side.stem)
        for head, body in md_sections(side):
            add(f'office/{side.name}', name, '08' if name.startswith('ICP') else '09', head[:90], '', body)
    print(f"Downloads published: {len(downloads)}; chunks with a download: {sum(1 for c in chunks if c['pdfPath'].startswith('./downloads/showcase/'))}")
    print(f"Chunks: {len(chunks)} ({sum(1 for c in chunks if c['id'].startswith('pdf_'))} DG32 PDF pages, "
          f"{sum(1 for c in chunks if c['id'].startswith('sc_'))} showcase)")

    # one vocabulary, as the DG32 builder does
    all_texts = [f"{n['name']} {n['communityName']} {n['description']}" for n in nodes.values()] + \
                [f"{c['docTitle']} {c['section']} {c['text']}" for c in chunks]
    vocab = sorted({w for t in all_texts for w in re.findall(r"[a-z0-9_]+", t.lower()) if len(w) > 2})
    vocab_idx = {w: i for i, w in enumerate(vocab)}
    idf = [0.0] * len(vocab)
    for t in all_texts:
        for w in set(re.findall(r"[a-z0-9_]+", t.lower())):
            if w in vocab_idx:
                idf[vocab_idx[w]] += 1.0
    idf = [math.log((len(all_texts) + 1.0) / (c + 1.0)) + 1.0 for c in idf]

    def vectorize(text):
        vec = {}
        for w in re.findall(r"[a-z0-9_]+", text.lower()):
            if w in vocab_idx:
                vec[vocab_idx[w]] = vec.get(vocab_idx[w], 0.0) + 1.0
        norm = math.sqrt(sum((c * idf[i]) ** 2 for i, c in vec.items())) or 1.0
        return {str(i): round(c * idf[i] / norm, 4) for i, c in vec.items()}

    out = {'nodes': [dict(n, vector=vectorize(f"{n['name']} {n['communityName']} {n['description']}")) for n in nodes.values()],
           'edges': edges, 'chunks': [dict(c, vector=vectorize(f"{c['docTitle']} {c['section']} {c['text']}")) for c in chunks],
           'vocab': vocab, 'idf': [round(x, 4) for x in idf]}
    dest = ROOT / 'app/data/graphrag-unified-index.json'
    # Visible copy uses no em dash (scripts/strip-em-dash.mjs): excerpts and descriptions shown in
    # answers get a comma instead. Tokens are unaffected, so the TF-IDF vectors above still hold.
    dest.write_text(strip_em_dash(json.dumps(out)), encoding='utf-8')
    print(f"Wrote unified GraphRAG index to {dest} ({round(dest.stat().st_size / 1024, 1)} KB)")


if __name__ == '__main__':
    main()
