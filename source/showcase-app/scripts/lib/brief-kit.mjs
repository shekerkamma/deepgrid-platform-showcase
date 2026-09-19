// Shared by the scripts that write site copy from the GraphRAG index: the model route and the figure gate.
// (build-showcase-themes.mjs and build-product-briefs.mjs predate this module and carry their own copies.)
import {execSync} from 'node:child_process';

export const MODEL = process.env.THEME_MODEL || 'claude-sonnet-4-6';

// CLIProxyAPI on the Windows gateway, key read from ~/.dsh/.credentials.yaml at run time; never a free tier.
const GW = process.env.CLIPROXY_HOST || execSync("ip route show default | awk '{print $3}'").toString().trim();
const KEY = process.env.CLIPROXY_API_KEY || execSync(`python3 - <<'PY'
import yaml, pathlib
d = yaml.safe_load(pathlib.Path('~/.dsh/.credentials.yaml').expanduser().read_text())
def walk(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from walk(v, f'{p}/{k}')
    elif isinstance(o, str) and 'cliproxy' in p.lower(): yield o
print(next(walk(d), ''))
PY`).toString().trim();

export async function llm(messages, maxTokens = 4000) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const res = await fetch(`http://${GW}:8317/v1/chat/completions`, {method: 'POST',
      headers: {'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({model: MODEL, temperature: 0.2, max_tokens: maxTokens, messages})});
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.choices?.[0]?.message?.content) return body.choices[0].message.content;
    console.error(`  model call ${attempt} failed: ${res.status} ${JSON.stringify(body.error || body).slice(0, 160)}`);
    // a subscription route cools down under load and says for how long: wait that out rather than give up
    const reset = Number(body.error?.reset_seconds);
    await new Promise(r => setTimeout(r, Number.isFinite(reset) ? (reset + 3) * 1000 : 4000 * attempt));
  }
  throw new Error('model unavailable through CLIProxyAPI');
}

export {nums, supported} from './figures.mjs';
import {nums, supported} from './figures.mjs';
export const unsupported = (text, sourceText) => nums(text).filter(f => !supported(f, sourceText));

// Ask, gate, and retry with the failures named, until `done` accepts the result.
export async function write(messages, check, done, tries = 3) {
  let t = null, dropped = [];
  for (let n = 1; n <= tries; n++) {
    const raw = await llm(messages);
    try { t = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch { t = null; continue; }
    dropped = check(t);
    if (done(t)) return {t, dropped};
    messages.push({role: 'assistant', content: raw}, {role: 'user', content:
      `These statements carry figures that do not appear in the source text:\n- ${dropped.join('\n- ')}\n` +
      'Rewrite the whole JSON using only figures that appear verbatim in the source text.'});
  }
  return {t: null, dropped};
}

// visible copy uses no em dash (scripts/strip-em-dash.mjs)
export const noDash = s => s.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',').replace(/,\s*([.;:!?])/g, '$1');

// Words that assert maturity. The figure gate cannot see them, and a model reaches for them: "silicon-proven" for a
// block that is designed into a die not yet taped out. Each is allowed only if the source text uses it too.
const CLAIMS = [/silicon[- ]proven/i, /proven (?:on|in) silicon/i, /field[- ]proven/i, /production[- ]proven/i, /fielded/i,
  /\bvalidated\b/i, /\bcertified\b/i, /\bqualified\b/i, /deployed at scale/i, /in production\b/i];
export const overclaims = (text, sourceText) => CLAIMS.filter(re => re.test(text) && !re.test(sourceText)).map(re => text.match(re)[0]);

// Copy is about the product, never about the documents it was written from.
const META = /\b(slides?|narration|passages?|speaker notes|the deck|pricing deck|dossier)\b/i;
export const presentationTalk = text => (META.exec(text) || [])[0] || null;
