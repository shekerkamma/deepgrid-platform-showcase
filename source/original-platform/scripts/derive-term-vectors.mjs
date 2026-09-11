/**
 * Derives a term -> dense-vector table by ridge regression from the passage
 * embeddings, so a query can be encoded in the browser with no API key.
 *
 * Why this exists: gemini-embedding-001 gives us a vector per passage at build
 * time, but a GitHub Pages build cannot embed the *query* at runtime without
 * shipping the key. Solving `min_W ||X W - Y||^2 + lambda ||W||^2`, where X is
 * the passages' sparse tf-idf and Y their embeddings, yields one vector per
 * vocabulary term. A query is then encoded as its terms' tf-idf-weighted sum.
 *
 * This is an approximation of a real sentence encoder and is expected to lose
 * accuracy against it. How much is a measurement, not a guess: eval-hybrid.mjs
 * scores both arms so the loss is visible before anything ships.
 *
 * Solved in the dual (655x655) rather than the primal (3751x3751): far fewer
 * passages than terms, so the kernel form is both smaller and better posed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const PV = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/passage-vectors.json'), 'utf8'));

const LAMBDA = Number(process.env.RIDGE_LAMBDA || 1.0);
const MIN_DF = Number(process.env.MIN_DF || 2);

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very just now tell show explain give does deepgrid').split(' '));
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w));

const units = idx.units.filter((u) => PV.v['p:' + u.id]);
const N = units.length;
const DF = idx.df;
const vocab = Object.keys(DF).filter((w) => DF[w] >= MIN_DF);
const vi = Object.fromEntries(vocab.map((w, i) => [w, i]));
const V = vocab.length;
const D = PV.dim;

const idf = (w) => Math.log(1 + (idx.units.length - (DF[w] || 0.5) + 0.5) / ((DF[w] || 0.5) + 0.5));

// X: sparse tf-idf rows, L2-normalised so long passages don't dominate the fit
const rows = units.map((u) => {
  const t = tok(`${u.title} ${u.title} ${u.body}`);
  const m = new Map();
  for (const w of t) if (vi[w] !== undefined) m.set(vi[w], (m.get(vi[w]) || 0) + 1);
  let ss = 0;
  for (const [k, f] of m) { const v = (1 + Math.log(f)) * idf(vocab[k]); m.set(k, v); ss += v * v; }
  const n = Math.sqrt(ss) || 1;
  for (const [k, v] of m) m.set(k, v / n);
  return m;
});
const Y = units.map((u) => PV.v['p:' + u.id].map((x) => x * PV.scale));

// K = X X^T  (dual kernel, N x N)
const K = Array.from({ length: N }, () => new Float64Array(N));
for (let i = 0; i < N; i++) {
  for (let j = i; j < N; j++) {
    let s = 0;
    const a = rows[i].size <= rows[j].size ? rows[i] : rows[j];
    const b = a === rows[i] ? rows[j] : rows[i];
    for (const [k, v] of a) { const w = b.get(k); if (w) s += v * w; }
    K[i][j] = s; K[j][i] = s;
  }
  K[i][i] += LAMBDA;
}
// solve (K + lambda I) A = Y by Gaussian elimination with partial pivoting
const A = Array.from({ length: N }, (_, i) => Y[i].slice());
for (let c = 0; c < N; c++) {
  let p = c;
  for (let r = c + 1; r < N; r++) if (Math.abs(K[r][c]) > Math.abs(K[p][c])) p = r;
  if (p !== c) { [K[c], K[p]] = [K[p], K[c]]; [A[c], A[p]] = [A[p], A[c]]; }
  const piv = K[c][c];
  if (Math.abs(piv) < 1e-12) continue;
  for (let r = c + 1; r < N; r++) {
    const f = K[r][c] / piv;
    if (!f) continue;
    for (let k = c; k < N; k++) K[r][k] -= f * K[c][k];
    for (let k = 0; k < D; k++) A[r][k] -= f * A[c][k];
  }
}
for (let c = N - 1; c >= 0; c--) {
  const piv = K[c][c] || 1e-12;
  for (let k = 0; k < D; k++) {
    let s = A[c][k];
    for (let r = c + 1; r < N; r++) s -= K[c][r] * A[r][k];
    A[c][k] = s / piv;
  }
}
// W = X^T A  -> one row per vocabulary term
const W = Array.from({ length: V }, () => new Float64Array(D));
for (let i = 0; i < N; i++) {
  for (const [k, v] of rows[i]) {
    const w = W[k], a = A[i];
    for (let d = 0; d < D; d++) w[d] += v * a[d];
  }
}
let maxAbs = 0;
for (const w of W) for (const x of w) if (Math.abs(x) > maxAbs) maxAbs = Math.abs(x);
const scale = maxAbs / 127 || 1;
const out = { dim: D, scale, minDf: MIN_DF, lambda: LAMBDA, terms: {} };
for (let i = 0; i < V; i++) {
  const q = Array.from(W[i], (x) => Math.max(-127, Math.min(127, Math.round(x / scale))));
  if (q.some((x) => x !== 0)) out.terms[vocab[i]] = q;
}
const dest = path.join(root, 'src/a2ui/generated/term-vectors.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.error(`passages ${N}  vocab ${V}  dim ${D}  lambda ${LAMBDA}`);
console.error(`wrote ${dest}  ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
