// Build gate for the Technology page's story (app/data/tech-story.json, written by scripts/build-tech-story.mjs).
// Re-checks, without a model, what the generator was gated on, so a hand edit or a re-chunked index cannot slip past:
// every figure in a chapter appears in the slides and passages the chapter cites; the cited passages still exist;
// 3 to 6 pills (28 nm, the platform itself, is the one fact the generator's rules state); no em dash; every chapter cites something, and every citation has a meaningful label.
import fs from 'node:fs';
import {nums, supported} from './lib/figures.mjs';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const {chapters} = read('app/data/tech-story.json');
const deck = read('knowledge/deck-slides.json'), notes = read('app/slide-notes.json');
const byId = new Map(read('app/data/graphrag-unified-index.json').chunks.map(c => [c.id, c]));
const fails = [];
let figures = 0;
for (const c of chapters) {
  const missing = c.passages.filter(p => !byId.has(p.id));
  if (missing.length) { fails.push(`${c.id}: cites ${missing.length} passage(s) not in the index`); continue; }
  // the generator also cited sibling passages it deduplicated to one link per page; slides carry their own text
  const source = [...c.slides.map(n => `${deck[n - 1].text} ${deck[n - 1].notes} ${notes[n - 1].script}`),
    ...(c.sources || c.passages.map(p => p.id)).map(id => { const x = byId.get(id); return x ? `${x.section} ${x.text}` : ''; })].join(' ') + ' 28 nm';
  const text = [c.headline, c.lede, c.detail, ...c.pills.flatMap(p => [p.value, p.label])].join(' ');
  for (const f of nums(text).filter(f => !supported(f, ''))) { figures++; if (!supported(f, source)) fails.push(`${c.id}: ${f} is in none of its sources`); }
  if (c.pills.length < 3 || c.pills.length > 6) fails.push(`${c.id}: ${c.pills.length} pills (want 3 to 6)`);
  if (/—/.test(text)) fails.push(`${c.id}: em dash in the copy`);
  if (!c.slides.length && !c.passages.length) fails.push(`${c.id}: cites nothing`);
  for (const p of c.passages) if (!p.title || !(p.href || p.nav)) fails.push(`${c.id}: reference ${p.id} has no label or no link`);
}
if (fails.length) { console.error(`tech story: ${fails.length} problem(s); run npm run graph:tech\n  ` + fails.slice(0, 8).join('\n  ')); process.exit(1); }
console.log(`tech story ok: ${chapters.length} chapters, all ${figures} figures appear in their cited slides and passages`);
