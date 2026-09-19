// The showcase's catalog items for Ask DeepGrid, in the DG32 site's DeepGridItem shape (app/data/deepgrid-knowledge.ts),
// so the fifteen products and SoC2 sit beside the DG32 catalog as Doc #7 (Product Portfolio).
//   node scripts/build-showcase-catalog.mjs   -> app/data/showcase-catalog.json
// Products are read from app/products.json; Doc #8/#9 cards from app/data/showcase-themes.json. Nothing is hand-written.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'app/products.json'), 'utf8'));
const first = s => s.split(/(?<=[.!?])\s+/)[0];
const items = products.map(p => ({
  id: `sc-${p.id}`, name: p.name, category: p.category === 'Silicon & Compute' ? 'architecture' : 'sku', docId: 'doc7',
  tagline: first(p.description), summary: `${p.description} ${p.role}`,
  keyFacts: [`Listed price: ${p.price}.`, `FY2032 revenue projection: ${p.revenue} (${p.share} of the plan) at ${p.margin} gross margin.`,
    `First revenue ${p.firstRevenue}; volume plan ${p.units}.`, `From sensing to action: ${p.signalChain.join(' → ')}.`, `Key dependency: ${p.dependsOn}`],
  citation: `DeepGrid Product Portfolio, product dossier, source slide ${p.slideNum}`,
  actions: [{label: 'Open product dossier', target: `portfolio?product=${p.id}`}, {label: `Source slide ${p.slideNum}`, target: `slides?slide=${p.slideNum}`}],
}));
items.push({
  id: 'sc-soc2', name: 'SoC2, 28 nm monolithic automotive SoC', category: 'architecture', docId: 'doc7',
  tagline: 'One 57 mm² die with six compute domains under all fifteen products',
  summary: 'TSMC 28nm monolithic SoC2. A 57mm² die with six compute domains: A100 neural processing, R100 radar DSP, T100 AI, D100 security, S100 vehicle control and H100 monitoring. 39.3 TOPS is derived architecture arithmetic, not measured silicon performance. Eleven sensor channels have an 8.6 ms fusion design target in a 33.3 ms frame.',
  keyFacts: ['Process: TSMC 28 nm, monolithic 57 mm² die.', 'Six compute domains: A100, R100, T100, D100, S100, H100.', '39.3 TOPS is derived architecture arithmetic, not measured silicon.', 'Eleven sensor channels fused in an 8.6 ms design target within a 33.3 ms frame.'],
  citation: 'DeepGrid showcase, Technology (silicon architecture)',
  actions: [{label: 'Explore the silicon', target: 'silicon'}],
});
// Doc #8 (memoranda) and #9 (financials): one card per showcase theme, as the DG32 catalog overlaps its themes.
// Read from app/data/showcase-themes.json (written and figure-checked by scripts/build-showcase-themes.mjs).
const themesFile = path.join(ROOT, 'app/data/showcase-themes.json');
const PILLAR = {'Economics': 'doc9', 'Financials': 'doc9', 'The round': 'doc9', 'Product': null};
if (fs.existsSync(themesFile)) for (const t of JSON.parse(fs.readFileSync(themesFile, 'utf8'))) {
  const cat = t.tag.charAt(0) + t.tag.slice(1).toLowerCase();
  const docId = cat in PILLAR ? PILLAR[cat] : 'doc8';
  if (!docId) continue;   // product themes are covered by the product cards above
  // named by its question, never the theme title: the engine titles a catalog answer with the item name, and a card
  // sharing a theme title would pass off a fallback answer as that curated theme
  items.push({id: `sc-theme-${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, name: t.ask,
    category: docId === 'doc9' ? 'finance' : 'strategy', docId, tagline: first(t.lead), summary: t.lead, keyFacts: t.facts,
    citation: `${t.docTitle}, ${t.section}`, actions: t.refLinks.map(l => ({label: l.label, target: l.hash}))});
}
fs.writeFileSync(path.join(ROOT, 'app/data/showcase-catalog.json'), JSON.stringify(items, null, 1) + '\n');
console.log(`showcase catalog: ${items.length} items -> app/data/showcase-catalog.json`);
