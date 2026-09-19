// Build gate for the Technology page's story (app/data/tech-story.json, written by scripts/build-tech-story.mjs).
// Re-checks, without a model, what the generator was gated on, so a hand edit or a re-chunked index cannot slip past:
// every figure in a chapter appears in the slides and passages the chapter cites; the cited passages still exist;
// the domain pills use the site's domain names; 3 to 6 pills (28 nm, the platform itself, is the one fact the generator's rules state); no em dash; every chapter cites something, and every citation has a meaningful label.
import fs from 'node:fs';
import {nums, supported} from './lib/figures.mjs';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const {chapters} = read('app/data/tech-story.json');
const deck = read('knowledge/deck-slides.json'), notes = read('app/slide-notes.json');
const byId = new Map(read('app/data/graphrag-unified-index.json').chunks.map(c => [c.id, c]));
const fails = [];
// the domain names the site uses everywhere (app/shared.tsx: tabs, the Overview die, product pages)
const names = Object.fromEntries([...fs.readFileSync('app/shared.tsx', 'utf8').matchAll(/code: '([A-Z]\d{3})',\s*name: '([^']+)'/g)].map(m => [m[1], m[2]]));
if (Object.keys(names).length !== 6) fails.push(`app/shared.tsx: found ${Object.keys(names).length} domains, expected 6`);
let figures = 0;
for (const c of chapters) {
  const missing = c.passages.filter(p => !byId.has(p.id));
  if (missing.length) { fails.push(`${c.id}: cites ${missing.length} passage(s) not in the index`); continue; }
  // the generator also cited sibling passages it deduplicated to one link per page; slides carry their own text
  const source = [...c.slides.map(n => `${deck[n - 1].text} ${deck[n - 1].notes} ${notes[n - 1].script}`),
    ...(c.sources || c.passages.map(p => p.id)).map(id => { const x = byId.get(id); return x ? `${x.section} ${x.text}` : ''; })].join(' ') + ' 28 nm';
  const text = [c.headline, c.lede, c.detail, ...c.pills.flatMap(p => [p.value, p.label])].join(' ');
  for (const f of nums(text).filter(f => !supported(f, ''))) { figures++; if (!supported(f, source)) fails.push(`${c.id}: ${f} is in none of its sources`); }
  if (c.id === 'domains')
    for (const [code, name] of Object.entries(names)) {
      const pill = c.pills.find(p => p.value.startsWith(code));
      if (!pill || pill.label !== name) fails.push(`domains: ${code} pill says "${pill?.label}", the site calls it "${name}"`);
    }
  if (c.pills.length < 3 || c.pills.length > 6) fails.push(`${c.id}: ${c.pills.length} pills (want 3 to 6)`);
  if (/—/.test(text)) fails.push(`${c.id}: em dash in the copy`);
  if (!c.slides.length && !c.passages.length) fails.push(`${c.id}: cites nothing`);
  for (const p of c.passages) if (!p.title || !(p.href || p.nav)) fails.push(`${c.id}: reference ${p.id} has no label or no link`);
}
// Product pages must agree with the Technology page on the chip's state: SoC2 is designed for TSMC 28 nm and not yet
// fabricated, its tapeout is ahead (so nothing has been "paid" by it), and a TOPS figure is a design target. Checked
// over what a reader sees (brief lead, use cases, sections, facts; story takeaways and chapters), not cited sources.
const visible = v => JSON.stringify(v, (k, x) => (['sources', 'dropped', 'hash', 'evidenceHash', 'model', 'related'].includes(k) ? undefined : x));
const copy = [...Object.entries(read('app/data/product-briefs.json').products), ...Object.entries(read('app/data/product-stories.json'))];
let productSentences = 0;
for (const [id, v] of copy)
  for (const sentence of visible(v).split(/(?<=[.!?])\s+|","|":"/)) {
    productSentences++;
    if (/\b(fabricated|manufactured) (on|in|at) TSMC/i.test(sentence) && !/not yet fabricated/i.test(sentence)) fails.push(`product ${id}: calls SoC2 fabricated: "${sentence.slice(0, 110)}"`);
    if (/tape-?out[^.]{0,40}\b(already )?(been )?paid|paid[^.]{0,30}tape-?out/i.test(sentence)) fails.push(`product ${id}: says the tapeout is paid for: "${sentence.slice(0, 110)}"`);
    if (/\b(34\.4|39\.3) TOPS\b/.test(sentence) && !/design target|derived|target|arithmetic|peak/i.test(sentence)) fails.push(`product ${id}: TOPS without saying it is a design target: "${sentence.slice(0, 110)}"`);
  }
if (fails.length) { console.error(`tech story: ${fails.length} problem(s); run npm run graph:tech\n  ` + fails.slice(0, 8).join('\n  ')); process.exit(1); }
console.log(`tech story ok: ${chapters.length} chapters, all ${figures} figures appear in their cited slides and passages; domain names match the site; ${productSentences} product-page passages agree with it on the chip's state`);
