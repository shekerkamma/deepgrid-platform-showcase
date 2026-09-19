// Build gate: the passages a curated theme cites (app/data/showcase-themes.json, `sources`) must exist in the GraphRAG
// index AND still say what the theme says: every figure in the theme appears in at least one cited passage.
// Existence alone is not enough. Ids once changed format and all 183 citations dangled; after a later re-chunk the old
// ids still existed but named different passages, and an existence check passed them. If this fails after re-chunking,
// run scripts/relink-theme-sources.mjs.
import fs from 'node:fs';
import {nums, supported} from './lib/figures.mjs';
const themes = JSON.parse(fs.readFileSync(process.argv[2] || 'app/data/showcase-themes.json', 'utf8'));
const byId = new Map(JSON.parse(fs.readFileSync('app/data/graphrag-unified-index.json', 'utf8')).chunks.map(c => [c.id, c]));
const fails = [];
let figures = 0;
for (const t of themes) {
  const cited = (t.sources || []).map(s => byId.get(s));
  const missing = (t.sources || []).filter((s, i) => !cited[i]);
  if (missing.length) { fails.push(`${t.title}: cites ${missing.length} passage(s) not in the index`); continue; }
  const text = cited.map(c => `${c.section} ${c.text}`).join(' ');
  for (const s of [t.lead, ...t.explanation, ...t.facts])
    for (const f of nums(s).filter(f => !supported(f, ''))) {
      figures++;
      if (!supported(f, text)) fails.push(`${t.title}: ${f} is in the theme but in none of its cited passages`);
    }
}
if (fails.length) { console.error(`theme sources: ${fails.length} problem(s); run scripts/relink-theme-sources.mjs\n  ` + fails.slice(0, 6).join('\n  ')); process.exit(1); }
console.log(`theme sources ok: ${themes.reduce((n, t) => n + t.sources.length, 0)} citations resolve, and all ${figures} figures in the themes appear in them`);
