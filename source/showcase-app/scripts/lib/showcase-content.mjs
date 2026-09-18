// The showcase page's own content as citable units: every product, slide, use case and memorandum passage.
//   scripts/export-corpus.mjs         -> knowledge/corpus/*.md, the documents graphify extracts a graph from
//   scripts/build-graphrag-index.mjs  -> app/data/graphrag-index.json, the chunks answers are grounded in
// so the graph and the answers can never be built from two different versions of the page.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import * as esbuild from 'esbuild';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const json = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// the memorandum is an HTML string inside TypeScript; esbuild strips the types
function reportHtml() {
  const out = esbuild.buildSync({entryPoints: [path.join(ROOT, 'app/report-content.ts')], bundle: true, format: 'cjs',
    platform: 'node', write: false, logLevel: 'warning'});
  const mod = {exports: {}};
  vm.runInNewContext(out.outputFiles[0].text, {module: mod, exports: mod.exports});
  return mod.exports.reportHtml;
}

const ENTITIES = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’',
  lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', middot: '·', times: '×', rarr: '→', larr: '←', sup2: '²',
  deg: '°', plusmn: '±', le: '≤', ge: '≥', asymp: '≈', minus: '−', trade: '™', reg: '®', copy: '©', bull: '•'};
export const text = html => html
  .replace(/<(script|style|svg|figure|video)[\s\S]*?<\/\1>/g, ' ')
  .replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&(\w+);/g, (m, e) => ENTITIES[e] ?? m)
  .replace(/\s+/g, ' ').trim();

// Memorandum chapters, with the ids the Investment view opens (page.tsx `chapters`).
export const CHAPTERS = [['summary', 'Executive summary'], ['business', 'Business'], ['technology', 'Technology'],
  ['usecases', 'Use cases'], ['choice', 'Strategy & economics'], ['numbers', 'Financials & risks']];

// Split a chapter into passages: one per block-level element, grouped under the nearest heading, and
// packed to ~1,400 characters so a passage is short enough to quote and long enough to stand alone.
function passages(html, chapter) {
  const out = [];
  let heading = CHAPTERS.find(c => c[0] === chapter)[1], buf = [], k = 0;
  const flush = () => {
    const body = buf.join(' ').trim();
    if (body.length > 80) out.push({id: `memo:${chapter}:${++k}`, kind: 'memo', title: heading, text: body,
      source: {kind: 'memo', chapter, heading}});
    buf = [];
  };
  const blocks = html.replace(/<(svg|figure|video)[\s\S]*?<\/\1>/g, ' ')
    .matchAll(/<(h[1-4]|p|li|dt|dd|tr|summary|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/g);
  for (const [, tag, inner] of blocks) {
    const t = tag === 'tr' ? text(inner.replace(/<\/t[dh]>/g, ' · </td>')).replace(/( · )+$/, '') : text(inner);
    if (!t) continue;
    if (/^h[1-4]$/.test(tag) && tag !== 'h4') { flush(); heading = t; continue; }
    if (buf.join(' ').length + t.length > 1400) flush();
    buf.push(tag === 'h4' || tag === 'dt' || tag === 'summary' ? `${t}:` : t);
  }
  flush();
  return out;
}

export function loadContent() {
  const products = json('app/products.json'), slides = json('app/slide-notes.json');
  const useCases = json('app/use-cases.json'), site = json('app/site-content.json');
  const html = reportHtml();

  const units = [];
  for (const p of products) units.push({id: `product:${p.id}`, kind: 'product', title: p.name, source: {kind: 'product', productId: p.id, slide: p.slideNum},
    text: `${p.name} (${p.category}, ${p.segment}). ${p.description} Price ${p.price}. FY2032 revenue projection ${p.revenue}, ` +
      `${p.share} of the plan, gross margin ${p.margin}, first revenue ${p.firstRevenue}, volume ${p.units}. ` +
      `Role in the portfolio: ${p.role} From sensing to action: ${p.signalChain.join('; ')}. Key dependency: ${p.dependsOn}`});
  for (const u of useCases.cases) units.push({id: `usecase:${u.id}`, kind: 'usecase', title: `${u.id} ${u.title}`, source: {kind: 'usecase', useCase: u.id},
    text: [`${u.title}. Standard: ${u.standard}. Dates: ${u.dates}.`, `Challenge: ${u.challenge}`, `What Deepgrid supplies: ${u.supply}`,
      `Steps: ${[].concat(u.steps || []).join('; ')}.`, u.buyer && `Buyer: ${u.buyer}`, u.gate && `Gate: ${u.gate}`, u.risk && `Risk: ${u.risk}`]
      .filter(Boolean).map(s => typeof s === 'string' ? s : JSON.stringify(s)).join(' ')});
  units.push({id: 'usecase:boundary', kind: 'usecase', title: 'What Deepgrid sells, and what it does not', source: {kind: 'usecase', useCase: ''},
    text: `${useCases.boundary} Capital is not for: ${useCases.capital}. Sequence: ${useCases.sequence.map(s => `${s.period}: ${s.action} (${s.owner})`).join('; ')}.`});
  for (const s of slides) units.push({id: `slide:${s.slide}`, kind: 'slide', title: `Slide ${s.slide} · ${s.title}`, source: {kind: 'slide', slide: s.slide},
    text: `${s.title}. ${s.body.replace(/\s+/g, ' ')} ${s.script}`.trim()});

  // summary = masthead + the "if you read nothing else" block; each other chapter is its own div
  const at = id => html.search(new RegExp(`<div[^>]*\\sid="${id}"`));
  const bounds = CHAPTERS.slice(1).map(([id]) => at(id));
  if (bounds.some(b => b < 0)) throw new Error('memorandum chapter anchor missing in app/report-content.ts');
  units.push(...passages(html.slice(0, bounds[0]), 'summary'));
  CHAPTERS.slice(1).forEach(([id], i) => units.push(...passages(html.slice(bounds[i], bounds[i + 1] ?? html.length), id)));

  return {products, slides, useCases, site, units};
}
