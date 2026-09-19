// Publishes graphify's output (knowledge/graphify-out/) as the Ask DeepGrid knowledge graph at
// public/downloads/ (the DG32 site's Architecture Map path): graph.html, graph.json and GRAPH_REPORT.md. graphify's page loads vis-network from
// unpkg.com; this points it at the copy the site serves itself (scripts/copy-runtime.mjs), and adds
// focus-by-name so Ask can centre the graph on an answer's entity: ?search=<label> on load, or
// postMessage({search: '<label>'}) from the embedding page. Run after every graph:extract.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'knowledge/graphify-out'), OUT = path.join(ROOT, 'public/downloads');
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/vis-network/package.json'), 'utf8')).version;
let html = fs.readFileSync(path.join(SRC, 'graph.html'), 'utf8');
const swap = (re, to, what) => {
  const n = (html.match(re) || []).length;
  // a pattern that no longer matches would silently publish the CDN version again
  if (n !== 1) throw new Error(`${what}: expected exactly 1 match, found ${n}`);
  html = html.replace(re, to);
};
swap(/https:\/\/unpkg\.com\/vis-network@[\d.]+\/standalone\/umd\/vis-network\.min\.js/g, `../vendor/vis-network-${version}.min.js`, 'vis-network script');
swap(/<title>[^<]*<\/title>/g, '<title>DeepGrid knowledge graph</title>', 'page title');
swap(/<\/body>/g, `<script>
// Ask DeepGrid focus: best label match for a term (exact, then prefix, then substring)
function dgFocus(term) {
  const q = String(term || '').toLowerCase().trim(); if (!q) return;
  const hit = RAW_NODES.find(n => n.label.toLowerCase() === q) || RAW_NODES.find(n => n.label.toLowerCase().startsWith(q))
    || RAW_NODES.find(n => n.label.toLowerCase().includes(q));
  if (hit) { network.focus(hit.id, {scale: 1.5, animation: true}); network.selectNodes([hit.id]); showInfo(hit.id); }
}
window.addEventListener('message', e => { if (e.data && typeof e.data.search === 'string') dgFocus(e.data.search); });
network.once('stabilized', () => dgFocus(new URLSearchParams(location.search).get('search')));
</script>
</body>`, 'body end');
if (/unpkg\.com|jsdelivr\.net|cdnjs/.test(html)) throw new Error('graph.html still references a CDN');
fs.mkdirSync(OUT, {recursive: true});
fs.writeFileSync(path.join(OUT, 'graph.html'), html);
fs.copyFileSync(path.join(SRC, 'graph.json'), path.join(OUT, 'graph.json'));
fs.copyFileSync(path.join(SRC, 'GRAPH_REPORT.md'), path.join(OUT, 'GRAPH_REPORT.md'));
console.log(`published knowledge graph to public/downloads/ (vis-network ${version} served from the site)`);
