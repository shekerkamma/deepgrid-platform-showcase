/**
 * Local stand-in for embed-worker.js. Same request/response contract, so the
 * client hybrid path can be tested end to end before anything is deployed.
 *
 *   GEMINI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY node proxy/dev-server.mjs
 */
import http from 'node:http';

const MODEL = 'gemini-embedding-001';
const DIM = 256;
const PORT = Number(process.env.PORT || 8790);
const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY unset'); process.exit(1); }

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
});

http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  if (req.method === 'OPTIONS') { res.writeHead(204, cors(origin)); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405, cors(origin)); return res.end('{"error":"POST only"}'); }

  let raw = '';
  for await (const c of req) raw += c;
  let q = '';
  try { q = String(JSON.parse(raw).q || '').slice(0, 400).trim(); } catch { /* handled below */ }
  const head = { ...cors(origin), 'Content-Type': 'application/json' };
  if (!q) { res.writeHead(400, head); return res.end('{"error":"empty query"}'); }

  try {
    const up = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent?key=${KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${MODEL}`,
          content: { parts: [{ text: q }] },
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: DIM,
        }) },
    );
    if (!up.ok) { res.writeHead(502, head); return res.end(JSON.stringify({ error: 'upstream', status: up.status })); }
    const j = await up.json();
    const v = j?.embedding?.values;
    if (!Array.isArray(v)) { res.writeHead(502, head); return res.end('{"error":"no embedding"}'); }
    res.writeHead(200, head);
    res.end(JSON.stringify({ v }));
  } catch (e) {
    res.writeHead(502, head);
    res.end(JSON.stringify({ error: String(e).slice(0, 120) }));
  }
}).listen(PORT, () => console.error(`embed proxy (dev) on http://localhost:${PORT}`));
