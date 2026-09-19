// Writes the story half of each product page (app/data/product-stories.json): the product told as an executive would
// want it, from its own chapter of the 104-slide portfolio deck, instead of showing the slides themselves.
//
// Each product's chapter in the deck has the same slides: What it is, How it works, Who buys it, How it fits and, for
// four products, Proven in a simulator. For each, the model gets the slide's text (from the GraphRAG index), its
// narration and its speaker notes, and writes a verdict headline, a short narrative in the narration's voice, and
// "pills": the slide's data tiles as value and label (₹2.50 L · Unit price). A figure in a chapter must appear in
// that chapter's slides; a figure in the three takeaways must appear in the slides or in the product's gated brief
// (app/data/product-briefs.json). The revenue and unit ramp is parsed from the speaker notes, not written.
//
// Speaker notes carry em dashes; the page never shows them raw (noDash on save).
//   npm run graph:stories [-- --only=ad2] [-- --force]     (after graph:products)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {MODEL, write, unsupported, overclaims, presentationTalk, noDash} from './lib/brief-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).toLowerCase();
const read = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const index = read('app/data/graphrag-unified-index.json');
const notes = read('app/slide-notes.json');
const products = read('app/products.json');
const briefs = read('app/data/product-briefs.json');
const OUT = path.join(ROOT, 'app/data/product-stories.json');
const previous = fs.existsSync(OUT) ? read('app/data/product-stories.json') : {};

const KINDS = [
  ['what', 'What it is', /· What it is$/],
  ['how', 'How it works', /· How it works$/],
  ['who', 'Who buys it, and why now', /· Who buys it$/],
  ['fits', 'How it fits the plan', /· How it fits$/],
  ['proof', 'Proven in a simulator', /· (Proven in a simulator|The simulator, running)$/],
];
// Slide text and speaker notes come from the deck itself (knowledge/deck-slides.json, read with python-pptx), which
// is numbered like the slide images; the narration comes from app/slide-notes.json, numbered the same way.
const deck = read('knowledge/deck-slides.json');
const deckText = n => deck[n - 1].text.replace(/DEEPGRID SEMI · PRODUCT LINES · MANAGEMENT PROJECTIONS\s*\d*/g, '');
const slideText = n => `SLIDE ${n} (${notes[n - 1].title})\nON THE SLIDE: ${deckText(n)}\nNARRATION: ${notes[n - 1].script}\nSPEAKER NOTES: ${deck[n - 1].notes}`;

// "units 3 / 80 / 1400 / 4000 / 9000 / 18000, revenue 0.07 / 2 / 35 / 100 / 225 / 450 ₹Cr" in the How it fits notes
function ramp(n) {
  const t = deck[n - 1].notes;
  const u = /units ([\d.,]+(?: \/ [\d.,]+){5})/.exec(t), r = /revenue ([\d.,]+(?: \/ [\d.,]+){5})/.exec(t);
  if (!u || !r) return null;
  const list = m => m[1].split(' / ').map(x => Number(x.replace(/,/g, '')));
  return {years: ['FY27', 'FY28', 'FY29', 'FY30', 'FY31', 'FY32'], units: list(u), revenue: list(r)};
}

const SYSTEM = `You write the story section of one product page on DeepGrid Semi's investor showcase. Readers are business
executives and investors. You are given the product's chapter of the company's portfolio deck, slide by slide: the text on
the slide, the narration spoken over it, and the speaker notes. Turn it into prose and data an executive can read in two
minutes, instead of showing the slides. Return JSON only:

{"takeaways": ["three one-sentence verdicts an investor should leave with, the most decision-relevant first"],
 "chapters": [{"kind": "what|how|who|fits|proof", "headline": "one sentence that states the point of the chapter",
   "narrative": "2-3 sentences in plain, confident prose, carrying the narration's story",
   "pills": [{"value": "short value, at most 5 words", "label": "what it is, at most 4 words"}]}]}

Rules:
- One chapter per kind you are given, in the order given. 3 to 6 pills each: the slide's data tiles and named items
  (price, segment, domain, first revenue, units, share, margin, capture rate, components, buyer, channel, trigger).
- A pill value is at most 5 words and a label at most 4; list components as separate pills. In the fits chapter,
  leave the year-by-year ramp out of the pills: a chart shows it.
- Copy every figure exactly as the slide, narration or notes give it; never add, subtract or derive new numbers.
- Label forecasts as management projections where the slide does. Say "simulation, not a fielded deployment" for proof.
- The operative mandate is G.S.R. 834(E) as amended by 862(E); never write "GSR 184(E)". Say "the ADAS mandate".
- No hype words, no mention of slides, decks, narration or notes. Write about the product, not the presentation.`;
const VERSION = crypto.createHash('sha256').update(SYSTEM + MODEL).digest('hex').slice(0, 12);

const out = {...previous}, failed = [];
const save = () => fs.writeFileSync(OUT, noDash(JSON.stringify(out, null, 1)) + '\n');

async function story(p) {
  const b = briefs.products[p.id];
  const chapters = KINDS.map(([kind, title, re]) => ({kind, title, slides: b.slides.filter(n => re.test(notes[n - 1].title))}))
    .filter(c => c.slides.length);
  const source = Object.fromEntries(chapters.map(c => [c.kind, c.slides.map(slideText).join('\n\n')]));
  const briefText = [b.lead, ...b.useCases.map(u => `${u.problem} ${u.delivers}`), ...b.sections.map(s => s.text), ...b.facts.map(f => f.text)].join(' ');
  const all = Object.values(source).join(' ') + ' ' + briefText;
  const hash = crypto.createHash('sha256').update(VERSION + all).digest('hex').slice(0, 16);
  if (previous[p.id] && !FORCE && previous[p.id].hash === hash) { console.error(`= ${p.id} (unchanged)`); return; }

  const user = `Product: ${p.name} (${p.category}).\nChapters to write, in order: ${chapters.map(c => c.kind).join(', ')}.\n\n` +
    chapters.map(c => `### ${c.kind}: ${c.title}\n${source[c.kind]}`).join('\n\n') +
    `\n\n### Already-verified facts about the product (use for the takeaways)\n${briefText}`;
  const check = t => {
    const bad = [];
    for (const c of t.chapters || []) {
      const src = source[c.kind];
      if (!src) { bad.push(`unknown chapter ${c.kind}`); continue; }
      for (const f of unsupported(`${c.headline} ${c.narrative}`, src)) bad.push(`${c.kind}: ${f}`);
      for (const w of overclaims(`${c.headline} ${c.narrative}`, src)) bad.push(`${c.kind}: "${w}" is not in the source`);
      const talk = presentationTalk(`${c.headline} ${c.narrative}`);
      if (talk) bad.push(`${c.kind}: talks about "${talk}" instead of the product`);
      c.pills = (c.pills || []).filter(x => {
        const u = unsupported(`${x.value} ${x.label}`, src);
        if (u.length) bad.push(`${c.kind} pill ${x.value}: ${u.join(', ')}`);
        return !u.length && x.value.split(/\s+/).length <= 6 && !/→/.test(x.value);   // long or ramp pills are dropped, not retried
      });
    }
    t.takeaways = (t.takeaways || []).filter(x => { const u = [...unsupported(x, all), ...overclaims(x, all), presentationTalk(x)].filter(Boolean); if (u.length) bad.push(`takeaway (${u.join(', ')}): ${x}`); return !u.length; });
    if (/184\s*\(E\)/.test(JSON.stringify(t))) bad.push('names GSR 184(E)');
    return bad;
  };
  const done = t => !!t && check(t).length === 0 && t.takeaways.length >= 2 &&
    chapters.every(c => t.chapters.some(x => x.kind === c.kind && x.pills.length >= 2));
  const {t, dropped} = await write([{role: 'system', content: SYSTEM}, {role: 'user', content: user}], check, done);
  if (!t) { failed.push(p.id); console.error(`! ${p.id}: no version passed the gate: ${dropped.slice(0, 3).join(' | ')}`); return; }
  out[p.id] = {takeaways: t.takeaways.slice(0, 3),
    chapters: chapters.map(c => { const w = t.chapters.find(x => x.kind === c.kind);
      return {kind: c.kind, title: c.title, slides: c.slides, headline: w.headline, narrative: w.narrative, pills: w.pills.slice(0, 6),
        ...(c.kind === 'fits' && ramp(c.slides[0]) ? {ramp: ramp(c.slides[0])} : {})}; }),
    hash, model: MODEL};
  save();
  console.error(`+ ${p.id}: ${out[p.id].chapters.length} chapters, ${out[p.id].takeaways.length} takeaways`);
}

const queue = products.filter(p => !ONLY || p.id === ONLY);
await Promise.all([1, 2, 3].map(async () => { while (queue.length) await story(queue.shift()); }));
save();
console.error(`product stories: ${Object.keys(out).length}${failed.length ? `; left out: ${failed.join(', ')}` : ''}`);
if (failed.length) process.exitCode = 2;
