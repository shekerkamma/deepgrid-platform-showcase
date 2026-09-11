/**
 * Embeds passages (and, with --queries, the evaluation questions) via
 * gemini-embedding-001. Resumable: every batch is cached to disk by content
 * hash, so a quota stop costs nothing already paid for.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!KEY) {
  console.error('GOOGLE_GENERATIVE_AI_API_KEY unset');
  process.exit(1);
}
const DIM = 256;
const BATCH = 25;
// free-tier embedding quota is a per-minute item cap, so batches are paced
const PACE_MS = 32000;
const cacheDir = path.join(root, '.embed-cache');
fs.mkdirSync(cacheDir, { recursive: true });

const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));
const gen = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/data/generated-questions.json'), 'utf8'));

const wantQueries = process.argv.includes('--queries');
// a deterministic sample estimates the ceiling to within a couple of points;
// the free-tier per-minute cap makes all 1,005 needlessly slow
const sampleArg = process.argv.find((a) => a.startsWith('--sample='));
const SAMPLE = sampleArg ? Number(sampleArg.split('=')[1]) : 0;
const items = wantQueries
  ? [...new Set(Object.values(gen).flatMap((e) => e.q))].map((q) => ({ key: 'q:' + q, text: q, type: 'RETRIEVAL_QUERY' }))
  : idx.units.map((u) => ({ key: 'p:' + u.id, text: `${u.title}\n${u.body}`.slice(0, 2000), type: 'RETRIEVAL_DOCUMENT' }));

if (SAMPLE && SAMPLE < items.length) {
  items.sort((a, b) => crypto.createHash('md5').update(a.key).digest('hex')
    .localeCompare(crypto.createHash('md5').update(b.key).digest('hex')));
  items.length = SAMPLE;
}

const out = {};
let done = 0;
let called = 0;

for (let i = 0; i < items.length; i += BATCH) {
  const slice = items.slice(i, i + BATCH);
  const h = crypto.createHash('md5').update(slice.map((s) => s.key + s.text).join(' ')).digest('hex');
  const cf = path.join(cacheDir, `${h}.json`);
  if (fs.existsSync(cf)) {
    Object.assign(out, JSON.parse(fs.readFileSync(cf, 'utf8')));
    done += slice.length;
    continue;
  }
  const body = {
    requests: slice.map((s) => ({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text: s.text }] },
      taskType: s.type,
      outputDimensionality: DIM,
    })),
  };
  let res;
  let attempt = 0;
  while (attempt < 5) {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (res.ok) break;
    const t = await res.text();
    if (res.status === 429 || res.status === 503) {
      attempt++;
      await new Promise((r) => setTimeout(r, 45000 * attempt));
      continue;
    }
    console.error(`HTTP ${res.status}: ${t.slice(0, 300)}`);
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`exhausted retries at item ${i}`);
    break;
  }
  const j = await res.json();
  const chunk = {};
  // int8 quantisation: gemini vectors sit well inside +/-0.12 at 256 dims
  j.embeddings.forEach((e, k) => {
    chunk[slice[k].key] = e.values.map((v) => Math.max(-127, Math.min(127, Math.round((v * 127) / 0.12))));
  });
  fs.writeFileSync(cf, JSON.stringify(chunk));
  Object.assign(out, chunk);
  done += slice.length;
  called++;
  console.error(`embedded ${done}/${items.length} (${called} api calls)`);
  if (i + BATCH < items.length) await new Promise((r) => setTimeout(r, PACE_MS));
}

const dest = path.join(root, wantQueries ? '.embed-queries.json' : 'src/a2ui/generated/passage-vectors.json');
fs.writeFileSync(dest, JSON.stringify({ dim: DIM, scale: 0.12 / 127, v: out }));
console.error(`wrote ${dest}  (${Object.keys(out).length} vectors)`);
