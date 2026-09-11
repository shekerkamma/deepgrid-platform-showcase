/**
 * Parameter sweep for retrieval, measured leave-one-out.
 *
 * Questions are split 50/50 into dev and test by a stable hash of the question
 * text. Every parameter is chosen on DEV only; the winner is scored once on
 * TEST. Tuning and reporting on the same set is how a number becomes a story
 * about the test set instead of the retriever.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data/generated-questions.json'), 'utf8'));

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very just now tell show explain give does deepgrid').split(' '));
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w));
const flatten = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const U = idx.units, N = U.length, DF = idx.df;
const idOf = Object.fromEntries(U.map((u, i) => [u.id, i]));

// per-field token lists, so weights can be swept without re-tokenising
const F = U.map((u) => ({
  title: tok(u.title),
  qs: (u.questions || []).map((q) => ({ q, t: tok(q) })),
  body: tok(u.body),
}));

const pairs = [];
for (const [uid, e] of Object.entries(gen)) for (const q of e.q) {
  const h = parseInt(crypto.createHash('md5').update(q).digest('hex').slice(0, 8), 16);
  pairs.push({ uid, q, dev: h % 2 === 0 });
}

function build(P) {
  const TF = [], LEN = [], FLAT = [];
  for (let i = 0; i < N; i++) {
    const m = {};
    const add = (arr, w) => { for (const t of arr) m[t] = (m[t] || 0) + w; };
    add(F[i].title, P.wTitle);
    for (const { t } of F[i].qs) add(t, P.wQ);
    add(F[i].body, 1);
    TF.push(m);
    LEN.push(Object.values(m).reduce((a, b) => a + b, 0));
    FLAT.push(flatten(`${U[i].title} ${F[i].qs.map((x) => x.q).join(' ')} ${U[i].body}`));
  }
  const avg = LEN.reduce((a, b) => a + b, 0) / N;
  return { TF, LEN, FLAT, avg };
}

function evalSet(P, ix, useDev) {
  const { TF, LEN, FLAT, avg } = ix;
  let n = 0, r1 = 0, r4 = 0;
  for (const { uid, q, dev } of pairs) {
    if (dev !== useDev) continue;
    const i = idOf[uid]; if (i === undefined) continue;
    // leave-one-out: strip this question's own contribution from its passage
    const toks = tok(q); const undo = [];
    for (const w of toks) {
      const take = Math.min(TF[i][w] || 0, P.wQ);
      if (!take) continue;
      TF[i][w] -= take; if (!TF[i][w]) delete TF[i][w];
      LEN[i] -= take; undo.push([w, take]);
    }
    const savedFlat = FLAT[i];
    FLAT[i] = flatten(`${U[i].title} ${F[i].qs.filter((x) => x.q !== q).map((x) => x.q).join(' ')} ${U[i].body}`);

    const qs = tok(q);
    const qgrams = [];
    for (let g = 4; g >= 2; g--) for (let k = 0; k + g <= qs.length; k++) {
      const s = flatten(qs.slice(k, k + g).join('')); if (s.length >= 14) qgrams.push(s);
    }
    const scored = [];
    for (let j = 0; j < N; j++) {
      let sc = 0, matched = 0;
      for (const w of qs) {
        const f = TF[j][w]; if (!f) continue;
        matched++;
        const df = DF[w] || 0.5;
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        sc += idf * (f * (P.k1 + 1)) / (f + P.k1 * (1 - P.b + (P.b * LEN[j]) / avg));
      }
      if (!sc) continue;
      if (qs.length > 1) sc *= P.coord + (1 - P.coord) * (matched / qs.length);
      if (P.gram) { let g2 = 0; for (const qg of qgrams) if (FLAT[j].includes(qg)) { g2++; if (g2 === 2) break; } sc += g2 * P.gram; }
      scored.push([sc, U[j].id]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    n++;
    if (scored[0] && scored[0][1] === uid) r1++;
    if (scored.slice(0, 4).some((x) => x[1] === uid)) r4++;

    for (const [w, c] of undo) { TF[i][w] = (TF[i][w] || 0) + c; LEN[i] += c; }
    FLAT[i] = savedFlat;
  }
  return { n, r1: r1 / n, r4: r4 / n };
}

const BASE = { k1: 1.4, b: 0.72, coord: 0.55, gram: 2.2, wTitle: 2, wQ: 2 };
const grid = [];
for (const k1 of [0.9, 1.2, 1.6])
  for (const b of [0.3, 0.5, 0.75])
    for (const wQ of [2, 4, 6])
      for (const wTitle of [2, 4])
        grid.push({ ...BASE, k1, b, wQ, wTitle });

console.log(`dev questions: ${pairs.filter((p) => p.dev).length}   test: ${pairs.filter((p) => !p.dev).length}`);
const base = evalSet(BASE, build(BASE), true);
console.log(`baseline on DEV:  r@1 ${(100 * base.r1).toFixed(1)}%   r@4 ${(100 * base.r4).toFixed(1)}%\n`);

let best = { P: BASE, r1: base.r1 };
for (const P of grid) {
  const r = evalSet(P, build(P), true);
  if (r.r1 > best.r1) { best = { P, r1: r.r1, r4: r.r4 }; console.log(`  dev r@1 ${(100 * r.r1).toFixed(1)}%  r@4 ${(100 * r.r4).toFixed(1)}%  k1=${P.k1} b=${P.b} wQ=${P.wQ} wT=${P.wTitle}`); }
}
console.log(`\nbest on DEV: ${JSON.stringify(best.P)}`);
const held = evalSet(best.P, build(best.P), false);
const heldBase = evalSet(BASE, build(BASE), false);
console.log(`\nHELD-OUT TEST (${held.n} questions, never tuned on):`);
console.log(`  baseline   r@1 ${(100 * heldBase.r1).toFixed(1)}%   r@4 ${(100 * heldBase.r4).toFixed(1)}%`);
console.log(`  tuned      r@1 ${(100 * held.r1).toFixed(1)}%   r@4 ${(100 * held.r4).toFixed(1)}%`);
