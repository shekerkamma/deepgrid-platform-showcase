// Builds Ask DeepGrid's GraphRAG index (app/data/graphrag-index.json) from two inputs:
//   knowledge/graphify-out/graph.json   the entity graph graphify extracted from knowledge/corpus/
//   scripts/lib/showcase-content.mjs    the page's products, slides, use cases and memorandum passages
//
//   npm run graph:index        (then npm run build:semantic, which embeds this index)
//
// graphify scopes node ids to their file, so one entity extracted from four files arrives as four nodes
// ("SoC2", "SoC2 ASIC Die", "SoC2 Processor", ...). Those are resolved onto canonical catalog nodes, the
// fifteen products and SoC2, by alias; their edges are re-pointed and duplicates merged. Every node then
// records which passages mention it, which is how a graph hit pulls in its grounding text.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadContent} from './lib/showcase-content.mjs';

const {products, units} = loadContent();
const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge/graphify-out/graph.json'), 'utf8'));

// Canonical entities. Aliases are matched lowercase inside a graphify label; the most specific first.
const SOC2 = {id: 'soc2', name: 'SoC2 (28 nm monolithic SoC)', aliases: ['soc2', '28nm automotive soc', '28 nm automotive soc'],
  // the page's own description of the die (formerly the old briefing's hard-coded evidence card)
  description: 'TSMC 28nm monolithic SoC2. A 57mm² die with six compute domains: A100 neural processing, R100 radar DSP, ' +
    'T100 AI, D100 security, S100 vehicle control and H100 monitoring. 39.3 TOPS is derived architecture arithmetic, not ' +
    'measured silicon performance. Eleven sensor channels have an 8.6 ms fusion design target in a 33.3 ms frame.'};
const PRODUCT_ALIASES = {
  'a100-4': ['a100 compute box 4ch', 'a100 4-channel', 'a100 quad', '4ch pcie'],
  'a100-2': ['a100 compute box 2ch', 'a100 2-channel', 'a100 dual'],
  'a100-1': ['a100 compute box 1ch', 'a100 1-channel', '1ch m.2'],
  ad2: ['ad2', 'smart truck'], ad0: ['ad0', 'smart mirror'], ad1: ['ad1', 'indoor autonomy', 'indoor l4'],
  taas: ['taas', 'transportation as a service'], chipset: ['chipset oem'], t100: ['t100'],
  dhumr: ['d-humr', 'dhumr'], agv: ['seaport agv', 'agv'], d100: ['d100'], thermal: ['thermal camera'],
  h100: ['h100', 'driver monitor'], radar: ['4d radar', 'radar pod', '4d imaging radar'],
};
const catalog = [
  ...products.map(p => ({id: `product:${p.id}`, productId: p.id, name: p.name, kind: 'product', community: p.category,
    aliases: PRODUCT_ALIASES[p.id] || [p.id], description: `${p.description} ${p.role}`})),
  {id: 'platform:soc2', name: SOC2.name, kind: 'platform', community: 'Silicon & Compute', aliases: SOC2.aliases, description: SOC2.description},
];
const byAlias = catalog.flatMap(c => c.aliases.map(a => [a, c])).sort((a, b) => b[0].length - a[0].length);
const resolve = label => { const l = label.toLowerCase(); return byAlias.find(([a]) => l.includes(a))?.[1] || null; };

// 1. Nodes: catalog first, then every graphify node that does not resolve onto one.
const nodes = new Map(catalog.map(c => [c.id, {...c, from: []}]));
const idMap = new Map();
for (const n of graph.nodes) {
  const c = resolve(n.label || n.id);
  if (c) { idMap.set(n.id, c.id); nodes.get(c.id).from.push(n.label); continue; }
  const id = `g:${n.id}`;
  idMap.set(n.id, id);
  const doc = String(n.source_file || '').replace(/^.*corpus\//, '').replace(/\.md$/, '');
  nodes.set(id, {id, name: n.label, kind: n.file_type === 'document' ? 'document' : 'concept', community: n.community_name || 'DeepGrid',
    aliases: [n.label.toLowerCase()], description: [n.label, n.rationale, doc && `(from ${doc})`].filter(Boolean).join('. '), from: [n.label]});
}

// 2. Edges: graphify's, re-pointed through the resolution; self-loops dropped, parallel edges merged.
const edgeKey = new Map();
for (const l of graph.links) {
  const from = idMap.get(l.source), to = idMap.get(l.target);
  if (!from || !to || from === to) continue;
  const key = [from, to].sort(byText).join('|') + '|' + l.relation;
  const prev = edgeKey.get(key);
  if (prev) { prev.weight += 1; continue; }
  edgeKey.set(key, {from, to, label: l.relation, confidence: l.confidence || 'EXTRACTED', weight: 1});
}
// every product runs on the shared die: the page says so for each of them (Technology view, products.json)
for (const c of catalog.filter(c => c.kind === 'product')) {
  const key = [c.id, 'platform:soc2'].sort(byText).join('|') + '|runs_on';
  if (!edgeKey.has(key)) edgeKey.set(key, {from: c.id, to: 'platform:soc2', label: 'runs_on', confidence: 'EXTRACTED', weight: 1});
}
const edges = [...edgeKey.values()];

// 3. Chunks: every citable unit of the page.
const chunks = units.map(u => ({id: u.id, kind: u.kind, title: u.title, text: u.text, source: u.source, keys: u.keys || []}));

// 4. Mentions: which chunks name each node (by any alias, or a graphify label of 5+ characters).
const lowered = chunks.map(c => `${c.title} ${c.text}`.toLowerCase());
for (const n of nodes.values()) {
  const keys = [...new Set([...n.aliases, ...n.from.map(f => f.toLowerCase())])].filter(k => k.length >= 3);
  n.mentions = lowered.flatMap((t, i) => keys.some(k => t.includes(k)) ? [i] : []);
  if (n.productId) n.mentions = [...new Set([chunks.findIndex(c => c.id === `product:${n.productId}`), ...n.mentions])];
}

// 5. TF-IDF over nodes + chunks, the same scheme the DG32 index uses, so ranking works with no model.
const tok = s => s.toLowerCase().match(/[a-z0-9_]+/g)?.filter(w => w.length > 2) || [];
// a passage is searched by its title, its text and the questions it answers
const nodeText = n => `${n.name} ${n.community} ${n.description}`, chunkText = c => `${c.title} ${c.keys.join(' ')} ${c.text}`;
const docs = [...[...nodes.values()].map(nodeText), ...chunks.map(chunkText)];
const vocab = [...new Set(docs.flatMap(tok))].sort(byText), vidx = new Map(vocab.map((w, i) => [w, i]));
const df = new Float64Array(vocab.length);
for (const d of docs) for (const w of new Set(tok(d))) df[vidx.get(w)]++;
const idf = Array.from(df, c => Math.log((docs.length + 1) / (c + 1)) + 1);
const vectorize = s => {
  const tf = new Map();
  for (const w of tok(s)) tf.set(vidx.get(w), (tf.get(vidx.get(w)) || 0) + 1);
  let norm = 0; for (const [i, c] of tf) { const v = c * idf[i]; tf.set(i, v); norm += v * v; }
  norm = Math.sqrt(norm) || 1;
  return Object.fromEntries([...tf].map(([i, v]) => [i, +(v / norm).toFixed(4)]));
};

const index = {
  graph: {nodes: graph.nodes.length, edges: graph.links.length, communities: new Set(graph.nodes.map(n => n.community)).size},
  nodes: [...nodes.values()].map(({aliases, from, ...n}) => ({...n, aliases, vector: vectorize(nodeText(n))})),
  edges, chunks: chunks.map(c => ({...c, vector: vectorize(chunkText(c))})),
  vocab, idf: idf.map(x => +x.toFixed(4)),
};
const out = path.join(ROOT, 'app/data/graphrag-index.json');
fs.writeFileSync(out, JSON.stringify(index));
const merged = [...nodes.values()].filter(n => n.from.length > 1);
console.log(`graphrag index: ${index.nodes.length} nodes (${catalog.length} catalog, ${graph.nodes.length} graphify -> ` +
  `${graph.nodes.length - [...nodes.values()].filter(n => n.id.startsWith('g:')).length} resolved), ${edges.length} edges, ` +
  `${chunks.length} chunks, ${vocab.length} terms, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
for (const n of merged) console.log(`  ${n.id} <- ${n.from.join(' | ')}`);
