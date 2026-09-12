/**
 * Reranking proxy. Cloudflare Worker.
 *
 * WHY THIS AND NOT THE EMBEDDING PROXY
 * The measured failure is not that retrieval misses the answer -- on the
 * leave-one-out benchmark the right passage is in the shown four 63.5% of the
 * time while ranking first only 33.0%. That 30-point gap is a ranking problem,
 * and a reranker reads the query against those four candidates and reorders
 * them. It ships no vectors: the embedding hybrid bought +4.0 points for 658 kB
 * of downloaded weights, the reranker buys far more for one request.
 *
 * WHY GEMINI AND NOT THE CLAUDE CLI
 * proxy/rerank-dev-server.mjs spawns `claude -p`, which stores no credential --
 * good for local work, but measured at 7.3-9.2s per call it cannot sit in front
 * of someone typing a question. gemini-2.5-flash with thinkingBudget 0 answers
 * the same prompt in ~1.0s. See scripts/eval-rerank.mjs for both numbers.
 *
 * CONTRACT (identical to proxy/rerank-dev-server.mjs, so the client cannot tell
 * which is serving):
 *   POST { q: string, candidates: [{ title, excerpt }] }  ->  { pick: 0..n }
 *
 * pick 0 means NONE of the candidates answers the question -- a relevance veto,
 * not a reordering. It exists because the client's lexical out-of-domain guard
 * cannot catch an off-topic question built entirely from words this corpus
 * contains: "capital city", "weather forecast", "stock market today", "what is
 * the share price". Those score above legitimate questions and share every term
 * with the index, so only a semantic judgement separates them.
 *
 * Failure is always a 200 with pick 1 where the request was well-formed: the
 * client's fallback is the lexical order it already has, so a dead reranker
 * degrades to today's behaviour rather than to an error. Note the asymmetry --
 * a broken reranker can never CAUSE a refusal, only fail to add one.
 *
 * DEPLOY
 *   npx wrangler deploy
 *   npx wrangler secret put GEMINI_API_KEY
 * then build with VITE_RERANK_ENDPOINT=<worker url>. Unset, the page makes no
 * agent-backend call at all.
 */

const MODEL = 'gemini-flash-lite-latest';
const MAX_QUERY_CHARS = 400;
const MAX_CANDIDATES = 8;
const MAX_EXCERPT_CHARS = 420;   // matches excerptFor() in scripts/eval-rerank.mjs
const UPSTREAM_TIMEOUT_MS = 6000;

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

const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').slice(0, n);

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

    let q = '', cands = [];
    try {
      const body = await request.json();
      q = clean(body.q, MAX_QUERY_CHARS).trim();
      cands = Array.isArray(body.candidates) ? body.candidates.slice(0, MAX_CANDIDATES) : [];
    } catch {
      return new Response('{"error":"bad json"}', { status: 400, headers });
    }
    if (!q || cands.length < 2) {
      return new Response('{"error":"need q and 2+ candidates"}', { status: 400, headers });
    }

    const list = cands.map((c, i) =>
      `[${i + 1}] ${clean(c.title, 120)} — ${clean(c.excerpt, MAX_EXCERPT_CHARS)}`).join('\n');
    const prompt = `You are ranking retrieved passages from a DeepGrid Semi investor dossier.
Question: ${q}

${list}

Which ONE passage best answers the question? Reply with only its number.
If NONE of them answers the question -- if the question is about something this
investor dossier does not cover, such as sport, geography, cooking, weather, or
another company entirely -- reply with only 0.`;

    let text = '';
    try {
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // flash-lite rejects thinkingConfig with a bare HTTP 400. On the
            // full flash models the opposite holds: WITHOUT thinkingBudget 0
            // the reasoning tokens eat the output budget and the reply comes
            // back an EMPTY STRING -- which reads as a refusal, not as a
            // configuration error. Keyed off the model name so swapping MODEL
            // cannot silently break one or the other.
            generationConfig: /lite/.test(MODEL)
              ? { maxOutputTokens: 64, temperature: 0 }
              : { maxOutputTokens: 64, temperature: 0, thinkingConfig: { thinkingBudget: 0 } },
          }),
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        },
      );
      // Never surface the upstream body: an error can echo the key in a URL.
      if (upstream.ok) {
        const j = await upstream.json();
        text = j?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    } catch { /* timeout or network -- falls through to pick 1 */ }

    // 0 is a deliberate verdict; an unparseable reply is not, and defaults to 1
    // so that a confused model cannot silently start refusing real questions.
    const m = text.match(/\b([0-8])\b/);
    const n = m ? Number(m[1]) : 1;
    return new Response(JSON.stringify({ pick: n >= 0 && n <= cands.length ? n : 1 }), { headers });
  },
};
