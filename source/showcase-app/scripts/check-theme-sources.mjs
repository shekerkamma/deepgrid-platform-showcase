// Build gate: every passage a curated theme cites (app/data/showcase-themes.json, `sources`) must exist in the GraphRAG
// index. Passage ids once changed format and all 183 citations dangled unnoticed, because no page reads them; they are
// the trail from each statement to its source. If this fails after re-chunking, run scripts/relink-theme-sources.mjs.
import fs from 'node:fs';
const themes = JSON.parse(fs.readFileSync(process.argv[2] || 'app/data/showcase-themes.json', 'utf8'));
const ids = new Set(JSON.parse(fs.readFileSync('app/data/graphrag-unified-index.json', 'utf8')).chunks.map(c => c.id));
const dangling = themes.flatMap(t => (t.sources || []).filter(s => !ids.has(s)).map(s => `${t.title}: ${s}`));
if (dangling.length) { console.error(`theme sources: ${dangling.length} cite passages not in the index; run scripts/relink-theme-sources.mjs\n  ` + dangling.slice(0, 5).join('\n  ')); process.exit(1); }
console.log(`theme sources ok: ${themes.reduce((n, t) => n + (t.sources || []).length, 0)} citations, all in the index`);
