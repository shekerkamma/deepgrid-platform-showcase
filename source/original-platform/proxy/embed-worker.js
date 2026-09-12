/**
 * Query-embedding proxy. Cloudflare Worker.
 *
 * WHY THIS EXISTS
 * The briefing agent's index is static and its passages are embedded at build
 * time. The one thing a static page cannot do is embed the USER'S QUERY, which
 * needs an API key, and a key in a GitHub Pages bundle is a public key. This
 * worker holds the key instead and returns a vector.
 *
 * Measured value, on the same 300-query leave-one-out benchmark:
 *
 *   lexical only ............ r@1 31.3%   r@4 59.0%
 *   hybrid, real embeddings . r@1 35.3%   r@4 64.3%
 *
 * A derived in-browser encoder was tried first and rejected: it scored r@1
 * 31.0% -- no better than lexical -- because it was ridge-regressed FROM the
 * tf-idf features BM25 already uses, so its errors correlate with BM25's and
 * fusion gains nothing. Real embeddings are the only version that pays.
 *
 * DEPLOY
 *   npx wrangler deploy
 *   npx wrangler secret put GEMINI_API_KEY
 * then build the site with VITE_EMBED_PROXY=<worker url>. With that variable
 * unset the page never calls this and behaves exactly as it does today.
 */

const MODEL = 'gemini-embedding-001';
const DIM = 256;          // must match scripts/embed-corpus.mjs
const MAX_QUERY_CHARS = 400;

/** Only the site may call this. A key-holding endpoint open to the web is a
 *  key-holding endpoint being used by someone else. */
const ALLOWED_ORIGINS = new Set([
  'https://shekerkamma.github.io',
  'http://localhost:8899',
  'http://localhost:5173',
]);

function cors(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'null';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = { ...cors(origin), 'Content-Type': 'application/json' };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (request.method !== 'POST') return new Response('{"error":"POST only"}', { status: 405, headers });
    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response('{"error":"origin not allowed"}', { status: 403, headers });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response('{"error":"proxy not configured"}', { status: 503, headers });
    }

    let q = '';
    try {
      const body = await request.json();
      q = String(body.q || '').slice(0, MAX_QUERY_CHARS).trim();
    } catch {
      return new Response('{"error":"bad json"}', { status: 400, headers });
    }
    if (!q) return new Response('{"error":"empty query"}', { status: 400, headers });

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${MODEL}`,
          content: { parts: [{ text: q }] },
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: DIM,
        }),
      },
    );

    if (!upstream.ok) {
      // Never leak the upstream body: it can echo the key in an error URL.
      return new Response(JSON.stringify({ error: 'upstream', status: upstream.status }), {
        status: 502, headers,
      });
    }
    const j = await upstream.json();
    const values = j?.embedding?.values;
    if (!Array.isArray(values)) {
      return new Response('{"error":"no embedding"}', { status: 502, headers });
    }
    return new Response(JSON.stringify({ v: values }), {
      headers: { ...headers, 'Cache-Control': 'public, max-age=3600' },
    });
  },
};
