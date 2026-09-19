// Writes the Technology page's story (app/data/tech-story.json): the silicon told to executives and investors, chapter
// by chapter, in the Overview's shape: a kicker, a verdict headline, a lede on why it matters, story pills, and the
// technical detail beneath as reference, with labelled links to the exact slides and memorandum pages.
//
// Each chapter is written only from its own sources: the deck slides it names (text, narration, speaker notes, from
// knowledge/deck-slides.json and app/slide-notes.json) and the GraphRAG passages it names. Gates from lib/brief-kit.mjs:
// every figure must appear in the chapter's sources; no maturity claim the sources do not make; no talk of slides or
// narration; where sources disagree on a figure (39.3 TOPS on slide 5, 34.4 TOPS on slide 44), say which says which.
//   npm run graph:tech [-- --force]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {MODEL, write, unsupported, overclaims, presentationTalk, noDash} from './lib/brief-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const FORCE = process.argv.includes('--force');
const deck = read('knowledge/deck-slides.json'), notes = read('app/slide-notes.json');
const chunks = new Map(read('app/data/graphrag-unified-index.json').chunks.map(c => [c.id, c]));
const OUT = path.join(ROOT, 'app/data/tech-story.json');
const previous = fs.existsSync(OUT) ? read('app/data/tech-story.json') : {chapters: []};

// The story, in order. Sources are fixed here so a chapter can never borrow another's facts.
// A passage is cited by the title given here: the memoranda's own headings extract letter-spaced ("P R O D U C T").
const IM2 = 'sc_papers_information_memorandum_v2_aug_2026_pdf_';
const CHAPTERS = [
  {id: 'silicon', kicker: 'The silicon', slides: [5], passages: [[IM2 + '11', 'Product architecture'], [IM2 + '18', 'The six-domain die']],
    brief: 'What the one 28 nm die is, and why one die under every product matters commercially. Leave out the NRE and tapeout cost: the memorandum and the financial model give different figures, and costs belong to the financial chapters.'},
  {id: 'domains', kicker: 'Six domains', slides: [5], passages: [['sc_converted_showcase_investment_memorandum_md_16', 'Six chiplets, one 57 mm² die'], [IM2 + '18', 'The six-domain die']],
    brief: 'The six compute domains on the die, and how each one is a product line in its own right. Make the pills the six domains themselves: value is the domain code and its area, label is what it does. Do not repeat die-level figures (TOPS, bandwidth, NRE, yield). Keep the detail to one short sentence per domain.'},
  {id: 'sensors', kicker: 'Sensor to compute', slides: [24, 25, 26], passages: [['sc_converted_information_memorandum_june_2026_md_11', 'The compute box: 11 sensors in, AD2 out']],
    brief: 'Eleven sensors converge on one compute part; what each sensor does, and the frame budget.'},
  {id: 'measured', kicker: 'Measured, not claimed', slides: [28, 29, 30, 46],
    brief: 'How the 8.6 ms claim and the silicon advantage have to be proven, in stages, before an investor should rely on them.'},
  {id: 'data', kicker: 'Compute waits on data', slides: [36, 37, 38, 39],
    brief: 'Why arithmetic units sit idle when data queues, and the per-core data engine the design proposes.'},
  {id: 'cube', kicker: 'The eight-layer cube', slides: [41, 42, 43, 44, 45], passages: [[IM2 + '14', 'The 8×8×8 systolic cube']],
    brief: 'The 8x8x8 compute cube, what it does to arithmetic per cycle, and the data path it needs; state both TOPS figures and which source gives which. The headline must not pick either TOPS figure. Call the sources "the portfolio deck" (56 cubes, 34.4 TOPS) and "the Information Memorandum" (64 cubes, 39.3 TOPS), never by internal names.'},
  {id: 'horizon', kicker: 'The far horizon', slides: [103], passages: [[IM2 + '21', 'Roadmap: SoC4-A, FY30 and later'], [IM2 + '22', 'Roadmap: SoC4-A, FY30 and later']],
    brief: 'The next-generation part and data-centre box: optional upside that this raise does not fund.'},
];

const slideText = n => `SLIDE ${n} (${notes[n - 1].title})\nON THE SLIDE: ${deck[n - 1].text.replace(/DEEPGRID SEMI · PRODUCT LINES · MANAGEMENT PROJECTIONS\s*\d*/g, '')}\nNARRATION: ${notes[n - 1].script}\nSPEAKER NOTES: ${deck[n - 1].notes}`;
const passageText = id => { const c = chunks.get(id); if (!c) throw new Error(`passage ${id} is not in the index`); return `PASSAGE ${id} (${c.docTitle}, ${c.section}${c.pageLabel ? ', ' + c.pageLabel : ''})\n${c.text}`; };

// labelled links, one per document page; a page-numbered chunk ("p. 9" or "Page 10") opens the PDF at that page
function refs(ch) {
  const seen = new Set();
  return (ch.passages || []).flatMap(([id, title]) => {
    const c = chunks.get(id), page = /^p\. (\d+)$/.exec(c.pageLabel || '')?.[1] || /^Page (\d+)$/.exec(c.section)?.[1];
    const href = c.pdfPath ? c.pdfPath + (page ? '#page=' + page : '') : '';
    const key = href || c.nav || id;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{id, doc: c.docTitle, title, page: page ? 'page ' + page : '', href, nav: c.nav || ''}];
  });
}

const SYSTEM = `You write one chapter of the Technology page on DeepGrid Semi's investor website. Readers are business executives
and investors, not chip designers: lead with why it matters to the business, then give the technical substance as the
reference beneath. Use ONLY the source material given. Return JSON only:

{"headline": "one sentence, a verdict an investor can repeat (max 14 words)",
 "lede": "two sentences: what this is and why it matters commercially",
 "pills": [{"value": "short value, at most 5 words", "label": "what it is, at most 4 words"}],
 "detail": "3 to 5 sentences of technical detail for the reader who wants it, precise and plain"}

Rules:
- 3 to 6 pills: the chapter's key figures and named facts.
- Copy figures exactly as the sources give them; never add, subtract or derive new numbers.
- If two sources give different figures for the same thing, state both and say which source gives which.
- Label forecasts and targets as such; say "design target", "estimate" or "simulation" where the sources do. Never call
  anything proven, validated, qualified or certified unless the source says so.
- The chip is not yet fabricated in 28 nm; do not imply measured silicon performance.
- No hype words; no mention of slides, decks, narration, notes or passages.`;
const VERSION = crypto.createHash('sha256').update(SYSTEM + MODEL).digest('hex').slice(0, 12);

const out = {chapters: []};
for (const ch of CHAPTERS) {
  const source = [...ch.slides.map(slideText), ...(ch.passages || []).map(([id]) => passageText(id))].join('\n\n');
  const hash = crypto.createHash('sha256').update(VERSION + ch.brief + source).digest('hex').slice(0, 16);
  const prev = previous.chapters.find(c => c.id === ch.id);
  if (prev && !FORCE && prev.hash === hash) { out.chapters.push({...prev, sources: (ch.passages || []).map(([id]) => id), passages: refs(ch)}); console.error(`= ${ch.id} (unchanged)`); continue; }
  // figures are checked against the sources' words, not the SLIDE n labels (a slide number is not a fact), plus the one
  // platform fact the rules above state: the part is 28 nm
  const facts = source.replace(/^SLIDE \d+ /gm, '').replace(/^PASSAGE \S+ /gm, '') + ' 28 nm';
  const check = t => {
    const bad = [];
    const all = [t.headline, t.lede, t.detail, ...(t.pills || []).flatMap(p => [p.value, p.label])].join(' ');
    for (const f of unsupported(all, facts)) bad.push(`figure ${f} is not in the sources`);
    for (const w of overclaims(all, source)) bad.push(`"${w}" is not a claim the sources make`);
    const talk = presentationTalk(all);
    if (talk) bad.push(`talks about "${talk}" instead of the silicon`);
    t.pills = (t.pills || []).filter(p => p.value && p.value.split(/\s+/).length <= 6);
    return bad;
  };
  const done = t => !!t?.headline && !!t.lede && !!t.detail && t.pills.length >= 3 && check(t).length === 0;
  const {t, dropped} = await write([{role: 'system', content: SYSTEM}, {role: 'user', content: `Chapter: ${ch.kicker}. ${ch.brief}\n\nSources:\n\n${source}`}], check, done);
  if (!t) throw new Error(`${ch.id}: no version passed the gates: ${dropped.slice(0, 3).join(' | ')}`);
  out.chapters.push({id: ch.id, kicker: ch.kicker, headline: t.headline, lede: t.lede, pills: t.pills.slice(0, 6), detail: t.detail,
    slides: ch.slides, sources: (ch.passages || []).map(([id]) => id), passages: refs(ch),
    hash, model: MODEL});
  fs.writeFileSync(OUT, noDash(JSON.stringify(out, null, 1)) + '\n');
  console.error(`+ ${ch.id}: ${t.pills.length} pills`);
}
fs.writeFileSync(OUT, noDash(JSON.stringify(out, null, 1)) + '\n');
console.error(`tech story: ${out.chapters.length} chapters -> app/data/tech-story.json`);
