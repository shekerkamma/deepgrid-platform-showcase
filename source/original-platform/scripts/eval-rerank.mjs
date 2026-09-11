/**
 * Does an LLM reranker convert recall@4 into recall@1?
 *
 * The measured failure mode is not that the right passage is missing -- it is
 * in the shown four 59% of the time while ranking first only 31%. A reranker
 * reads the query against those four and reorders them, which is precisely
 * that gap. Unlike embeddings it needs no vectors, so Claude can do it.
 *
 * Costs real model calls, so it batches and samples. Usage:
 *   node scripts/eval-rerank.mjs [--n 60] [--batch 10]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data/generated-questions.json'), 'utf8'));

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? Number(process.argv[i + 1]) : d; };
const N_Q = arg('--n', 60);
const BATCH = arg('--batch', 10);

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by from we our you your they their he she i not no do does did what which who whom how why when where can could should would will shall may might must if then than there here them us me my mine about into over under out up down off any all some more most other such only own same so too very just now tell show explain give does deepgrid').split(' '));
const FOLD = idx.fold || {};
const tok = (s) => (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
  .map((w) => w.replace(/^[.-]+|[.-]+$/g, '')).filter((w) => w.length > 1 && !STOP.has(w))
  .map((w) => FOLD[w] || w);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const U = idx.units, N = U.length, DF = idx.df;
const idOf = Object.fromEntries(U.map((u, i) => [u.id, i]));
const TF = [], LEN = [], FLAT = [], TITLE = [];
for (const u of U) {
  const q = (u.questions || []).join(' ');
  const t = tok(`${u.title} ${u.title} ${q} ${q} ${u.body}`);
  const m = {};
  for (const w of t) m[w] = (m[w] || 0) + 1;
  TF.push(m); LEN.push(t.length); FLAT.push(flat(`${u.title} ${q} ${u.body}`)); TITLE.push(new Set(tok(u.title)));
}
const AVG = LEN.reduce((a, b) => a + b, 0) / N;
const idf = (w) => { const d = DF[w] || 0.5; return Math.log(1 + (N - d + 0.5) / (d + 0.5)); };

/* Leave-one-out. The generated questions are indexed INTO the passages they
 * came from, so without this the query text sits inside its own answer and
 * lexical scores 98% -- which is what the first run of this script reported. */
function withoutOwnQuestion(i, q) {
  const undo = [];
  for (const w of tok(q)) {
    const take = Math.min(TF[i][w] || 0, 2);
    if (!take) continue;
    TF[i][w] -= take; if (!TF[i][w]) delete TF[i][w];
    LEN[i] -= take; undo.push([w, take]);
  }
  const savedFlat = FLAT[i];
  FLAT[i] = flat(`${U[i].title} ${(U[i].questions || []).filter((x) => x !== q).join(' ')} ${U[i].body}`);
  return () => {
    for (const [w, c] of undo) { TF[i][w] = (TF[i][w] || 0) + c; LEN[i] += c; }
    FLAT[i] = savedFlat;
  };
}

function topK(q, k) {
  const qs = tok(q);
  if (!qs.length) return [];
  const b = qs.length <= 2 ? 0.25 : 0.72;
  const gg = [];
  for (let g = 4; g >= 2; g--) for (let i = 0; i + g <= qs.length; i++) {
    const x = flat(qs.slice(i, i + g).join('')); if (x.length >= 14) gg.push(x);
  }
  const out = [];
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
    out.push([s, j]);
  }
  return out.sort((a, b2) => b2[0] - a[0]).slice(0, k).map((x) => x[1]);
}

/* Window the excerpt on the rarest query term the passage contains. A
 * head-of-body cut hid the answer: "15 Provisional Patents" is at char 1,057
 * of an 1,186-char passage, so a 320-char head showed a chiplet floorplan. */
function excerptFor(question, body, width = 420) {
  const flatBody = body.replace(/\s+/g, ' ');
  const qs = tok(question);
  if (!qs.length) return flatBody.slice(0, width);
  const lower = flatBody.toLowerCase();
  let bestAt = -1, bestIdf = -1;
  for (const w of qs) {
    const at = lower.indexOf(w);
    if (at < 0) continue;
    const v = idf(w);
    if (v > bestIdf) { bestIdf = v; bestAt = at; }
  }
  if (bestAt < 0) return flatBody.slice(0, width);
  let start = Math.max(0, bestAt - Math.floor(width / 3));
  if (start > 0) { const sp = flatBody.indexOf(' ', start); if (sp > -1 && sp < start + 30) start = sp + 1; }
  return (start > 0 ? '… ' : '') + flatBody.slice(start, start + width);
}

// deterministic sample
const pairs = [];
for (const [uid, e] of Object.entries(gen)) for (const q of e.q) if (idOf[uid] !== undefined) pairs.push({ uid, q });
pairs.sort((a, b) => crypto.createHash('md5').update(a.q).digest('hex')
  .localeCompare(crypto.createHash('md5').update(b.q).digest('hex')));
const sample = pairs.slice(0, N_Q);

/* Backend under test. --backend gemini uses the API directly (about 1s per
 * call); the default spawns the Claude CLI (about 8s), which is fine for a
 * benchmark but too slow to sit in front of a user typing a question. */
const BACKEND = (() => { const i = process.argv.indexOf('--backend'); return i > -1 ? process.argv[i + 1] : 'claude'; })();
const GEM_MODEL = process.env.RERANK_MODEL || 'gemini-2.5-flash';
const GEM_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function gemini(prompt) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEM_MODEL}:generateContent?key=${GEM_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // without this the reasoning tokens consume the output budget and
          // the reply comes back empty -- which reads as a refusal, not a bug
          // flash-lite rejects thinkingConfig outright with HTTP 400; flash
          // NEEDS it, or reasoning tokens eat the budget and the reply is ''.
          generationConfig: /lite/.test(GEM_MODEL)
            ? { maxOutputTokens: 400, temperature: 0 }
            : { maxOutputTokens: 400, temperature: 0, thinkingConfig: { thinkingBudget: 0 } },
        }) });
    if (r.ok) { const j = await r.json(); return j?.candidates?.[0]?.content?.parts?.[0]?.text || ''; }
    if (r.status === 429 || r.status === 503) {
      const body = await r.text();
      // A per-DAY quota will never clear inside a retry loop. Say so and stop,
      // rather than burning three sleeps per batch and reporting lexical order
      // as if the reranker had answered.
      if (/PerDay/.test(body)) { console.error('\n  QUOTA EXHAUSTED (per-day) on ' + GEM_MODEL); process.exit(3); }
      await new Promise((x) => setTimeout(x, 6000 * (attempt + 1))); continue;
    }
    return '';
  }
  return '';
}

const claude = (prompt) => new Promise((res) => {
  const p = execFile('claude', ['-p', '--model', 'claude-sonnet-5'], { maxBuffer: 1 << 24, timeout: 240000 },
    (err, stdout) => res(err ? '' : stdout));
  p.stdin.end(prompt);   // argv-passed prompts hang on an inherited stdin
});

let base1 = 0, base4 = 0, re1 = 0, done = 0, parsed = 0;

for (let i = 0; i < sample.length; i += BATCH) {
  const chunk = sample.slice(i, i + BATCH);
  const blocks = [];
  const cand = [];
  chunk.forEach((it, n) => {
    const restore = withoutOwnQuestion(idOf[it.uid], it.q);
    const k = topK(it.q, 4);
    restore();
    cand.push(k);
    const gold = idOf[it.uid];
    if (k[0] === gold) base1++;
    if (k.includes(gold)) base4++;
    blocks.push(`### Question ${n + 1}\n${it.q}\n` + k.map((j, r) =>
      `[${r + 1}] ${U[j].title} — ${excerptFor(it.q, U[j].body)}`).join('\n'));
  });
  const prompt = `You are ranking retrieved passages for a DeepGrid Semi investor dossier.
For each question, choose which ONE of its numbered passages best answers it.

Output ONLY a JSON object mapping question number to passage number, e.g.
{"1":2,"2":1,"3":4}
No prose, no code fence, no explanation. Exactly ${chunk.length} keys.

${blocks.join('\n\n')}`;
  const out = BACKEND === 'gemini' ? await gemini(prompt) : await claude(prompt);
  /* The first parser required "N: M" at the START of a line and dropped 120 of
   * 200 replies -- a silent fallback to lexical order that made the reranker
   * look weak when it had actually answered. Parse JSON first, then scrape any
   * number:number pair anywhere in the text. */
  const picks = {};
  const j = out.match(/\{[\s\S]*?\}/);
  if (j) { try { Object.entries(JSON.parse(j[0])).forEach(([k, v]) => { picks[Number(k)] = Number(v); }); } catch { /* fall through */ } }
  if (!Object.keys(picks).length) {
    for (const m of out.matchAll(/(\d+)\s*[:.)\-=>]+\s*\[?(\d)\]?/g)) picks[Number(m[1])] = Number(m[2]);
  }
  chunk.forEach((it, n) => {
    const gold = idOf[it.uid];
    const k = cand[n];
    const pick = picks[n + 1];
    if (pick >= 1 && pick <= k.length) { parsed++; if (k[pick - 1] === gold) re1++; }
    else if (k[0] === gold) re1++;   // unparsed -> keep the lexical order
    done++;
  });
  console.error(`  ${done}/${sample.length}`);
}

const pct = (x) => `${((100 * x) / done).toFixed(1)}%`;
console.log(`\nbackend: ${BACKEND}${BACKEND === 'gemini' ? ` (${GEM_MODEL})` : ''}`);
console.log(`queries: ${done}   reranker replies parsed: ${parsed}/${done}\n`);
console.log(`  lexical            r@1 ${pct(base1)}   r@4 ${pct(base4)}`);
const label = BACKEND === 'gemini' ? GEM_MODEL : 'claude-sonnet-5';
console.log(`  + rerank           r@1 ${pct(re1)}   (${label})`);
console.log(`\n  ceiling for a reranker over these candidates is r@4 = ${pct(base4)}`);
