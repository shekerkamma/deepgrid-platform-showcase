/**
 * Reranking endpoint, local. Spawns the Claude CLI, so it stores NO credential
 * -- it authenticates against the user's own session, the same pattern
 * scripts/claude_code_bridge.py uses.
 *
 * Contract (identical to proxy/rerank-worker.js, so the client cannot tell
 * which is serving):
 *   POST { q: string, candidates: [{ title, excerpt }] }  ->  { pick: 0..n }
 *   pick 0 = none of the candidates answers the question (relevance veto).
 *
 * Why rerank rather than embed: measured on the leave-one-out benchmark, the
 * right passage is in the shown four 66.7% of the time but ranks first only
 * 33.3%. Reranking those four lifted rank-1 to 46.7% (+13.4); a Gemini
 * embedding hybrid was worth +4.0 for 658 kB of shipped vectors.
 *
 *   node proxy/rerank-dev-server.mjs
 */
import http from 'node:http';
import { execFile } from 'node:child_process';

const PORT = Number(process.env.PORT || 8791);
const MODEL = process.env.RERANK_MODEL || 'claude-sonnet-5';
const TIMEOUT_MS = 25000;

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
});

const ask = (prompt) => new Promise((resolve) => {
  const p = execFile('claude', ['-p', '--model', MODEL],
    { maxBuffer: 1 << 22, timeout: TIMEOUT_MS },
    (err, stdout) => resolve(err ? '' : stdout));
  // `claude -p` reads stdin when it is not a TTY; passing the prompt as argv
  // and leaving stdin open makes it hang for the whole timeout with no output.
  p.stdin.end(prompt);
});

http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const head = { ...cors(origin), 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors(origin)); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405, head); return res.end('{"error":"POST only"}'); }

  let raw = '';
  for await (const c of req) raw += c;
  let q = '', cands = [];
  try {
    const b = JSON.parse(raw);
    q = String(b.q || '').slice(0, 400).trim();
    cands = Array.isArray(b.candidates) ? b.candidates.slice(0, 8) : [];
  } catch { /* falls through to the guard below */ }
  if (!q || cands.length < 2) { res.writeHead(400, head); return res.end('{"error":"need q and 2+ candidates"}'); }

  const list = cands.map((c, i) =>
    `[${i + 1}] ${String(c.title || '').slice(0, 120)} — ${String(c.excerpt || '').replace(/\s+/g, ' ').slice(0, 320)}`
  ).join('\n');
  const prompt = `You are ranking retrieved passages from a DeepGrid Semi investor dossier.
Question: ${q}

${list}

Which ONE passage best answers the question? Reply with only its number.
If NONE of them answers the question -- if the question is about something this
investor dossier does not cover, such as sport, geography, cooking, weather, or
another company entirely -- reply with only 0.`;

  const out = await ask(prompt);
  // 0 is a deliberate verdict; an unparseable reply is not, and defaults to 1.
  const m = out.match(/\b([0-8])\b/);
  const pick = m ? Number(m[1]) : 1;
  res.writeHead(200, head);
  res.end(JSON.stringify({ pick: pick >= 0 && pick <= cands.length ? pick : 1 }));
}).listen(PORT, () => console.error(`rerank proxy (dev, Claude CLI) on http://localhost:${PORT}`));
