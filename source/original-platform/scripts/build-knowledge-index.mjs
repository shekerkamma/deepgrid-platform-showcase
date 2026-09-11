/**
 * Build-time knowledge index for the A2UI briefing agent.
 *
 * WHY: buildAnswer()'s fallback branch used to return one hardcoded card for
 * every unmatched question, so "what is the churn risk", "who are the
 * competitors" and "what if the tapeout slips" all produced the same BLUF.
 * Meanwhile src/a2ui/data.ts imported five dossier JSONs that nothing ever
 * read.
 *
 * This flattens those JSONs, plus the 104-slide deck, into retrievable units
 * with citations. Retrieval happens in the browser against this file, so the
 * page stays a static artifact: no API key, no backend, no runtime cost, and
 * the same question always returns the same answer.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const D = (f) => JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data', f), 'utf8'));
const units = [];
/* Passages arrive from three pipelines that each encode punctuation their own
 * way, and the page renders them as PLAIN TEXT -- so an entity or a markdown
 * escape shows up literally to the reader. Measured on the 883-unit index:
 * 47 passages printing "&#8377;" or "&times;" where a rupee sign or a multiply
 * sign belongs, and 3 printing "\\$47.9M" for "$47.9M". Both became visible the
 * moment research passages started appearing on cards, and both are cheap to
 * fix here, once, rather than in every renderer. */
const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '\u2013', mdash: '\u2014', times: '\u00d7', rsquo: '\u2019', lsquo: '\u2018',
  ldquo: '\u201c', rdquo: '\u201d', hellip: '\u2026', deg: '\u00b0', middot: '\u00b7' };
const clean = (t) => typeof t !== 'string' ? t : t
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
  /* Markdown escapes only: a backslash before ASCII punctuation. Leaves a
   * genuine backslash (a Windows path, a LaTeX macro) untouched. */
  .replace(/\\([$_*[\]()#+\-.!`~>|])/g, '$1')
  /* Source markers. The audit documents carry [S1]..[S9] footnote keys into
     prose, and the legend that gives them meaning is not in the passage, so on
     an answer card they are noise: "88% blended GM at FY2032. [S1] Prior
     analysis: [S1] ...". 125 of them across a 64-query sample. */
  .replace(/\s*\[S\d+\]/g, '')
  /* Space before punctuation, an extraction artifact: "the fixed cost block ,
     payroll , R&D". Only ever wrong -- no English sets a comma off with a
     leading space -- and it is the single most common defect in otherwise
     clean authored prose. */
  .replace(/\s+([,;:.!?])/g, '$1')
  .replace(/[ \t]{2,}/g, ' ')
  /* OCR glyph substitutions, each confirmed against its surrounding text rather
     than guessed from the codepoint:
       \u4e00  a long dash    "VLA models run on-chip\u4e00 Models"  -> " - "
       \u5929  the rupee sign "What 45 Cr buys \u592945 Cr 28nm"     -> "\u20b945 Cr"
       \u6d77  a capital D    "\u6d77EEPGRID A100 Cab & Ride"        -> "DEEPGRID"
       ?<digit> the rupee sign "EBITDA to?536 Crore"          -> "to \u20b9536 Crore"
     Nine CJK glyphs and five stray question marks across 884 passages. Left
     alone, "\u592945 Cr" is both unreadable and unsearchable, since no query
     will ever contain that character. */
  .replace(/\u6d77(?=EEPGRID)/g, 'D')
  .replace(/\u5929(?=[\d,])/g, '\u20b9')
  .replace(/\?(?=[\d,])/g, '\u20b9')
  .replace(/\s*\u4e00\s*/g, ' - ')
  .replace(/[ \t]{2,}/g, ' ')
  .trim();
/* How unreadable a passage is, per 1,000 characters.
 *
 * A fifth of this corpus is OCR of scanned pages and flattened spreadsheet
 * rows, and those passages were winning queries and being shown as answers:
 * "Who is the CEO?" returned "13. FOUNDER&TEAM 20 Yearsof Execution Proof-The
 * Team That Wins This Market ARAVINDPRASADG AYASKHAN"; "How many patents are
 * there?" returned "EEPGRID SEM Raising Pre-Series A ... 天45 Cr", where the
 * rupee sign had OCR'd to a CJK glyph.
 *
 * Measured over 884 passages: 199 score >= 4. They cluster by kind -- Document
 * audit 27/34, Competitor 54/84, Information memorandum 20/32, Slide 77/192 --
 * while Video narration (1 of 328) and Investor memorandum (0 of 65) are
 * authored prose and essentially clean.
 *
 * Scored here rather than in the engine so it is computed once, ships with the
 * index, and can be inspected without running a query. */
const noiseScore = (body) => {
  const b = String(body || '');
  const n = (re) => (b.match(re) || []).length;
  const raw =
    n(/\b[A-Z]{6,}\b/g)              // FINANCIALOVERVIEW, ARAVINDPRASADG
    + n(/\br \d+:/g) * 2              // r 5: flattened spreadsheet rows
    + n(/\[S\d\]/g)                  // [S1] source markers left in prose
    + n(/\d+(\.\d+)?(\s+\d+(\.\d+)?){4,}/g) * 2   // bare number runs
    + n(/[\u4e00-\u9fff]/g) * 3;      // ₹ OCR'd to a CJK glyph
  return +(raw * (1000 / Math.max(200, b.length))).toFixed(2);
};

const push = (u) => {
  if (!u.body || u.body.trim().length <= 40) return;
  const body = clean(u.body);
  units.push({ ...u, title: clean(u.title), body, noise: noiseScore(body) });
};
const flat = (v) => Array.isArray(v) ? v.map(flat).join(' · ')
  : (v && typeof v === 'object') ? Object.values(v).map(flat).join(' · ')
  : (v == null ? '' : String(v));

// ── narrative.json: the hostile questions are the highest-value units here,
//    because they are already question-shaped diligence answers.
const nar = D('narrative.json');
(nar.hostile_questions || []).forEach(([q, a], i) => push({
  id: `hq-${i}`, kind: 'Hostile question', title: q, body: a,
  source: 'Competitive dossier · hostile questions',
}));
if (nar.core_message) push({ id: 'core', kind: 'Core message', title: 'The core message',
  body: nar.core_message, source: 'Competitive dossier · narrative' });
if (nar.scqa) push({ id: 'scqa', kind: 'Framing', title: 'Situation, complication, question, answer',
  body: flat(nar.scqa), source: 'Competitive dossier · SCQA' });
(nar.acts || []).forEach((a, i) => push({
  id: `act-${i}`, kind: 'Argument', title: `${a.no || ''} ${a.name || ''}`.trim(),
  body: [a.question, a.settles].filter(Boolean).join(' '), source: 'Competitive dossier · argument arc',
}));
if (nar.pyramid) {
  push({ id: 'pyr', kind: 'Governing thought', title: 'Governing thought',
    body: nar.pyramid.governing_thought || '', source: 'Competitive dossier · pyramid' });
  (nar.pyramid.supports || []).forEach((s, i) => push({
    id: `pyr-${i}`, kind: 'Supporting claim', title: s.claim || `Support ${i + 1}`,
    body: [s.because, s.proof].filter(Boolean).join(' '), source: 'Competitive dossier · pyramid',
  }));
}

// ── strategy-sections.json: ~18 analytical sections
const strat = D('strategy-sections.json');
Object.entries(strat).forEach(([key, sec]) => {
  if (!sec || typeof sec !== 'object' || Array.isArray(sec)) return;
  const title = sec.title || key;
  const body = [sec.sub, sec.sowhat, sec.note, sec.verdict, sec.read, sec.decision,
                sec.choice, sec.gate, sec.donotfund, sec.paragraph_note]
    .filter(Boolean).join(' ');
  const rows = flat(sec.rows || sec.levers || sec.plan || sec.modes || sec.quadrants || '');
  push({ id: `st-${key}`, kind: 'Strategy', title,
    body: [body, rows].filter(Boolean).join(' · ').slice(0, 1400),
    source: `Competitive dossier · ${sec.kicker || key}` });
});

// ── company-profiles.json + scoring.json: the competitor set
const prof = D('company-profiles.json');
const scoring = D('scoring.json');
const scoreOf = Object.fromEntries((scoring.competitors || []).map((c) => [c.id || c.name, c]));
(prof.companies || []).forEach((c) => {
  const sc = scoreOf[c.id] || scoreOf[c.name] || {};
  push({ id: `co-${c.id || c.name}`, kind: 'Competitor', title: c.name,
    body: [c.sells, c.value, c.posture, c.evidence, c.read,
           sc.score != null ? `Composite score ${sc.score}.` : '', sc.ev || '']
      .filter(Boolean).join(' '),
    source: `Competitive dossier · ${c.tier || 'profile'}` });
});

// ── use-cases.json
const uc = D('use-cases.json');
(uc.use_cases || []).forEach((u) => push({
  id: `uc-${u.id}`, kind: 'Use case', title: u.title || u.short,
  body: [u.challenge, u.solution, (u.how || []).join(' '), u.risks, u.gate].filter(Boolean).join(' '),
  source: `Use cases · ${u.id}${u.standard ? ' · ' + u.standard : ''}`,
}));
if (uc.bounding_statement) push({ id: 'uc-bound', kind: 'Scope', title: 'The bounding statement',
  body: [uc.bounding_statement, uc.do_not_fund].filter(Boolean).join(' Do not fund: '),
  source: 'Use cases · scope' });

// ── the investor memorandum itself. It is the single most relevant corpus
//    for a diligence question and it lives on the same page: one big
//    dangerouslySetInnerHTML block in ExecutiveSummary.tsx. Strip the base64
//    figures first -- they are most of that file's 890 kB.
const execSrc = fs.readFileSync(path.join(root, 'src/components/ExecutiveSummary.tsx'), 'utf8');
{
  const start = execSrc.indexOf('dangerouslySetInnerHTML');
  const open = execSrc.indexOf('`', start);
  const close = execSrc.lastIndexOf('`');
  let html = execSrc.slice(open + 1, close);
  html = html.replace(/src="data:[^"]*"/g, 'src=""');          // drop base64
  html = html.replace(/<style[\s\S]*?<\/style>/g, '');
  const strip = (h) => h
    .replace(/<(script|svg)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, ', ').replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
  // split on section boundaries so each unit is one argument, not the whole memo
  const parts = html.split(/<section[^>]*>/i).slice(1);
  let kept = 0;
  parts.forEach((raw, i) => {
    const h = raw.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
    const title = h ? strip(h[1]) : `Memorandum section ${i + 1}`;
    const body = strip(raw);
    if (body.length < 120) return;
    // A memo section runs to several thousand characters; one truncated unit
    // per section would drop most of the document. Chunk on sentence
    // boundaries and carry the heading into every chunk so each one still
    // retrieves and still cites where it came from.
    const CHUNK = 950;
    const sentences = body.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [body];
    let buf = '';
    const flush = (n) => {
      if (buf.trim().length < 120) { buf = ''; return; }
      push({ id: `mem-${i}-${n}`, kind: 'Investor memorandum', title,
        body: buf.trim(), source: 'Investor executive summary' });
      kept++; buf = '';
    };
    let n = 0;
    for (const sent of sentences) {
      if ((buf + sent).length > CHUNK) flush(n++);
      buf += sent;
    }
    flush(n);
  });
  console.log(`  investor memorandum: ${kept} sections indexed`);
}

// ── the 104-slide master deck (this IS the PPTX: `body` is the on-slide
//    text, `script` the spoken line, `notes` the speaker note)
const slides = JSON.parse(fs.readFileSync(path.join(root, 'src/data/master_deck_indexed.json'), 'utf8'));
// master_deck_indexed.json staples TWO different SKUs into every record.
// `title` and `script` agree with each other; `body` and `notes` describe a
// SKU roughly fifteen slides later. Measured by locating each SKU per field:
//
//   T100 licence     title 59-62   script 59,60,62   notes 44-47
//   Thermal camera   title 75-78                     notes 59-63
//   4D radar pod     title 79-82                     notes 64-67
//
// Concatenating all four fields therefore produced one passage covering two
// products, cited by the wrong one -- "Thermal camera (aftermarket)?" returned
// the correct pod description under the label "slide 60 · T100 licence".
// 21 of the 41 slides with a comparable heading were mismatched.
//
// So the record is split along that seam. The offset is NOT used to repair it:
// it is close to 15 but not uniform, and guessing it would trade a visible
// defect for a silent one. The notes half is self-labelling instead
// ("Thermal camera (aftermarket) — what it is"), which needs no offset, and
// its citation carries the SKU rather than a slide number we cannot trust.
const NOTE_LABEL = /^\s*([A-Z][A-Za-z0-9 .\/&()+-]{2,60}?)\s*[—–-]\s*(.{3,})/;
let split = 0;
slides.forEach((s) => {
  push({
    id: `sl-${s.slide}`, kind: 'Slide', title: s.title, slide: s.slide,
    body: String(s.script || '').slice(0, 1200),
    source: `Master deck · slide ${s.slide}`,
  });
  const panel = [s.body, s.notes].filter(Boolean).join(' ').trim();
  if (!panel) return;
  const m = String(s.notes || '').replace(/\s+/g, ' ').match(NOTE_LABEL);
  if (m) {
    split++;
    push({
      id: `sl-${s.slide}-panel`, kind: 'Slide',
      title: `${m[1].trim()} · ${m[2].trim().slice(0, 60)}`,
      body: panel.slice(0, 1200),
      source: `Master deck · ${m[1].trim()}`,
    });
  } else {
    push({
      id: `sl-${s.slide}-panel`, kind: 'Slide',
      title: String(s.body || '').replace(/\s+/g, ' ').slice(0, 80),
      body: panel.slice(0, 1200),
      source: `Master deck · slide ${s.slide} · panel`,
    });
  }
});
console.log(`master deck: ${slides.length} records split into title/script + body/notes halves (${split} self-labelled)`);

// ── video narration. The three explainer MP4s on the page are screen
//    captures of the deck with voiceover, and their narration is authored
//    SEPARATELY from the deck's own `script` field -- different cuts, and
//    different wording. Indexing it means a question can be answered with
//    what the video actually says, at the slide where it says it.
const NARRATION = [
  ['narration-portfolio-104.md',   '104-slide portfolio explainer'],
  ['narration-sku-explainer-87.md', '87-slide SKU explainer'],
  ['narration-product-lines.md',   '20-slide product-lines film'],
  ['narration-script.md',          'master narration'],
];
for (const [file, label] of NARRATION) {
  const fp = path.join(root, 'public/deck_assets', file);
  if (!fs.existsSync(fp)) { console.warn(`  ! missing narration: ${file}`); continue; }
  const md = fs.readFileSync(fp, 'utf8');
  // beats are "**07 · The silicon**" followed by the spoken paragraph
  // "**007 · Part one -- Road autonomy**  _(carried · old block 07)_" then the
  // spoken paragraph. The trailing italic provenance note is optional.
  const re = /\*\*\s*(\d{1,3})\s*[·.\-]\s*([^*\n]+?)\s*\*\*[^\n]*\n([\s\S]*?)(?=\n\s*\*\*\s*\d{1,3}\s*[·.\-]|\n#{1,3}\s|\n---|$)/g;
  let m, n = 0;
  while ((m = re.exec(md)) !== null) {
    const [, num, beat, spoken] = m;
    push({ id: `nar-${file}-${num}`, kind: 'Video narration',
      title: `${beat.trim()} (spoken, slide ${num})`, slide: Number(num),
      body: spoken.replace(/\s+/g, ' ').trim().slice(0, 1100),
      source: `${label} · beat ${num}` });
    n++;
  }
  console.log(`  narration ${file}: ${n} spoken beats`);
}

// authored_narration_87.json carries the same film as structured records
const authored = path.join(root, 'public/deck_assets/authored_narration_87.json');
if (fs.existsSync(authored)) {
  const a = JSON.parse(fs.readFileSync(authored, 'utf8'));
  const rows = Array.isArray(a) ? a : (a.slides || a.narration || []);
  rows.forEach((r, i) => push({
    id: `an-${i}`, kind: 'Video narration',
    title: `${r.title || r.beat || 'Beat ' + (r.slide ?? i)} (spoken)`,
    slide: typeof r.slide === 'number' ? r.slide : undefined,
    body: String(r.script || r.narration || r.text || '').slice(0, 1100),
    source: `87-slide SKU explainer · authored narration`,
  }));
}

// ── the founder's Information Memorandum (June 2026), text-layer pages only.
//    27 of its 33 pages are image-only. They are deliberately NOT OCR-indexed:
//    OCR renders the rupee glyph inconsistently (₹90 Cr came back as "390 Cr",
//    ₹1,388 Cr as "21,388 Cr"), so no figure from those pages is trustworthy
//    and a repair heuristic would corrupt genuine digits.
const imPath = path.join(root, 'src/a2ui/data/research/information-memorandum.json');
if (fs.existsSync(imPath)) {
  const im = JSON.parse(fs.readFileSync(imPath, 'utf8'));
  // RapidOCR concatenates words on tight layouts -- "RevenuebyBusinessLine",
  // "AIS-004Compliant" -- and a concatenation is a single token, so a natural
  // query can never match it. Split only at lower->Upper and digit->Upper:
  // that separates the run-ons while leaving A100, SoC2 and YOLOv11n intact.
  const desegment = (t) => t
    .replace(/([a-z,.])([A-Z])/g, '$1 $2')
    .replace(/(\d)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ');
  im.pages.forEach((pg) => {
    if (pg.extraction === 'rapidocr') pg.text = desegment(pg.text);
    const lines = pg.text.split('\n').map((l) => l.trim()).filter(Boolean);
    push({ id: `im-${pg.page}`, kind: 'Information memorandum',
      title: lines[0] || `IM page ${pg.page}`,
      body: lines.join(' ').slice(0, 1600),
      source: `${im.source} (${im.date}) · page ${pg.page}`
        + (pg.extraction === 'rapidocr' ? ' · OCR' : '') });
  });
  console.log(`  information memorandum: ${im.pages.length} pages (`+im.pages.filter(p=>p.extraction==='text-layer').length+` text-layer, `+im.pages.filter(p=>p.extraction==='rapidocr').length+` OCR)`);
}

// ── curated market research. Only primary sources and analysis ABOUT the
//    market: deck-production artifacts (slide plans, visual specs, PPTX
//    tooling notes) are deliberately excluded, because a question about the
//    business must not be answered with a note about how a deck was built.
const researchDir = path.join(root, 'src/a2ui/data/research');
if (fs.existsSync(researchDir)) {
  let docs = 0, chunks = 0;
  for (const file of fs.readdirSync(researchDir).filter((f) => f.endsWith('.md'))) {
    const md = fs.readFileSync(path.join(researchDir, file), 'utf8');
    const docTitle = (md.match(/^#\s+(.+)$/m) || [, file.replace(/\.md$/, '')])[1].trim();
    // split on headings; fall back to the whole file
    const secs = md.split(/\n(?=#{1,3}\s)/).filter((x) => x.trim().length > 120);
    (secs.length ? secs : [md]).forEach((sec, i) => {
      const h = (sec.match(/^#{1,3}\s+(.+)$/m) || [, docTitle])[1].trim();
      const body = sec
        .replace(/^#{1,6}\s+.*$/gm, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')          // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')        // links -> their text
        .replace(/<https?:\/\/[^>]+>/g, ' ')
        .replace(/https?:\/\/\S+/g, ' ')                 // bare urls
        .replace(/^\s*[-=|:+]{3,}\s*$/gm, ' ')            // table rules
        .replace(/[*_`>|]/g, ' ')
        .replace(/\s+/g, ' ').trim();
      // scraped pages leave navigation chrome behind; a passage that is mostly
      // punctuation and stubs is not an answer
      const words = body.split(' ').filter((w) => /[a-z]{3,}/i.test(w));
      if (body.length < 160 || words.length < 25) return;
      /* Audit and gap documents QUOTE the source material, so they contain a
       * fragment of nearly every claim in the dossier and become BM25
       * super-attractors -- one of them hijacked both "when does the AEBS
       * mandate come into force" and "what is our defence robot called".
       * They are the right answer only when the question is about a
       * discrepancy or a source, so give them their own kind and let the
       * scorer demote them, the same way 'Hostile question' is promoted. */
      const isAudit = /^(im-review-|competitive-evidence-data-quality)/.test(file);
      push({ id: `res-${file}-${i}`, kind: isAudit ? 'Document audit' : 'Market research', title: h,
        body: body.slice(0, 1300), source: `Research · ${file.replace(/\.md$/, '')}` });
      chunks++;
    });
    docs++;
  }
  console.log(`  curated research: ${docs} documents -> ${chunks} passages`);
}

// ── build-time question expansion (scripts/expand-questions.mjs).
//    Lexical retrieval fails when a question is worded unlike the document.
//    Real embeddings would fix that, but semantic search needs the visitor's
//    question embedded at query time and this page has no server to hold a
//    key. So the vocabulary gap is closed from the other side: Gemini is
//    asked at BUILD time which questions each passage answers, and those
//    question forms are attached to the passage and indexed with it.
const qPath = path.join(root, 'src/a2ui/data/generated-questions.json');
if (fs.existsSync(qPath)) {
  const gen = JSON.parse(fs.readFileSync(qPath, 'utf8'));
  let attached = 0, qs = 0;
  for (const u of units) {
    const e = gen[u.id];
    if (!e || !e.q || !e.q.length) continue;
    u.questions = e.q;
    attached++; qs += e.q.length;
  }
  console.log(`  question expansion: ${qs} questions attached to ${attached} passages`);
} else {
  console.log('  question expansion: none yet (run scripts/expand-questions.mjs)');
}

// ── sibling pages already published on this site. Extracted by
// scripts/extract-published-pages.mjs (rendered in a browser, because one is a
// React build and the other uses styled divs rather than <h*>).
//
// Near-duplicates are DROPPED rather than indexed. These pages restate the
// competitor dossier that is already a source above, and a near-twin passage
// is precisely what outranks the passage a question actually wants -- the
// defect this index has been fighting. Adding the same words twice makes
// retrieval worse, not the corpus richer.
const pubPath = path.join(root, 'src/a2ui/data/published-pages.json');
if (fs.existsSync(pubPath)) {
  const pub = JSON.parse(fs.readFileSync(pubPath, 'utf8'));
  const tokset = (x) => new Set((`${x}`.toLowerCase().match(/[a-z0-9₹%.-]{3,}/g) || []));
  const existing = units.map((u) => tokset(`${u.title} ${u.body}`));
  const jac = (a, b) => { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i); };
  // page chrome that every driven answer inherits from the agent's own shell
  const CHROME = /^(Act [IVX]+ · [^·]+· Act [IVX]+ · [^(]+\(A2UI JSON\)\s*)/;
  let added = 0, dropped = 0;
  for (const [i, u] of pub.entries()) {
    const body = u.body.replace(CHROME, '').trim();
    if (body.length < 120) { dropped++; continue; }
    const t = tokset(`${u.title} ${body}`);
    if (existing.some((e) => jac(t, e) > 0.35)) { dropped++; continue; }
    existing.push(t);
    push({
      id: `pub-${i}`,
      kind: u.kind,
      title: u.title,
      body,
      source: u.source,
    });
    added++;
  }
  console.log(`published pages: +${added} indexed, ${dropped} dropped as near-duplicate or chrome`);
}

// ── term statistics, so retrieval can weight rare words over common ones
const STOP = new Set('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very s t just now'.split(' '));
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w));
// Ship document frequencies only. Per-unit term maps were 42% of the file and
// the browser can tokenise 485 short documents in a few milliseconds, so they
// are recomputed on first query instead of downloaded.
const searchText = (u) => `${u.title} ${(u.questions || []).join(' ')} ${u.body}`;
const df = {};
units.forEach((u) => { new Set(tok(searchText(u))).forEach((w) => { df[w] = (df[w] || 0) + 1; }); });
const avglen = units.reduce((a, u) => a + tok(searchText(u)).length, 0) / units.length;
// ── drop scraped market-data tables. One research note (an investor-relations
// page capture) carried a "Trending Stocks" widget -- SNDK / MU / NVDA / AMAT
// with prices and volumes. Asked "what is deepgrid stock price", the agent
// answered with that table, which reads as though it is quoting the company's
// share price. It is page furniture from the scrape, not DeepGrid knowledge.
const TICKER_TABLE = /\bLast\s+Chg\.|\b(SNDK|NVDA|AMAT|SPCX|MU)\b[^a-z]{0,20}[\d,]+\.\d\d/i;
const before = units.length;
for (let i = units.length - 1; i >= 0; i--) {
  if (TICKER_TABLE.test(units[i].body)) units.splice(i, 1);
}
if (before !== units.length) console.log(`dropped ${before - units.length} scraped market-data passage(s)`);

// ── plural folding. The index treated "risk" (56 passages) and "risks" (4) as
// unrelated terms, so "what are the risks?" reached 4 passages instead of 56.
// Same for margin/margins, customer/customers, competitor/competitors.
//
// The map is derived from the corpus, not from a stemmer: fold "Xs" to "X"
// only when BOTH forms actually occur here. That is what keeps domain
// acronyms safe -- "adas" would become "ada" and "ais" would become "ai"
// under any rule-based stemmer, and neither singular exists in this corpus,
// so neither folds. KEEP is a second belt for terms where both forms could
// plausibly appear but the fold would still be wrong.
const KEEP = new Set(['adas', 'ais', 'tops', 'cvs', 'ncap', 'abs', 'ldws', 'ddaws', 'aebs', 'as', 'is', 'its', 'gas', 'bus', 'plus', 'series', 'analysis', 'basis', 'thesis', 'bosch', 'sales', 'goods', 'means', 'process']);
const fold = {};
for (const w of Object.keys(df)) {
  if (w.length < 5 || KEEP.has(w)) continue;
  if (!w.endsWith('s') || w.endsWith('ss') || w.endsWith('is') || w.endsWith('us')) continue;
  const sing = w.endsWith('es') && df[w.slice(0, -2)] ? w.slice(0, -2) : w.slice(0, -1);
  if (KEEP.has(sing) || !df[sing]) continue;
  fold[w] = sing;
}
// merge the plural's document frequency into the singular it now resolves to
for (const [pl, sg] of Object.entries(fold)) { df[sg] = (df[sg] || 0) + df[pl]; delete df[pl]; }
console.log(`plural folding: ${Object.keys(fold).length} plural forms folded into their singular`);

const out = { generated: new Date().toISOString(), n: units.length, avglen, df, fold, units };
const dest = path.join(root, 'src/a2ui/generated/knowledge-index.json');
fs.writeFileSync(dest, JSON.stringify(out));
const byKind = units.reduce((m, u) => { m[u.kind] = (m[u.kind] || 0) + 1; return m; }, {});
console.log(`knowledge index: ${units.length} units, ${Object.keys(df).length} terms`);
console.log('  ' + Object.entries(byKind).map(([k, v]) => `${k}:${v}`).join('  '));
console.log('  -> ' + path.relative(root, dest) + ` (${(fs.statSync(dest).size / 1024).toFixed(0)} kB)`);
