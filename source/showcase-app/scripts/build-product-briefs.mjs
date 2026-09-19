// Writes the product pages' content (app/data/product-briefs.json): for each of the fifteen products, and a lead for
// each of the four product lines, written from the GraphRAG index and gated on its figures.
//
//   1. evidence, three ways, all from app/data/graphrag-unified-index.json:
//      - pinned: the product's dossier and every deck slide in its chapter ("AD2 · What it is" and on)
//      - graph: the product's nodes and their one-hop neighbours (mandates, sensor suites, simulators, related
//        products); each neighbour's name becomes a retrieval query, so the graph decides what else is read
//      - ranked: showcase chunks (Doc #7-#9) ranked as the page ranks them (bge-small + 0.3 x TF-IDF) for use-case,
//        mechanism, economics and risk questions, kept only if they name the product
//   2. a model writes use cases first, then how it works, why now, economics and what has to go right, from ONLY
//      those passages (CLIProxyAPI, claude-sonnet-4-6 via antigravity; never a free tier)
//   3. the figure gate from build-showcase-themes.mjs: a statement survives only if every figure in it appears in a
//      passage it cites (a figure found in another evidence passage repairs the citation); failures retry.
//   Deterministic parts: the product's slide range, its films, its start time in the narrated walkthrough (matched
//   from the slide's narration to public/media/captions/master.vtt), related products from the graph, and a link to
//   one of the six commercial use cases only where a use case cites that use case's own passage.
//
//   npm run graph:products [-- --only=ad2] [-- --force]     (after graph:index + build:semantic)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {pipeline, env} from '@huggingface/transformers';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODEL = process.env.THEME_MODEL || 'claude-sonnet-4-6';
const FORCE = process.argv.includes('--force');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).toLowerCase();
const TRIES = Number(process.env.THEME_TRIES || 3);
const read = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const index = read('app/data/graphrag-unified-index.json');
const meta = read('public/graphrag/semantic.json');
const bin = new Int8Array(fs.readFileSync(path.join(ROOT, 'public/graphrag/semantic.bin')).buffer.slice(0));
const products = read('app/products.json');
const notes = read('app/slide-notes.json');
const OUT = path.join(ROOT, 'app/data/product-briefs.json');
const previous = fs.existsSync(OUT) ? read('app/data/product-briefs.json') : {products: {}, lines: {}};

// How each product is named across the documents, the deck's chapter code, and its simulator films.
const PRODUCT = {
  ad2: {aliases: ['Smart Truck', 'AD2'], deck: 'AD2', films: ['truck', 'ddrive', 'computebox']},
  ad0: {aliases: ['Smart Mirror', 'AD0'], deck: 'AD0', films: []},
  ad1: {aliases: ['AD1', 'Indoor L4', 'indoor autonomy'], deck: 'AD1', films: ['forklift']},
  taas: {aliases: ['TaaS', 'Transport as a Service', 'Transport-as-a-Service'], deck: 'TaaS', films: []},
  chipset: {aliases: ['Chipset OEM', 'chipset die', 'bare die'], deck: 'Chipset OEM', films: ['computebox']},
  t100: {aliases: ['T100'], deck: 'T100 licence', films: []},
  'a100-1': {aliases: ['A100 Compute Box 1ch', 'A100 one-channel', 'compute box 1ch', 'M.2 module'], deck: 'A100 one-channel', films: []},
  'a100-2': {aliases: ['A100 Compute Box 2ch', 'A100 two-channel', 'compute box 2ch'], deck: 'A100 two-channel', films: []},
  'a100-4': {aliases: ['A100 Compute Box 4ch', 'A100 four-channel', 'compute box 4ch', 'PCIe card'], deck: 'A100 four-channel', films: []},
  agv: {aliases: ['Seaport AGV', 'AGV', 'container-yard vehicle'], deck: 'Seaport AGV', films: ['yard']},
  thermal: {aliases: ['Thermal Camera', 'thermal pod', 'LWIR'], deck: 'Thermal camera', films: []},
  radar: {aliases: ['4D Radar', 'radar pod'], deck: '4D radar', films: []},
  h100: {aliases: ['H100', 'driver monitor', 'wearable'], deck: 'H100 wearable', films: []},
  dhumr: {aliases: ['D-HUMR', 'DHUMR'], deck: 'D-HUMR', films: ['sentinel']},
  d100: {aliases: ['D100', 'drone SoC', 'drone kit'], deck: 'D100 drone', films: []},
};
const LINES = ['Road Autonomy', 'Silicon & Compute', 'Fleet & Mobility', 'Sensors & Robotics'];

// --- model route: CLIProxyAPI on the Windows gateway, key from ~/.dsh/.credentials.yaml -----------------------
const GW = process.env.CLIPROXY_HOST || execSync("ip route show default | awk '{print $3}'").toString().trim();
const KEY = process.env.CLIPROXY_API_KEY || execSync(`python3 - <<'PY'
import yaml, pathlib
d = yaml.safe_load(pathlib.Path('~/.dsh/.credentials.yaml').expanduser().read_text())
def walk(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from walk(v, f'{p}/{k}')
    elif isinstance(o, str) and 'cliproxy' in p.lower(): yield o
print(next(walk(d), ''))
PY`).toString().trim();
async function llm(messages) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`http://${GW}:8317/v1/chat/completions`, {method: 'POST',
      headers: {'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({model: MODEL, temperature: 0.2, max_tokens: 4000, messages})});
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.choices?.[0]?.message?.content) return body.choices[0].message.content;
    console.error(`  model call ${attempt} failed: ${res.status} ${JSON.stringify(body.error || body).slice(0, 160)}`);
    await new Promise(r => setTimeout(r, 4000 * attempt));
  }
  throw new Error('model unavailable through CLIProxyAPI');
}

// --- retrieval, ranked as the page ranks it ------------------------------------------------------------------
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
async function rank(q) {
  const e = (await extract([(meta.queryPrefix || '') + q], {pooling: 'mean', normalize: true})).data;
  const t = tfidf(q);
  return index.chunks.map((c, k) => { if (!SHOWCASE.has(c.docNum)) return -1; let d = 0; const o = (N + k) * dims;
    for (let j = 0; j < dims; j++) d += e[j] * bin[o + j]; return d / meta.scale + 0.3 * t[k]; });
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const namer = aliases => new RegExp(aliases.map(a => `\\b${esc(a)}\\b`).join('|'), 'i');

// --- the graph: a product's nodes and their one-hop neighbours ------------------------------------------------
const nodes = new Map(index.nodes.map(n => [n.id, n]));
const adj = new Map();
for (const e of index.edges) for (const [a, b] of [[e.from, e.to], [e.to, e.from]]) { if (!adj.has(a)) adj.set(a, []); adj.get(a).push({rel: e.label, id: b}); }
function neighbourhood(id) {
  const re = namer(PRODUCT[id].aliases);
  const seeds = index.nodes.filter(n => re.test(n.name));
  const near = new Map();
  for (const s of seeds) for (const {id: o} of adj.get(s.id) || []) { const n = nodes.get(o); if (n && !re.test(n.name)) near.set(n.name, (near.get(n.name) || 0) + 1); }
  const related = products.filter(p => p.id !== id && [...near.keys()].some(name => namer(PRODUCT[p.id].aliases).test(name))).map(p => p.id);
  const concepts = [...near.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)
    .filter(name => !products.some(p => namer(PRODUCT[p.id].aliases).test(name))).slice(0, 8);
  return {seeds: seeds.length, concepts, related};
}

// --- deterministic parts --------------------------------------------------------------------------------------
function slideRange(id) {
  const code = PRODUCT[id].deck + ' · ';
  return notes.map((n, i) => n.title.startsWith(code) ? i + 1 : 0).filter(Boolean);
}
const cues = fs.readFileSync(path.join(ROOT, 'public/media/captions/master.vtt'), 'utf8').split(/\n\n+/).map(b => b.trim().split('\n'))
  .filter(l => l.length >= 2 && l[0].includes('-->'))
  .map(l => { const [h, m, s] = l[0].split(' --> ')[0].split(':'); return {t: +h * 3600 + +m * 60 + +s, text: l.slice(1).join(' ')}; });
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
// the walkthrough narrates every slide; the product's "What it is" slide opens its section of the film
function filmStart(slide) {
  const target = norm(notes[slide - 1].script).split(' ').slice(0, 10);
  let best = {score: 0, t: null};
  for (let i = 0; i < cues.length; i++) {
    const words = new Set(norm(cues.slice(i, i + 2).map(c => c.text).join(' ')).split(' '));
    const score = target.filter(w => words.has(w)).length / target.length;
    if (score > best.score) best = {score, t: Math.floor(cues[i].t)};
  }
  return best.score >= 0.7 ? best.t : null;
}

async function evidence(id) {
  const p = products.find(x => x.id === id), re = namer(PRODUCT[id].aliases), g = neighbourhood(id);
  const picked = new Set();
  index.chunks.forEach((c, k) => { if (c.docTitle === 'Product Dossiers' && c.section === p.name) picked.add(k); });
  const slides = new Set(slideRange(id).map(n => `Slide ${n}`));
  index.chunks.forEach((c, k) => { if (c.docTitle === 'Product Portfolio Deck (104 slides)' && slides.has(c.section)) picked.add(k); });
  const queries = [`Who buys the ${p.name} and what problem does it solve?`, `${p.name} use case customer application`,
    `How does the ${p.name} work on the SoC2 silicon?`, `${p.name} price volume revenue margin`,
    `${p.name} risks dependencies certification`, `Why now for the ${p.name}?`, ...g.concepts.map(c => `${p.name} ${c}`)];
  const best = new Float32Array(C).fill(-1);
  for (const q of queries) (await rank(q)).forEach((s, k) => { if (s > best[k]) best[k] = s; });
  const order = Array.from(best.keys()).sort((x, y) => best[y] - best[x]);
  // the six commercial use cases are written per function, not per product: offer the two nearest
  let uc = 0;
  for (const k of order) { if (uc >= 2) break; if (index.chunks[k].docTitle === 'Commercial Use Cases' && best[k] > 0) { picked.add(k); uc++; } }
  for (const k of order) {
    if (picked.size >= 22 || best[k] < 0) break;
    const c = index.chunks[k];
    if (re.test(`${c.section} ${c.text}`)) picked.add(k);
  }
  return {ev: [...picked].map(k => index.chunks[k]), g};
}

const SYSTEM = `You write the product pages of DeepGrid Semi's investor showcase (an Indian autonomous-systems company that
builds its own 28 nm SoC2 silicon; fifteen products share one die). Readers are investors and executives who want to know,
for one product, what it is used for, who pays, how it works, why now, how it makes money and what has to go right.
Use ONLY the numbered source passages. Return this JSON and nothing else:

{"lead": "2 sentences: what the product is and the single most decision-relevant fact about it.",
 "useCases": [{"title": "short name of the application", "buyer": "who pays, as named in the passages",
   "problem": "1-2 sentences: the job or obligation the buyer has", "delivers": "1-2 sentences: what DeepGrid supplies for it",
   "sources": [1, 4]}],
 "sections": [{"label": "How it works", "text": "...", "sources": [..]}, {"label": "Why now", "text": "...", "sources": [..]},
   {"label": "How it makes money", "text": "...", "sources": [..]}, {"label": "What has to go right", "text": "...", "sources": [..]}],
 "facts": [{"text": "Label: figure and meaning.", "sources": [..]}],
 "primary": 1}

Rules:
- useCases come first and matter most: 2 or 3 distinct applications, each a real buyer with a real job. If a
  "Commercial Use Cases" passage describes the same application, cite it.
- Each section is 3-4 sentences. Explain why, not only what. If passages disagree on a figure, say which says which.
- Exactly 4 facts. Copy figures exactly as the passages give them; never add, subtract or derive totals. Label
  forecasts as management projections.
- The operative rule is G.S.R. 834(E) as amended by G.S.R. 862(E); G.S.R. 184(E), which some passages cite, was the
  superseded draft. Call it "the ADAS mandate" or name the standard (AIS-162, AIS-184...), never "GSR 184(E)".
- No outside knowledge, no hype words, no mention of passages, sources or how this was written.`;
const LINE_SYSTEM = `You write the introduction to one product line on DeepGrid Semi's investor showcase. Use ONLY the plan
figures given and the numbered passages; state the line total exactly as given. Return JSON only: {"lead": "2-3 sentences: what the line is, who buys it, and its role in the plan", "sources": [1, 2]}.
Copy figures exactly; label forecasts as management projections; no hype, no mention of passages.`;
const PROMPT_VERSION = crypto.createHash('sha256').update(SYSTEM + LINE_SYSTEM + MODEL).digest('hex').slice(0, 12);

// --- the figure gate (as in build-showcase-themes.mjs) --------------------------------------------------------
const nums = s => (s.match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => x.replace(/,/g, ''));
const decimals = x => (x.split('.')[1] || '').length;
function supported(figure, sourceText) {
  const f = parseFloat(figure);
  if (!Number.isFinite(f) || (Number.isInteger(f) && f <= 12 && !figure.includes('.'))) return true;
  return nums(sourceText).some(x => {
    const v = parseFloat(x);
    if (!Number.isFinite(v)) return false;
    if (x === figure || v === f) return true;
    const d = decimals(figure);
    if (Math.abs(Number(v.toFixed(d)) - f) < 1e-9) return true;
    if (v < 1.5 && Math.abs(Number((v * 100).toFixed(d)) - f) < 1e-9) return true;
    return false;
  });
}
const passageText = c => `${c.section} ${c.text}`;
function repair(x, ev, text) {
  x.sources = [...new Set((x.sources || []).filter(i => ev[i - 1]))];
  if (!x.sources.length) return false;
  for (const f of nums(text)) {
    if (supported(f, x.sources.map(i => passageText(ev[i - 1])).join(' '))) continue;
    const k = ev.findIndex(c => supported(f, passageText(c)));
    if (k < 0) return false;
    x.sources.push(k + 1);
  }
  return true;
}
function gate(t, ev) {
  const dropped = [];
  const keep = (list, textOf) => (list || []).filter(x => { const ok = repair(x, ev, textOf(x)); if (!ok) dropped.push(textOf(x)); return ok; });
  t.useCases = keep(t.useCases, x => [x.title, x.buyer, x.problem, x.delivers].join(' '));
  t.sections = keep(t.sections, x => x.text);
  t.facts = keep(t.facts, x => x.text);
  const all = ev.map(passageText).join(' ');
  const missing = nums(t.lead || '').filter(f => !supported(f, all));
  if (missing.length) { dropped.push(`LEAD (${missing.join(', ')} not in any passage): ${t.lead}`); t.lead = null; }
  return dropped;
}

// --- sources as the page shows them ---------------------------------------------------------------------------
function sourceOf(c) {
  const page = /^p\. (\d+)$/.exec(c.pageLabel || '');
  const href = c.pdfPath ? c.pdfPath + (page && c.pdfPath.endsWith('.pdf') ? `#page=${page[1]}` : '') : '';
  const research = c.docTitle.startsWith('Research, ');
  return {id: c.id, doc: research ? 'Diligence note: ' + c.docTitle.slice(10) : c.docTitle, section: c.section.slice(0, 90),
    page: c.pageLabel || '', href, nav: (c.nav || '').replace(/&usecase=$/, '')};
}

async function write(system, user, check, done) {
  const messages = [{role: 'system', content: system}, {role: 'user', content: user}];
  let t = null, dropped = [];
  for (let tries = 1; tries <= TRIES; tries++) {
    const raw = await llm(messages);
    try { t = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch { t = null; continue; }
    dropped = check(t);
    if (done(t)) return {t, dropped};
    messages.push({role: 'assistant', content: raw}, {role: 'user', content:
      `These statements carry figures that do not appear in the passages they cite (or, for the lead, in any passage):\n- ${dropped.join('\n- ')}\n` +
      'Rewrite the whole JSON using only figures that appear verbatim in the passages.'});
  }
  return {t: null, dropped};
}

const out = {products: {...previous.products}, lines: {...previous.lines}}, failed = [];
// visible copy uses no em dash (scripts/strip-em-dash.mjs)
const noDash = s => s.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',').replace(/,\s*([.;:!?])/g, '$1');
const save = () => fs.writeFileSync(OUT, noDash(JSON.stringify(out, null, 1)) + '\n');

async function product(p) {
  const id = p.id;
  const {ev, g} = await evidence(id);
  const slides = slideRange(id), films = PRODUCT[id].films, walkthrough = slides.length ? filmStart(slides[0]) : null;
  const related = [...new Set([...g.related, ...products.filter(x => x.category === p.category && x.id !== id).map(x => x.id)])].slice(0, 4);
  const fixed = {slides, films, walkthrough, related};
  const evidenceHash = crypto.createHash('sha256').update(PROMPT_VERSION + ev.map(c => c.id + c.text).join('|')).digest('hex').slice(0, 16);
  const prev = previous.products[id];
  if (prev && !FORCE && prev.evidenceHash === evidenceHash) { out.products[id] = {...prev, ...fixed}; console.error(`= ${id} (unchanged)`); return; }
  const passages = ev.map((c, i) => `[${i + 1}] ${c.docTitle}, ${c.section}${c.pageLabel ? ` (${c.pageLabel})` : ''}\n${c.text.slice(0, 1400)}`).join('\n\n');
  const figures = `Listed price ${p.price}; FY2032 revenue ${p.revenue} (${p.share} of plan); gross margin ${p.margin}; first revenue ${p.firstRevenue}; volume ${p.units}.`;
  const {t, dropped} = await write(SYSTEM, `Product: ${p.name} (${p.category}). Plan figures from the product dossier: ${figures}\n\nSource passages:\n\n${passages}`,
    t => gate(t, ev), t => !!t?.lead && t.useCases.length >= 2 && t.sections.length >= 3 && t.facts.length >= 3);
  if (!t) { failed.push(id); console.error(`! ${id}: no version passed the figure gate; left out`); return; }
  const cited = [...new Set([t.primary, ...t.useCases.flatMap(x => x.sources), ...t.sections.flatMap(x => x.sources), ...t.facts.flatMap(x => x.sources)])]
    .filter(i => ev[i - 1]).sort((a, b) => a - b);
  const renumber = new Map(cited.map((i, n) => [i, n + 1]));
  const rs = list => list.map(i => renumber.get(i)).filter(Boolean);
  // a use case links to one of the six detailed commercial use cases only if it cites that one's passage
  const useCase = x => { const c = x.sources.map(i => ev[i - 1]).find(c => c.docTitle === 'Commercial Use Cases');
    return {title: x.title, buyer: x.buyer, problem: x.problem, delivers: x.delivers, sources: rs(x.sources),
      detail: c ? {id: c.section.split(' ')[0], title: c.section.split(' ').slice(1).join(' '), nav: c.nav} : null}; };
  out.products[id] = {id, lead: t.lead, useCases: t.useCases.map(useCase),
    sections: t.sections.map(x => ({label: x.label, text: x.text, sources: rs(x.sources)})),
    facts: t.facts.map(x => ({text: x.text, sources: rs(x.sources)})),
    sources: cited.map(i => sourceOf(ev[i - 1])), ...fixed, evidenceHash, model: MODEL, dropped};
  save();
  console.error(`+ ${id}: ${t.useCases.length} use cases, ${t.sections.length} sections, ${t.facts.length} facts, ${cited.length} sources, ${dropped.length} dropped`);
}

// A line lead states totals, and a total can pass the figure gate by matching an unrelated number in some passage
// ("75" for Silicon, where the line is 83.5). So the line's totals come from the product data and are given to the
// model, and any rupee-crore figure in the lead must be that total or a member product's revenue.
async function line(category) {
  const members = products.filter(p => p.category === category);
  const total = members.reduce((s, p) => s + p.revenueNum, 0), plan = products.reduce((s, p) => s + p.revenueNum, 0);
  const totalText = `₹${Number(total.toFixed(1))} Cr`, shareText = `${((total / plan) * 100).toFixed(1)}%`;
  const best = new Float32Array(C).fill(-1);
  for (const q of [`${category} product line`, `Who buys ${category} products?`, ...members.map(p => `${p.name} role in the portfolio`)])
    (await rank(q)).forEach((s, k) => { if (s > best[k]) best[k] = s; });
  const ev = Array.from(best.keys()).sort((x, y) => best[y] - best[x]).slice(0, 10).map(k => index.chunks[k]);
  const evidenceHash = crypto.createHash('sha256').update(PROMPT_VERSION + category + totalText + ev.map(c => c.id).join('|')).digest('hex').slice(0, 16);
  if (previous.lines[category] && !FORCE && previous.lines[category].evidenceHash === evidenceHash) return;
  const passages = ev.map((c, i) => `[${i + 1}] ${c.docTitle}, ${c.section}\n${c.text.slice(0, 1200)}`).join('\n\n');
  const figures = `FY2032 line total ${totalText}, ${shareText} of plan revenue (management projection). Members: ` +
    members.map(p => `${p.name} ${p.revenue} at ${p.margin} margin, ${p.price}, first revenue ${p.firstRevenue}`).join('; ') + '.';
  const allowedCr = new Set([Number(total.toFixed(1)), ...members.map(p => p.revenueNum)].map(String));
  const figureText = figures + ' ' + ev.map(passageText).join(' ');
  const check = t => {
    const bad = [];
    for (const m of (t.lead || '').matchAll(/₹\s?([\d,]+(?:\.\d+)?)\s?Cr/g)) if (!allowedCr.has(String(Number(m[1].replace(/,/g, ''))))) bad.push(`₹${m[1]} Cr is neither the line total (${totalText}) nor a member's revenue`);
    for (const f of nums(t.lead || '')) if (!supported(f, figureText)) bad.push(`${f} is not in the plan figures or passages`);
    return bad;
  };
  const {t} = await write(LINE_SYSTEM, `Product line: ${category}. Plan figures: ${figures}\n\nSource passages:\n\n${passages}`,
    check, t => !!t?.lead && check(t).length === 0);
  if (!t) { failed.push(category); return; }
  out.lines[category] = {lead: t.lead, total: totalText, share: shareText, evidenceHash};
  save();
  console.error(`+ line ${category}`);
}

const queue = products.filter(p => !ONLY || p.id === ONLY);
await Promise.all([1, 2, 3].map(async () => { while (queue.length) await product(queue.shift()); }));
if (!ONLY) for (const l of LINES) await line(l);
save();
console.error(`product briefs: ${Object.keys(out.products).length} products, ${Object.keys(out.lines).length} lines${failed.length ? `; left out: ${failed.join(', ')}` : ''}`);
if (failed.length) process.exitCode = 2;
