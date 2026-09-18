// Writes the showcase's content as markdown documents for graphify to extract a knowledge graph from.
//
//   npm run graph:corpus     then   npm run graph:extract   (graphify, semantic extraction via Gemini)
//
// One file per product, per use case, per memorandum chapter, per deck chapter and per source document, so every node graphify
// extracts carries a source_file that maps back to a place on the page (products/ad2.md -> the AD2 dossier).
// knowledge/corpus/ is generated: edit the app/*.json and report content, never these files.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, CHAPTERS, loadContent} from './lib/showcase-content.mjs';

const {units} = loadContent();
const OUT = path.join(ROOT, 'knowledge/corpus');
fs.rmSync(OUT, {recursive: true, force: true});
const DECK = [[1, 'overview'], [7, 'road-autonomy'], [24, 'frame-budget-and-sensors'], [31, 'silicon-and-compute'],
  [49, 'fleet-and-mobility'], [66, 'sensors-and-robotics'], [97, 'portfolio-economics']];
const files = new Map();
const add = (rel, heading, body) => { if (!files.has(rel)) files.set(rel, []); files.get(rel).push(`## ${heading}\n\n${body}\n`); };
for (const u of units) {
  const s = u.source;
  if (s.kind === 'product') add(`products/${s.productId}.md`, `${u.title} (product dossier, source slide ${s.slide})`, u.text);
  else if (s.kind === 'usecase') add(`use-cases/${s.useCase || 'boundary'}.md`, u.title, u.text);
  else if (s.kind === 'slide') add(`deck/${String([...DECK].reverse().find(([n]) => s.slide >= n)[0]).padStart(3, '0')}-${[...DECK].reverse().find(([n]) => s.slide >= n)[1]}.md`, u.title, u.text);
  // one corpus file per document, not per page: drop the " · p. 12" / section suffix of primary documents
  else if (s.kind === 'document' && s.docKind === 'Primary document') add(`documents/${s.label.split(' · ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.md`, `${u.title} (${s.label})`, u.text);
  else if (s.kind === 'document') add(`sources/${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)}.md`, u.title, u.text);
  else add(`memorandum/${CHAPTERS.findIndex(c => c[0] === s.chapter) + 1}-${s.chapter}.md`, u.title, u.text);
}
// graphify extracts a few files per LLM call; a file much longer than ~10k characters gets truncated
// in its call, so long sources (the 33-page memorandum, the research audits) are split into parts
for (const [rel, parts] of [...files]) {
  const groups = [[]];
  for (const p of parts) { const g = groups[groups.length - 1]; if (g.length && g.join('').length + p.length > 10000) groups.push([p]); else g.push(p); }
  if (groups.length > 1) { files.delete(rel); groups.forEach((g, i) => files.set(rel.replace(/\.md$/, `-part${i + 1}.md`), g)); }
}
for (const [rel, parts] of files) {
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), {recursive: true});
  fs.writeFileSync(path.join(OUT, rel), `# DeepGrid Semi — ${rel.replace(/\.md$/, '')}\n\n` +
    `All figures are management projections from DeepGrid's fundraising materials.\n\n${parts.join('\n')}`);
}
console.log(`corpus: ${files.size} documents, ${units.length} units -> knowledge/corpus/`);
