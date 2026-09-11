/**
 * Scores the DEPLOYABLE dense arm: a query encoded in the browser as the
 * idf-weighted sum of derived term vectors, against the passage embeddings.
 *
 * No API key and no network call, which is the whole point -- a static page
 * cannot embed a query at runtime. The question this answers is whether that
 * approximation retrieves better than the lexical index, worse, or the same.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data/generated-questions.json'), 'utf8'));
const PV = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/passage-vectors.json'), 'utf8'));
const TV = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/term-vectors.json'), 'utf8'));

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very just now tell show explain give does deepgrid').split(' '));
const FOLD = idx.fold || {};
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w))
  .map((w) => FOLD[w] || w);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const U = idx.units, N = U.length, DF = idx.df;
const idOf = Object.fromEntries(U.map((u, i) => [u.id, i]));
const D = PV.dim;

const unit = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };
const PVEC = U.map((u) => { const v = PV.v['p:' + u.id]; return v ? unit(v) : null; });
const covered = PVEC.filter(Boolean).length;

const idf = (w) => { const d = DF[w] || 0.5; return Math.log(1 + (N - d + 0.5) / (d + 0.5)); };

/** the browser-side encoder: idf-weighted sum of derived term vectors */
function encode(qs) {
  const v = new Float64Array(D);
  let hit = 0;
  for (const w of qs) {
    const t = TV.terms[w];
    if (!t) continue;
    hit++;
    const wt = idf(w);
    for (let k = 0; k < D; k++) v[k] += wt * t[k] * TV.scale;
  }
  if (!hit) return null;
  const n = Math.hypot(...v) || 1;
  return Array.from(v, (x) => x / n);
}

// lexical arm, identical to the shipped engine
const TF = [], LEN = [], FLAT = [], TITLE = [];
for (const u of U) {
  const q = (u.questions || []).join(' ');
  const t = tok(`${u.title} ${u.title} ${q} ${q} ${u.body}`);
  const m = {};
  for (const w of t) m[w] = (m[w] || 0) + 1;
  TF.push(m); LEN.push(t.length); FLAT.push(flat(`${u.title} ${q} ${u.body}`)); TITLE.push(new Set(tok(u.title)));
}
const AVG = LEN.reduce((a, b) => a + b, 0) / N;

function lexical(qs, gg) {
  const b = qs.length <= 2 ? 0.25 : 0.72;
  const out = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    let s = 0, mt = 0, th = 0;
    for (const w of qs) {
      const f = TF[j][w]; if (!f) continue;
      mt++; if (TITLE[j].has(w)) th++;
      s += idf(w) * (f * 2.4) / (f + 1.4 * (1 - b + b * LEN[j] / AVG));
    }
    if (!s) continue;
    if (qs.length > 1) s *= 0.55 + 0.45 * (mt / qs.length);
    let g = 0; for (const x of gg) if (FLAT[j].includes(x)) { g++; if (g === 2) break; }
    s += g * 2.2;
    if (th) s *= 1 + 0.6 * (th / qs.length);
    if (U[j].kind === 'Hostile question') s *= 1.18;
    out[j] = s;
  }
  return out;
}
function dense(qv) {
  const out = new Float64Array(N);
  if (!qv) return out;
  for (let j = 0; j < N; j++) {
    const p = PVEC[j]; if (!p) continue;
    let s = 0; for (let k = 0; k < D; k++) s += qv[k] * p[k];
    out[j] = s > 0 ? s : 0;
  }
  return out;
}
function rrf(a, b, wa, wb, K = 60) {
  const ra = [...a.keys()].filter((i) => a[i] > 0).sort((x, y) => a[y] - a[x]);
  const rb = [...b.keys()].filter((i) => b[i] > 0).sort((x, y) => b[y] - b[x]);
  const s = new Float64Array(N);
  ra.forEach((i, r) => { s[i] += wa / (K + r + 1); });
  rb.forEach((i, r) => { s[i] += wb / (K + r + 1); });
  return s;
}
const top4 = (s) => [...s.keys()].filter((i) => s[i] > 0).sort((a, b) => s[b] - s[a]).slice(0, 4);

const RUNS = {
  'lexical (shipping)': (qs, gg) => lexical(qs, gg),
  'dense only (derived encoder)': (qs, gg, qv) => dense(qv),
  'hybrid RRF 1:1': (qs, gg, qv) => rrf(lexical(qs, gg), dense(qv), 1, 1),
  'hybrid RRF 2:1 lexical-lean': (qs, gg, qv) => rrf(lexical(qs, gg), dense(qv), 2, 1),
  'hybrid RRF 1:2 dense-lean': (qs, gg, qv) => rrf(lexical(qs, gg), dense(qv), 1, 2),
};
// restrict to the questions that also have a REAL Gemini query vector, so the
// derived encoder and the real one are compared on identical queries
const QV = fs.existsSync(path.join(root, '.embed-queries.json'))
  ? JSON.parse(fs.readFileSync(path.join(root, '.embed-queries.json'), 'utf8')).v : null;
const ONLY_SAMPLE = !!QV;
const R = Object.fromEntries(Object.keys(RUNS).map((k) => [k, [0, 0, 0]]));
let n = 0;

for (const [uid, e] of Object.entries(gen)) {
  for (const q of e.q) {
    const i = idOf[uid]; if (i === undefined) continue;
    if (ONLY_SAMPLE && !QV['q:' + q]) continue;
    // leave-one-out on the lexical arm only; the dense arm never saw the questions
    const toks = tok(q), undo = [];
    for (const w of toks) {
      const t = Math.min(TF[i][w] || 0, 2); if (!t) continue;
      TF[i][w] -= t; if (!TF[i][w]) delete TF[i][w];
      LEN[i] -= t; undo.push([w, t]);
    }
    const sf = FLAT[i];
    FLAT[i] = flat(`${U[i].title} ${(U[i].questions || []).filter((x) => x !== q).join(' ')} ${U[i].body}`);

    const qs = tok(q);
    const gg = [];
    for (let g = 4; g >= 2; g--) for (let k = 0; k + g <= qs.length; k++) {
      const s = flat(qs.slice(k, k + g).join('')); if (s.length >= 14) gg.push(s);
    }
    const qv = encode(qs);
    for (const [name, fn] of Object.entries(RUNS)) {
      const t = top4(fn(qs, gg, qv));
      R[name][0]++;
      if (t[0] === i) R[name][1]++;
      if (t.includes(i)) R[name][2]++;
    }
    for (const [w, c] of undo) { TF[i][w] = (TF[i][w] || 0) + c; LEN[i] += c; }
    FLAT[i] = sf;
    n++;
  }
}
console.log(`passages ${N} (${covered} with a vector)   queries ${n}   vocab ${Object.keys(TV.terms).length}\n`);
for (const [name, [c, a, b]] of Object.entries(R)) {
  console.log(`  ${name.padEnd(30)} r@1 ${((100 * a) / c).toFixed(1).padStart(5)}%   r@4 ${((100 * b) / c).toFixed(1).padStart(5)}%`);
}
