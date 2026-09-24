// Build gate for the site's cross-references (app/data/relations.json, from scripts/build-relations.mjs).
// Fails if: a link goes one way only; a link points at an item that does not exist; an item other than the deck's own
// "how to read" slide has no link to another section (the narrated walkthrough alone does not count, since every slide
// has it); an item's label is empty or a bare verb; a curated link has no reason. Also re-derives the index and fails
// if the committed file is stale, so an edit to a product brief or the Silicon platform story cannot leave dead links.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const committed = fs.readFileSync('app/data/relations.json', 'utf8');
execFileSync('node', ['scripts/build-relations.mjs'], {stdio: 'ignore'});
const fresh = fs.readFileSync('app/data/relations.json', 'utf8');
const fails = [];
if (fresh.replaceAll('\r\n', '\n') !== committed.replaceAll('\r\n', '\n')) fails.push('app/data/relations.json is stale: run node scripts/build-relations.mjs and commit it');
const {nodes, edges} = JSON.parse(fresh);
const kind = k => k.split(':')[0];
const BARE = /^(read|open|open slide|pdf|download|more|link|source|watch)$/i;
const EXEMPT = new Set(['slide:2']); // "How to read this deck": about the deck itself
for (const [k, n] of Object.entries(nodes)) {
  if (!n.label?.trim() || BARE.test(n.label.trim())) fails.push(`${k}: label "${n.label}"`);
  if (!n.hash) fails.push(`${k}: goes nowhere`);
  for (const y of Object.keys(edges[k] || {})) {
    if (!nodes[y]) fails.push(`${k} -> ${y}: no such item`);
    else if (!edges[y]?.[k]) fails.push(`${k} -> ${y}: one way only`);
  }
  const across = Object.keys(edges[k] || {}).filter(y => kind(y) !== kind(k) && y !== 'film:master');
  if (!across.length && !EXEMPT.has(k)) fails.push(`${k}: links to no other section`);
}
for (const [a, b, why] of read('knowledge/relations-curated.json').links) if (!why?.trim()) fails.push(`curated ${a} -> ${b}: no reason`);
if (fails.length) { console.error(`relations: ${fails.length} problem(s)\n  ` + fails.slice(0, 10).join('\n  ')); process.exit(1); }
const links = Object.values(edges).reduce((s, v) => s + Object.keys(v).length, 0) / 2;
console.log(`relations ok: ${Object.keys(nodes).length} items, ${links} two-way links, every item links to another section`);
