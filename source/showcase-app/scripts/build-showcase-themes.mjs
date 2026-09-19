// Writes the executive themes for this site's content (app/data/showcase-themes.json), in the DG32 site's
// ExecutiveTheme shape (app/data/graphrag-engine.ts): lead, three labelled explanation paragraphs, four facts,
// a primary citation and reference links. The DG32 themes are hand-written in the engine; these are written from
// the showcase's sources, one per question in knowledge/briefs-spec.json:
//   1. evidence: the showcase chunks (Doc #7-#9) of app/data/graphrag-unified-index.json, ranked like the page
//      ranks them (bge-small rows in public/graphrag/semantic.bin + 0.3 x TF-IDF), plus pinned memorandum
//      sections and product dossiers
//   2. a model writes the theme from ONLY those passages (CLIProxyAPI, claude-sonnet-4-6 via antigravity; never
//      a free tier)
//   3. a paragraph or fact survives only if every figure in it appears in a passage it cites (a figure found in
//      another evidence passage adds that passage to its sources); the lead's figures must appear in the evidence. Failures are dropped, the model is told which figures failed, and it retries.
//
//   npm run graph:themes     (after graph:index + build:semantic; then build:semantic again, since the themes are rows)
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
const spec = read('knowledge/briefs-spec.json');
const index = read('app/data/graphrag-unified-index.json');
const meta = read('public/graphrag/semantic.json');
const bin = new Int8Array(fs.readFileSync(path.join(ROOT, 'public/graphrag/semantic.bin')).buffer.slice(0));
const OUT = path.join(ROOT, 'app/data/showcase-themes.json');
const previous = Object.fromEntries((fs.existsSync(OUT) ? read('app/data/showcase-themes.json') : []).map(t => [t.title, t]));

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
      body: JSON.stringify({model: MODEL, temperature: 0.2, max_tokens: 3000, messages})});
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.choices?.[0]?.message?.content) return body.choices[0].message.content;
    console.error(`  model call ${attempt} failed: ${res.status} ${JSON.stringify(body.error || body).slice(0, 160)}`);
    await new Promise(r => setTimeout(r, 4000 * attempt));
  }
  throw new Error('model unavailable through CLIProxyAPI');
}

// --- retrieval over the showcase chunks, ranked as the page ranks them -------------------------------------
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
const products = read('app/products.json');
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
  return [...picked].map(k => index.chunks[k]);
}

const SYSTEM = `You write the curated executive answers for "Ask DeepGrid", the question console on DeepGrid Semi's investor
showcase (an Indian autonomous-systems company that builds its own 28 nm silicon). Readers are investors and executives.
Answer the question using ONLY the numbered source passages. Match this house style exactly:

- "lead": 2-3 sentences that answer the question directly, carrying the decision-relevant figures.
- "explanation": exactly 3 paragraphs, each 3-4 sentences, each opening with a short label and a colon
  (e.g. "The Demand Floor: ...", "What the Round Buys: ...", "Where the Numbers Diverge: ..."). Explain why, not just what.
  If sources disagree on a figure, one paragraph states both figures and which document says which.
- "facts": exactly 4 one-line facts, each "Label: figure and meaning." (e.g. "Equity Round: ₹45 Cr for 18.07% at ₹204 Cr pre-money.")
- Every paragraph and fact lists the passage numbers it relies on in "sources". "primary" is the single most authoritative passage.
- Use no outside knowledge. Copy figures exactly as the passages give them; never add, subtract or derive new totals.
  Label forecasts as management projections.
- Never mention passages, sources, retrieval or how the answer was made. No hype words.

Return ONLY JSON:
{"lead": "...", "explanation": [{"text": "Label: ...", "sources": [1, 3]}], "facts": [{"text": "Label: ...", "sources": [2]}], "primary": 1}`;
const PROMPT_VERSION = crypto.createHash('sha256').update(SYSTEM + MODEL).digest('hex').slice(0, 12);

// --- the figure gate ------------------------------------------------------------------------------------------
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
    if (Math.abs(Number(v.toFixed(d)) - f) < 1e-9) return true;                       // 1,128.45 stated as 1,128
    if (v < 1.5 && Math.abs(Number((v * 100).toFixed(d)) - f) < 1e-9) return true;   // 0.88 stated as 88%
    return false;
  });
}
function gate(t, ev) {
  const dropped = [];
  const text = ids => (ids || []).filter(i => ev[i - 1]).map(i => `${ev[i - 1].section} ${ev[i - 1].text}`).join(' ');
  // A figure missing from the cited passages but present in another evidence passage gets that passage added
  // to the statement's sources (the citation is repaired, not the claim); a figure found nowhere drops it.
  const ok = x => {
    x.sources = (x.sources || []).filter(i => ev[i - 1]);
    if (!x.sources.length) return false;
    for (const f of nums(x.text)) {
      if (supported(f, text(x.sources))) continue;
      const k = ev.findIndex(c => supported(f, `${c.section} ${c.text}`));
      if (k < 0) return false;
      x.sources.push(k + 1);
    }
    return true;
  };
  const keep = list => (list || []).filter(x => { const good = ok(x); if (!good) dropped.push(x.text); return good; });
  t.explanation = keep(t.explanation);
  t.facts = keep(t.facts);
  const missing = nums(t.lead || '').filter(f => !supported(f, ev.map(c => `${c.section} ${c.text}`).join(' ')));
  if (missing.length) { dropped.push(`LEAD (${missing.join(', ')} not in any passage): ${t.lead}`); t.lead = null; }
  if (!ev[(t.primary || 0) - 1]) t.primary = (t.explanation[0]?.sources || [1])[0];
  return dropped;
}

const CHAPTER = {summary: 'Executive summary', business: 'Business', technology: 'Technology', usecases: 'Use cases', choice: 'Strategy & economics', numbers: 'Financials & risks'};
const navLabel = (nav, c) => nav.startsWith('slides') ? `Open slide ${nav.split('=')[1]}` : nav.startsWith('portfolio') ? `Dossier: ${c.section.slice(0, 40)}`
  : nav.includes('usecase') ? `Use case: ${c.section.slice(0, 40)}` : `Memorandum · ${CHAPTER[nav.split('chapter=')[1]?.split('&')[0]] || 'Investment'}`;
const linksFor = cited => [...new Map(cited.filter(c => c?.nav).map(c => [c.nav, c])).values()].slice(0, 3)
  .map(c => ({label: navLabel(c.nav, c), hash: c.nav, description: `${c.docTitle} · ${c.section.slice(0, 80)}`}));
const REUSE = process.argv.includes('--reuse');
const out = new Map(), failed = [];
const save = () => fs.writeFileSync(OUT, JSON.stringify(spec.briefs.map(b => out.get(b.title)).filter(Boolean), null, 1) + '\n');

async function one(b) {
  if (ONLY && !b.title.toLowerCase().includes(ONLY)) { if (previous[b.title]) out.set(b.title, previous[b.title]); return; }
  const ev = await evidence(b);
  const evidenceHash = crypto.createHash('sha256').update(PROMPT_VERSION + b.ask + ev.map(c => c.id + c.text).join('|')).digest('hex').slice(0, 16);
  // --reuse keeps a theme's written text when only chunk hygiene changed (headings, page furniture): its figures were
  // gated against the same passages. Links and the primary citation are always recomputed from its sources.
  const prev = previous[b.title];
  if (prev && (REUSE || (!FORCE && prev.evidenceHash === evidenceHash))) {
    // relabel the saved links from their own destination and section (no chunk lookup: ids may have moved)
    const refLinks = prev.refLinks.map(l => ({...l, label: navLabel(l.hash, {section: l.description.split(' · ').slice(1).join(' · ')})}));
    out.set(b.title, {...prev, refLinks, evidenceHash: REUSE ? prev.evidenceHash : evidenceHash});
    console.error(`= ${b.title} (${REUSE ? 'reused' : 'unchanged'})`); return;
  }
  const passages = ev.map((c, i) => `[${i + 1}] ${c.docTitle} — ${c.section}${c.pageLabel ? ` (${c.pageLabel})` : ''}\n${c.text.slice(0, 1600)}`).join('\n\n');
  const messages = [{role: 'system', content: SYSTEM}, {role: 'user', content: `Question: ${b.ask}\n\nSource passages:\n\n${passages}`}];
  let t = null, dropped = [];
  for (let tries = 1; tries <= TRIES; tries++) {
    const raw = await llm(messages);
    try { t = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch { t = null; console.error(`  ${b.title}: unparseable (try ${tries})`); continue; }
    dropped = gate(t, ev);
    if (t.lead && t.explanation.length >= 2 && t.facts.length >= 3) break;
    console.error(`  ${b.title}: gate dropped ${dropped.length} (try ${tries})${process.env.THEME_DEBUG ? '\n    - ' + dropped.join('\n    - ') : ''}`);
    messages.push({role: 'assistant', content: raw}, {role: 'user', content:
      `These statements contain figures that do not appear in the passages they cite (or, for the lead, in any passage):\n- ${dropped.join('\n- ')}\n` +
      'Rewrite the whole JSON. Use only figures that appear verbatim in the passages; do not add, subtract or derive new totals.'});
  }
  if (!t?.lead || t.explanation.length < 2 || t.facts.length < 3) { failed.push(b.title); console.error(`! ${b.title}: no version passed the figure gate; left out`); return; }
  const primary = ev[t.primary - 1];
  const cited = [...new Set([t.primary, ...t.explanation.flatMap(x => x.sources), ...t.facts.flatMap(x => x.sources)])].map(i => ev[i - 1]);
  const refLinks = linksFor(cited);
  out.set(b.title, {keywords: [b.ask.toLowerCase().replace(/[?]/g, '')], title: b.title, tag: b.category.toUpperCase(),
    lead: t.lead, explanation: t.explanation.map(x => x.text), facts: t.facts.map(x => x.text),
    docNum: primary.docNum, docTitle: primary.docTitle, section: primary.section, page: primary.pageLabel,
    pdfPath: '', pdfSize: '', specPath: '', nav: primary.nav || refLinks[0]?.hash || '', refLinks,
    ask: b.ask, examples: b.examples, sources: cited.map(c => c.id), evidenceHash, model: MODEL, dropped});
  save();
  console.error(`+ ${b.title}: ${t.explanation.length} paragraphs, ${t.facts.length} facts, ${cited.length} sources, ${dropped.length} dropped`);
}

const queue = [...spec.briefs];
await Promise.all([1, 2, 3].map(async () => { while (queue.length) await one(queue.shift()); }));
save();
console.error(`showcase themes: ${out.size} -> app/data/showcase-themes.json${failed.length ? `; left out: ${failed.join(', ')}` : ''}`);
if (failed.length) process.exitCode = 2;
