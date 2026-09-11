/**
 * Retrieval evaluation harness.
 *
 * WHY: the agent's spec is "a visitor can ask anything", but it was being
 * judged on a handful of hand-written queries. That measures the queries, not
 * the agent. This runs every generated question -- each of which has a KNOWN
 * correct passage, the one it was generated from -- and reports recall.
 *
 * The scoring below MUST mirror src/a2ui/engine.ts. `--validate` prints a few
 * rankings so they can be checked against the browser before any number here
 * is believed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data/generated-questions.json'), 'utf8'));

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by ' +
  'from we our you your they their he she i not no do does did what which who whom how why when where can ' +
  'could should would will shall may might must if then than there here them us me my mine about into over ' +
  'under out up down off any all some more most other such only own same so too very just now tell show ' +
  'explain give does deepgrid').split(' '));
const tokenize = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w));
const flatten = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const U = idx.units, N = U.length, avg = idx.avglen, DF = idx.df;
const TF = [], LEN = [], FLAT = [];
for (const u of U) {
  const q = (u.questions || []).join(' ');
  const t = tokenize(`${u.title} ${u.title} ${q} ${q} ${u.body}`);
  const m = {}; for (const w of t) m[w] = (m[w] || 0) + 1;
  TF.push(m); LEN.push(t.length); FLAT.push(flatten(`${u.title} ${q} ${u.body}`));
}
const THRESHOLD = 3.2;

function retrieve(question, limit = 4) {
  const qs = tokenize(question);
  if (!qs.length) return [];
  const qgrams = [];
  for (let n = 4; n >= 2; n--) for (let i = 0; i + n <= qs.length; i++) {
    const g = flatten(qs.slice(i, i + n).join('')); if (g.length >= 14) qgrams.push(g);
  }
  const k1 = 1.4, b = 0.72;
  const out = U.map((unit, i) => {
    let score = 0, matched = 0;
    for (const q of qs) {
      const f = TF[i][q]; if (!f) continue;
      matched++;
      const n = DF[q] || 0.5;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + (b * LEN[i]) / avg));
    }
    if (qs.length > 1) score *= 0.55 + 0.45 * (matched / qs.length);
    if (score > 0) { let g = 0; for (const qg of qgrams) if (FLAT[i].includes(qg)) { g++; if (g === 2) break; } score += g * 2.2; }
    if (unit.kind === 'Hostile question') score *= 1.18;
    return { unit, score };
  });
  return out.filter((h) => h.score > 0).sort((a, b2) => b2.score - a.score).slice(0, limit);
}

if (process.argv.includes('--validate')) {
  for (const q of ['Who buys the forklift kit and why now?', 'Is this a chip company or a systems company?',
                   'How do we defend against Starkenn?', 'What is the recipe for sourdough bread?']) {
    const h = retrieve(q, 1)[0];
    console.log(`${q}\n  -> ${h && h.score >= THRESHOLD ? h.unit.source : 'REFUSED'}  (score ${h ? h.score.toFixed(2) : 0})`);
  }
  process.exit(0);
}

/* ── LEAVE-ONE-OUT.
 * Scoring a generated question against an index that CONTAINS that question is
 * circular: the query text sits inside its own answer, and recall comes back
 * at 99.6% while measuring nothing. Before each question is scored, its own
 * tokens are removed from its own passage's term frequencies, so the passage
 * has to be found on its actual content. Every other passage is untouched. */
const idOf = Object.fromEntries(U.map((u, i) => [u.id, i]));
function withoutQuestion(uid, q) {
  const i = idOf[uid];
  if (i === undefined) return null;
  const toks = tokenize(q);
  const removed = [];
  for (const w of toks) {                       // questions are weighted x2 in TF
    const take = Math.min(TF[i][w] || 0, 2);
    if (!take) continue;
    TF[i][w] -= take; if (!TF[i][w]) delete TF[i][w];
    removed.push([w, take]); LEN[i] -= take;
  }
  const flat = FLAT[i];
  FLAT[i] = flatten(`${U[i].title} ${(U[i].questions || []).filter((x) => x !== q).join(' ')} ${U[i].body}`);
  return () => { for (const [w, c] of removed) { TF[i][w] = (TF[i][w] || 0) + c; LEN[i] += c; } FLAT[i] = flat; };
}

let n = 0, r1 = 0, r4 = 0, refused = 0;
const byKind = {};
for (const [uid, entry] of Object.entries(gen)) {
  for (const q of entry.q) {
    const restore = withoutQuestion(uid, q);
    const hits = retrieve(q, 4);
    if (restore) restore();
    n++;
    const kind = (U.find((u) => u.id === uid) || {}).kind || '?';
    byKind[kind] ??= { n: 0, r1: 0, r4: 0 };
    byKind[kind].n++;
    if (!hits.length || hits[0].score < THRESHOLD) { refused++; continue; }
    if (hits[0].unit.id === uid) { r1++; byKind[kind].r1++; }
    if (hits.some((h) => h.unit.id === uid)) { r4++; byKind[kind].r4++; }
  }
}
console.log(`questions evaluated: ${n}   (each has one known-correct passage)\n`);
console.log(`  recall@1   ${(100 * r1 / n).toFixed(1)}%   the right passage ranked first`);
console.log(`  recall@4   ${(100 * r4 / n).toFixed(1)}%   the right passage in the shown set`);
console.log(`  refused    ${(100 * refused / n).toFixed(1)}%   scored below the answer threshold\n`);
console.log('by source kind:');
for (const [k, v] of Object.entries(byKind).sort((a, b2) => b2[1].n - a[1].n))
  console.log(`  ${String(v.n).padStart(4)}  ${(100 * v.r1 / v.n).toFixed(0).padStart(3)}% @1  ${(100 * v.r4 / v.n).toFixed(0).padStart(3)}% @4   ${k}`);
