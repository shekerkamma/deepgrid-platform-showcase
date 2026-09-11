/**
 * Build-time question expansion for the A2UI briefing agent.
 *
 * WHY: lexical retrieval fails when a question is worded unlike the document.
 * "Should we do the tapeout now or wait?" carries almost no discriminating
 * terms and misses; "Why defer the tapeout?" hits. Real embeddings would fix
 * that, but semantic search needs the VISITOR'S question embedded at query
 * time, and this page is static -- no server to hold a key, and a key in
 * client JS is a leaked key.
 *
 * So the vocabulary gap is closed from the other side: ask Gemini at BUILD
 * time which questions each passage answers, and index those question forms
 * with the passage. Zero runtime cost, nothing extra to download, key never
 * leaves this machine.
 *
 *   node scripts/expand-questions.mjs [--batch N] [--model a,b,c] [--limit N]
 *
 * Idempotent: cached by passage-content hash, so a re-run only pays for
 * passages whose text changed.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };

const KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GOOGLE_GENERATIVE_AI_API_KEY not set; skipping.'); process.exit(0); }

// The free tier allows ~20 generateContent requests PER DAY PER MODEL. That is
// a daily cap, not a rate limit, so pacing does not help -- batch instead, and
// rotate models when one is exhausted (the quota is per-model). gemini-omni-*
// are in the catalog but 429 on this key's tier, hence a list not a hardcode.
const MODELS = (arg('--model', '') || [
  'gemini-flash-latest',
  'gemini-3-flash-preview',
  'gemini-flash-lite-latest',
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemini-2.5-flash',
].join(',')).split(',');
const BATCH = parseInt(arg('--batch', '10'), 10);
const LIMIT = parseInt(arg('--limit', '0'), 10) || 0;
let modelIdx = 0;

const idxPath = path.join(root, 'src/a2ui/generated/knowledge-index.json');
if (!fs.existsSync(idxPath)) { console.error('run build-knowledge-index.mjs first'); process.exit(1); }
const index = JSON.parse(fs.readFileSync(idxPath, 'utf8'));

const cachePath = path.join(root, 'src/a2ui/data/generated-questions.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);

const PROMPT = (batch) => {
  const blocks = batch.map((u) =>
    `--- id: ${u.id}\nTITLE: ${u.title}\nPASSAGE: ${u.body.slice(0, 1100)}`).join('\n\n');
  return `You are indexing passages from a confidential investor dossier so questions can be routed to the right one.

For EACH passage below, write the questions it genuinely answers. Rules:
- Up to 5 per passage, fewer if it answers fewer. Only questions the passage actually answers.
- Use the words an investor or analyst would use, NOT the passage's own phrasing. That is the point: the passage is already searchable by its own words.
- Include a blunt or sceptical phrasing where the content supports it.
- Every question ends with a question mark.

Return ONLY a JSON object mapping each passage id to an array of question strings. No markdown, no commentary.

${blocks}`;
};

async function ask(text) {
  let attempt = 0;
  while (modelIdx < MODELS.length) {
    const model = MODELS[modelIdx];
    let j;
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          /* thinkingBudget is rejected outright by the -lite and gemma models:
           * they answer a request carrying it with a bare HTTP 400, which the
           * error branch below reads as exhaustion and skips the model for the
           * whole run. Key the config off the model name, exactly as
           * proxy/rerank-worker.js already does. */
          generationConfig: /lite|gemma/.test(model)
            ? { maxOutputTokens: 8192, temperature: 0.3 }
            : { maxOutputTokens: 8192, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
        }),
      });
      j = await r.json();
    } catch (e) { console.log(`  ${model} network error: ${e.message.slice(0, 60)}`); modelIdx++; continue; }
    if (j.error) {
      /* A 429 is two different things wearing one status code, and conflating
       * them cost this script its cheapest model. PerDay quota IS exhaustion --
       * pacing cannot clear it, so move on. PerMinute is a rate limit that
       * clears in under a minute, and the response carries a RetryInfo saying
       * exactly how long to wait. Treating the second as the first drops the
       * highest-quota model on its first busy moment and then reports "no model
       * has quota left" over a tier that was working fine. */
      const msg = JSON.stringify(j.error);
      const retryInfo = (j.error.details || []).find((d) => (d['@type'] || '').endsWith('RetryInfo'));
      if (j.error.code === 429 && !/PerDay/.test(msg) && attempt < 6) {
        const wait = Math.ceil(parseFloat((retryInfo?.retryDelay || '30s').replace('s', ''))) + 2;
        console.log(`  ${model} rate-limited, waiting ${wait}s (${attempt + 1}/6)`);
        await new Promise((r) => setTimeout(r, wait * 1000));
        attempt++; continue;
      }
      if (j.error.code === 429 || j.error.code === 404 || j.error.code === 400) {
        console.log(`  ${model} unavailable (${j.error.code}${/PerDay/.test(msg) ? ', daily quota' : ''}) -> next model`);
        modelIdx++; attempt = 0; continue;
      }
      // 500/503 are transient overload, not exhaustion: retry the same model
      // rather than burning through the model list and reporting "no quota".
      if (j.error.code >= 500 && attempt < 3) {
        console.log(`  ${model} ${j.error.code}, retry ${attempt + 1}/3`);
        await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
        attempt++; continue;
      }
      console.log(`  ${model} error ${j.error.code} -> next model`);
      modelIdx++; attempt = 0; continue;
    }
    const parts = j.candidates?.[0]?.content?.parts || [];
    attempt = 0;
    return { model, text: parts.map((p) => p.text || '').join('').trim() };
  }
  return null;
}

// Every kind gets expanded. An earlier version excluded 'Slide' on the theory
// that the "slide N" lookup branch covered it and the narration restated it.
// Both halves were wrong: that branch only fires on a literal slide number,
// and the narration is separately authored, so the deck's on-slide tables,
// figures and speaker notes are unique to it.
const PRIORITY = ['Hostile question', 'Investor memorandum', 'Information memorandum',
  'Market research', 'Strategy', 'Competitor', 'Use case', 'Argument',
  'Supporting claim', 'Governing thought', 'Framing', 'Scope', 'Core message',
  'Slide', 'Video narration'];
let targets = index.units.filter((u) => PRIORITY.includes(u.kind));
if (LIMIT) targets = targets.slice(0, LIMIT);

const pending = targets.filter((u) => cache[u.id]?.h !== hash(u.title + u.body));
const cachedN = targets.length - pending.length;
console.log(`${targets.length} passages: ${cachedN} cached, ${pending.length} to expand`);
console.log(`batching ${BATCH} per request across ${MODELS.length} models`);

let done = 0, failed = 0, reqs = 0;
for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  const res = await ask(PROMPT(batch));
  reqs++;
  if (!res) { failed += pending.length - i; console.log('  no model has quota left; stopping'); break; }
  let obj = null;
  try { const m = res.text.match(/\{[\s\S]*\}/); obj = m ? JSON.parse(m[0]) : null; } catch { obj = null; }
  if (!obj) { failed += batch.length; console.log(`  unparseable reply from ${res.model}`); continue; }
  for (const u of batch) {
    const qs = (obj[u.id] || [])
      .filter((q) => typeof q === 'string' && q.trim().endsWith('?') && q.length > 12 && q.length < 220)
      .slice(0, 5);
    if (qs.length) { cache[u.id] = { h: hash(u.title + u.body), q: qs }; done++; }
  }
  console.log(`  [${res.model}] req ${reqs}: ${done}/${pending.length} expanded`);
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 1));
}
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 1));
console.log(`done: ${done} generated, ${cachedN} already cached, ${failed} not expanded, ${reqs} API requests`);
console.log(`-> ${path.relative(root, cachePath)} (${Object.keys(cache).length} passages, ${(fs.statSync(cachePath).size / 1024).toFixed(0)} kB)`);
