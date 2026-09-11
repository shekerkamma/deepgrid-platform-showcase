/**
 * Asks the shipped retriever a question and prints what the briefing agent
 * would answer. Mirrors engine.ts scoring exactly; validated against the live
 * browser. Usage: node scripts/ask.mjs "your question"  (or --file q.txt)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very just now tell show explain give does deepgrid').split(' '));
const FOLD = idx.fold || {};
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w))
  .map((w) => FOLD[w] || w);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const U = idx.units, N = U.length, DF = idx.df;
const TF = [], LEN = [], FLAT = [];
for (const u of U) {
  const q = (u.questions || []).join(' ');
  const t = tok(`${u.title} ${u.title} ${q} ${q} ${u.body}`);
  const m = {};
  for (const w of t) m[w] = (m[w] || 0) + 1;
  TF.push(m); LEN.push(t.length); FLAT.push(flat(`${u.title} ${q} ${u.body}`));
}
const TITLE = U.map((u) => new Set(tok(u.title)));
const AVG = LEN.reduce((a, b) => a + b, 0) / N;
const ANSWER_THRESHOLD = 3.2;

function ask(question) {
  const qs = tok(question);
  const gg = [];
  for (let g = 4; g >= 2; g--) for (let k = 0; k + g <= qs.length; k++) {
    const s = flat(qs.slice(k, k + g).join('')); if (s.length >= 14) gg.push(s);
  }
  const b = qs.length <= 2 ? 0.25 : 0.72;
  const hits = [];
  for (let j = 0; j < N; j++) {
    let s = 0, mt = 0, titleHits = 0;
    for (const w of qs) {
      const f = TF[j][w]; if (!f) continue;
      mt++;
      if (TITLE[j].has(w)) titleHits++;
      const df = DF[w] || 0.5;
      s += Math.log(1 + (N - df + 0.5) / (df + 0.5)) * (f * 2.4) / (f + 1.4 * (1 - b + b * LEN[j] / AVG));
    }
    if (!s) continue;
    if (qs.length > 1) s *= 0.55 + 0.45 * (mt / qs.length);
    let g = 0; for (const x of gg) if (FLAT[j].includes(x)) { g++; if (g === 2) break; }
    s += g * 2.2;
    if (titleHits > 0) s *= 1 + 0.6 * (titleHits / qs.length);
    if (U[j].kind === 'Hostile question') s *= 1.18;
    if (U[j].kind === 'Document audit') s *= 0.72;
    hits.push({ s, u: U[j] });
  }
  hits.sort((a, b) => b.s - a.s);
  return hits;
}

const fileArg = process.argv.indexOf('--file');
const questions = fileArg > -1
  ? fs.readFileSync(process.argv[fileArg + 1], 'utf8').split('\n').map((x) => x.trim()).filter(Boolean)
  : [process.argv.slice(2).join(' ')];

for (const q of questions) {
  const hits = ask(q);
  const top = hits[0];
  console.log(`\nQ  ${q}`);
  if (!top || top.s < ANSWER_THRESHOLD) { console.log('   REFUSED (nothing scored above threshold)'); continue; }
  console.log(`   [${top.s.toFixed(1)}] ${top.u.source}`);
  console.log(`   ${top.u.body.replace(/\s+/g, ' ').slice(0, 260)}`);
  const also = hits.slice(1, 4).map((h) => h.u.source).join('  |  ');
  if (also) console.log(`   also: ${also}`);
}
