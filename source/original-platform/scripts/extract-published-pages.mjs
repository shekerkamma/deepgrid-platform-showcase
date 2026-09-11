/**
 * Extracts passages from the sibling DeepGrid pages published on this site.
 *
 * Primary path is Exa livecrawl. A crawler does not care whether a page is
 * "internal" or "external" -- it is a URL -- and livecrawl executes the page's
 * JS, so it reads the React builds that a raw HTML parse cannot. It replaced a
 * Playwright rig that drove nine button clicks to read the briefing page and
 * still produced passages beginning mid-word.
 *
 * Playwright remains ONLY as the fallback, because livecrawl fails
 * consistently (HTTP 500 CRAWL_UNKNOWN_ERROR) on the 764 KB competitor
 * analysis -- 19x the size of the page it reads fine.
 *
 * Beacon.li is a different company's analysis and is deliberately excluded.
 *
 * Output: src/a2ui/data/published-pages.json, consumed by
 * build-knowledge-index.mjs, which drops near-duplicates against the corpus.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = process.env.PAGES_BASE || 'https://shekerkamma.github.io/content-ideas';
const KEY = process.env.EXA_API_KEY;
const CHROME = process.env.DESIGN_TOKENS_CHROMIUM
  || '/home/sheke/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

const PAGES = [
  { slug: 'deepgrid-semi-competitor-analysis', label: 'DeepGrid Semi competitor analysis', kind: 'Competitor' },
  { slug: 'deepgrid-briefing', label: 'DeepGrid briefing agent', kind: 'Competitor' },
];

const MIN = 180, MAX = 1500;

/** Exa livecrawl. Returns page text, or null when the crawl errors. */
async function livecrawl(url) {
  if (!KEY) { console.error('  EXA_API_KEY unset, skipping livecrawl'); return null; }
  const res = await fetch('https://api.exa.ai/contents', {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: [url], text: true, livecrawl: 'always' }),
  });
  if (!res.ok) { console.error(`  livecrawl HTTP ${res.status}`); return null; }
  const j = await res.json();
  const r = (j.results || [])[0];
  if (!r || !r.text) {
    console.error(`  livecrawl failed: ${(j.statuses || [])[0]?.error?.tag || 'no result'}`);
    return null;
  }
  return r.text;
}

/** Blank-line blocks, with short unpunctuated lines acting as headings. */
function chunkText(text) {
  const blocks = text
    // the briefing page prints its own A2UI JSON payload; that is markup, not knowledge
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((b) => b.replace(/\s+/g, ' ').trim())
    .filter((b) => b.length > 2);
  const isHeading = (b) => b.length <= 110 && !/[.!?]$/.test(b);
  // A run of UI labels concatenated with no separating space ("What is the
  // verdict?Show the threat x arena heatmap...") is the page's own prompt
  // rail, not knowledge. Sentences put a space after their punctuation.
  const isLabelRun = (b) => (b.match(/[?!][A-Z]/g) || []).length >= 2;
  const out = [];
  let title = '', buf = '';
  const flush = () => {
    if (buf.length >= MIN && !isLabelRun(buf)) out.push({ title: (title || buf.slice(0, 80)).slice(0, 160), body: buf.slice(0, MAX) });
    buf = '';
  };
  for (const b of blocks) {
    if (isHeading(b)) {
      if (buf.length >= MIN) { flush(); title = b; }
      else title = title ? `${title} · ${b}` : b;
    } else {
      buf = buf ? `${buf} ${b}` : b;
      if (buf.length >= MAX) flush();
    }
  }
  flush();
  return out;
}

/** Fallback: render in a browser and read sections off the DOM. */
async function rendered(url) {
  const { chromium } = await import('/home/sheke/content-ideas/node_modules/playwright-core/index.mjs');
  const browser = await chromium.launch({ executablePath: CHROME });
  const p = await browser.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const sections = await p.evaluate(() => {
    const blocks = [];
    let title = document.title || '';
    for (const el of document.body.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,div,section,figcaption')) {
      if (el.querySelector('p,li,td,h1,h2,h3,h4,h5,h6')) continue;  // leaf-ish only
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (!t || t.length < 3) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize) || 16;
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const heading = /^H[1-6]$/.test(el.tagName)
        || (t.length <= 120 && el.children.length <= 2 && (size >= 21 || (weight >= 600 && size >= 15)));
      if (heading) { title = t; blocks.push({ heading: t, text: '' }); }
      else if (blocks.length) blocks[blocks.length - 1].text += (blocks[blocks.length - 1].text ? ' ' : '') + t;
      else blocks.push({ heading: title, text: t });
    }
    return blocks;
  });
  await browser.close();

  const out = [];
  let buf = null;
  const flush = () => { if (buf && buf.text.length >= MIN) out.push({ title: buf.heading.slice(0, 160), body: buf.text.slice(0, MAX) }); buf = null; };
  for (const s of sections) {
    if (!buf) { buf = { heading: s.heading, text: s.text }; continue; }
    if (buf.text.length < MIN) buf.text += (buf.text ? ' ' : '') + (s.heading !== buf.heading ? `${s.heading} ` : '') + s.text;
    else { flush(); buf = { heading: s.heading, text: s.text }; }
  }
  flush();
  return out;
}

const out = [];
for (const page of PAGES) {
  const url = `${SITE}/${page.slug}/`;
  let via = 'livecrawl';
  const text = await livecrawl(url);
  let passages = text ? chunkText(text) : [];
  if (!passages.length) { via = 'rendered (livecrawl fallback)'; passages = await rendered(url); }
  for (const [i, u] of passages.entries()) {
    out.push({ id: `${page.slug}-${i}`, source: page.label, slug: page.slug, kind: page.kind, title: u.title, body: u.body });
  }
  console.error(`${page.slug.padEnd(36)} ${String(passages.length).padStart(3)} passages  via ${via}`);
}

const dest = path.join(root, 'src/a2ui/data/published-pages.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 1));
console.error(`\nwrote ${dest}  (${out.length} passages, ${(fs.statSync(dest).size / 1024).toFixed(0)} KB)`);
