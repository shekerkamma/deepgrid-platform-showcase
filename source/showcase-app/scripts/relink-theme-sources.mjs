// Rebuilds the `sources` of each curated theme (app/data/showcase-themes.json) against today's GraphRAG index, without
// changing a word of the themes. The themes were written when passage ids were positions in the whole index; ids are
// now numbered within each document, so none of the 183 saved ids resolved, and the old index was never committed.
// Mapping by position was tested and rejected: re-chunking since then moved about a third of passages to another
// document.
//
// For each theme: retrieve its evidence the way scripts/build-showcase-themes.mjs does (same queries, same ranking,
// same pinned memorandum sections and dossiers), then cite, for each statement, the passages that state its figures,
// preferring the one closest in meaning; a figure the retrieval no longer returns is looked for in every showcase
// passage; a statement without figures cites its closest passage. A figure no passage
// states is reported, never cited to a guess. No model writes anything; the embedding model only ranks.
//   node scripts/relink-theme-sources.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {pipeline, env} from '@huggingface/transformers';
import {nums, supported} from './lib/brief-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const DRY = process.argv.includes('--dry');
const spec = read('knowledge/briefs-spec.json');
const index = read('app/data/graphrag-unified-index.json');
const meta = read('public/graphrag/semantic.json');
const bin = new Int8Array(fs.readFileSync(path.join(ROOT, 'public/graphrag/semantic.bin')).buffer.slice(0));
const products = read('app/products.json');
const themes = read('app/data/showcase-themes.json');

env.allowRemoteModels = false;
env.localModelPath = path.join(ROOT, 'public/models') + '/';
const extract = await pipeline('feature-extraction', meta.model, {dtype: meta.dtype});
const N = meta.counts.nodes, C = meta.counts.chunks, dims = meta.dims;
if (C !== index.chunks.length || N !== index.nodes.length) throw new Error('semantic index is stale: run npm run build:semantic');
const SHOWCASE = new Set(['07', '08', '09']);
const vocab = new Map(index.vocab.map((w, i) => [w, i]));
const tok = s => s.toLowerCase().match(/[a-z0-9_]+/g)?.filter(w => w.length > 2) || [];
function tfidf(q) {
  const v = new Map(); for (const w of tok(q)) { const i = vocab.get(w); if (i !== undefined) v.set(i, (v.get(i) || 0) + 1); }
  let n = 0; for (const [i, c] of v) { const x = c * index.idf[i]; v.set(i, x); n += x * x; } n = Math.sqrt(n) || 1;
  return index.chunks.map(c => { let s = 0; for (const [i, x] of v) s += (x / n) * (c.vector[i] || 0); return s; });
}
const embedQ = async q => (await extract([(meta.queryPrefix || '') + q], {pooling: 'mean', normalize: true})).data;
const cos = (e, k) => { let d = 0; const o = (N + k) * dims; for (let j = 0; j < dims; j++) d += e[j] * bin[o + j]; return d / meta.scale; };
async function rank(q) {
  const e = await embedQ(q), t = tfidf(q);
  return index.chunks.map((c, k) => (SHOWCASE.has(c.docNum) ? cos(e, k) + 0.3 * t[k] : -1));
}
// the theme builder's evidence(), unchanged
async function evidence(b) {
  const best = new Float32Array(C).fill(-1);
  for (const q of [b.ask, ...b.examples]) (await rank(q)).forEach((s, k) => { if (s > best[k]) best[k] = s; });
  const picked = new Set();
  for (const h of b.sections) index.chunks.forEach((c, k) => { if (c.docTitle === 'Investment Memorandum' && c.section.startsWith(h) && picked.size < 5) picked.add(k); });
  for (const id of b.products.slice(0, 2)) {
    const name = products.find(p => p.id === id)?.name;
    const k = index.chunks.findIndex(c => c.docTitle === 'Product Dossiers' && c.section === name);
    if (k >= 0) picked.add(k);
  }
  for (const k of Array.from(best.keys()).sort((x, y) => best[y] - best[x])) { if (picked.size >= 16 || best[k] < 0) break; picked.add(k); }
  return [...picked];
}

const text = k => `${index.chunks[k].section} ${index.chunks[k].text}`;
let statements = 0, sourced = 0, widened = 0;
const unsourced = [];
for (const t of themes) {
  const b = spec.briefs.find(x => x.title === t.title);
  if (!b) { console.error(`! ${t.title}: not in knowledge/briefs-spec.json`); continue; }
  const ev = await evidence(b);
  const cited = new Set();
  for (const s of [t.lead, ...t.explanation, ...t.facts]) {
    statements++;
    const e = await embedQ(s);
    const byMeaning = [...ev].sort((x, y) => cos(e, y) - cos(e, x));
    const figures = nums(s).filter(f => !supported(f, ''));   // figures the gate checks (not small counts)
    const missing = [];
    for (const f of figures) {
      let k = byMeaning.find(k => supported(f, text(k)));
      // retrieval today can differ from when the theme was written (workbooks were re-chunked since): widen to every
      // showcase passage that states the figure, and take the one closest in meaning to the statement
      if (k === undefined) {
        const anywhere = index.chunks.map((c, i) => i).filter(i => SHOWCASE.has(index.chunks[i].docNum) && supported(f, text(i)));
        if (anywhere.length) { k = anywhere.sort((x, y) => cos(e, y) - cos(e, x))[0]; widened++; }
      }
      if (k === undefined) missing.push(f); else cited.add(k);
    }
    if (!figures.length) cited.add(byMeaning[0]);
    if (missing.length) unsourced.push(`${t.title}: ${missing.join(', ')} in "${s.slice(0, 90)}…"`);
    else sourced++;
  }
  t.sources = [...cited].map(k => index.chunks[k].id);
}
console.log(`${statements} statements across ${themes.length} themes; ${sourced} fully sourced (${widened} figures found outside the theme's retrieval); ${unsourced.length} with a figure no retrieved passage states:`);
for (const u of unsourced) console.log('  - ' + u);
const resolved = themes.reduce((n, t) => n + t.sources.filter(id => index.chunks.some(c => c.id === id)).length, 0);
console.log(`sources now: ${resolved} ids, all resolving in the current index`);
if (!DRY) fs.writeFileSync(path.join(ROOT, 'app/data/showcase-themes.json'), JSON.stringify(themes, null, 1) + '\n');
