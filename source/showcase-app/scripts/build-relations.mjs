// The site's cross-references: app/data/relations.json. Every section item (a product line, a Silicon platform chapter,
// a demonstration film, a slide of the portfolio narrative, a chapter of the investment case, a use case) lists the
// items in other sections that are about the same thing, so a reader can move between them in both directions.
//
// Links are derived from what the content already cites, and every link is stored both ways:
//   - product briefs and stories: the slides, films, walkthrough moment, use cases and memorandum chapters they cite
//   - the Silicon platform story (app/data/tech-story.json): the slides each chapter was written from
//   - the deck's own sections: a product's slides run from its first slide (products.json slideNum) to the section end
//   - the image manifest: each slide's moment in the narrated walkthrough
//   - domains (app/shared.tsx): a product carried by a domain belongs to the Six domains chapter
//   - knowledge/relations-curated.json: the few links no data states, each with its reason
// Build gate: scripts/check-relations.mjs.
//   node scripts/build-relations.mjs
import fs from 'node:fs';

const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const products = read('app/products.json');
const briefs = read('app/data/product-briefs.json').products;
const stories = read('app/data/product-stories.json');
const tech = read('app/data/tech-story.json').chapters;
const notes = read('app/slide-notes.json');
const manifest = read('knowledge/image-manifest.json').images;
const curated = read('knowledge/relations-curated.json').links;
const filmsSrc = fs.readFileSync('app/views/films.tsx', 'utf8');
const shared = fs.readFileSync('app/shared.tsx', 'utf8');
const useCaseSrc = fs.readFileSync('app/use-cases.tsx', 'utf8');

const nodes = {}, edges = {};
const node = (key, label, hash, detail = '') => { nodes[key] = {label, hash, ...(detail ? {detail} : {})}; edges[key] ||= {}; };
const link = (a, b, why, t) => {
  if (a === b || !nodes[a] || !nodes[b]) throw new Error(`link ${a} -> ${b}: unknown item (${why})`);
  for (const [x, y] of [[a, b], [b, a]]) {
    const e = (edges[x][y] ||= {why: []});
    if (!e.why.includes(why)) e.why.push(why);
    if (t != null) e.t = t;
  }
};
const slideName = n => { const t = notes[n - 1].title; return t.includes(' · ') ? t.split(' · ').slice(1).join(' · ') : t; };

// items
for (const p of products) node('product:' + p.id, p.name, 'portfolio?product=' + p.id, p.category);
for (const c of tech) node('tech:' + c.id, c.kicker, 'silicon?chapter=' + c.id, c.headline);
const films = [...filmsSrc.matchAll(/id: '([a-z]+)',\s*title: '([^']+)',\s*sub: '([^']+)'/g)];
for (const [, id, title, sub] of films) node('film:' + id, title.replace(/’/g, '’'), 'film?v=' + id, sub);
for (let n = 1; n <= notes.length; n++) node('slide:' + n, `Slide ${n}: ${slideName(n)}`, 'slides?slide=' + n);
const memo = [['summary', 'Executive summary'], ['business', 'Business'], ['technology', 'Technology'], ['usecases', 'Use cases'],
  ['choice', 'Strategy and economics'], ['numbers', 'Financials and risks']];
for (const [id, label] of memo) node('memo:' + id, label, 'investment?chapter=' + id);
const ucTitles = [...useCaseSrc.matchAll(/\{title:'([^']+)'/g)].map(m => m[1]);
ucTitles.forEach((title, i) => { const id = `UC-0${i + 1}`; node('usecase:' + id, title, `investment?chapter=usecases&usecase=${id}`, id); });

// product lines: what their brief and story cite
const navKey = nav => {
  const [view, q = ''] = nav.split('?'), p = new URLSearchParams(q);
  if (view === 'slides' && p.get('slide')) return 'slide:' + p.get('slide');
  if (view === 'investment' && p.get('usecase')) return 'usecase:' + p.get('usecase');
  if (view === 'investment' && p.get('chapter')) return 'memo:' + p.get('chapter');
  if (view === 'portfolio' && p.get('product')) return 'product:' + p.get('product');
  return null;
};
for (const p of products) {
  const key = 'product:' + p.id, b = briefs[p.id], s = stories[p.id];
  for (const n of b?.slides || []) link(key, 'slide:' + n, 'the product brief cites it');
  for (const c of s?.chapters || []) for (const n of c.slides) link(key, 'slide:' + n, `the product story's ${c.title} chapter is told from it`);
  for (const src of b?.sources || []) { const k = navKey(src.nav || ''); if (k && k !== key && nodes[k]) link(key, k, 'the product brief cites it'); }
  for (const f of b?.films || []) link(key, 'film:' + f, 'the product page shows this film');
  if (b?.walkthrough != null) link(key, 'film:master', "the product's section of the narrated walkthrough", b.walkthrough);
}
// the deck's own sections: from a product's first slide to the next section boundary
const sectionOf = n => notes[n - 1].title.split(' · ')[0];
for (const p of products) {
  const sec = sectionOf(p.slideNum);
  for (let n = p.slideNum; n <= notes.length && sectionOf(n) === sec; n++) link('product:' + p.id, 'slide:' + n, `slide ${n} is in the ${sec} section of the portfolio narrative`);
}
// Silicon platform chapters: the slides they were written from, the memorandum chapters their passages sit in
for (const c of tech) {
  for (const n of c.slides) link('tech:' + c.id, 'slide:' + n, 'the chapter is written from it');
  for (const p of c.passages) { const k = navKey(p.nav || ''); if (k) link('tech:' + c.id, k, 'the chapter cites it'); }
}
// domains: a product carried by a domain is part of Six domains; the chipset carries every domain
for (const m of shared.matchAll(/carries: \[([^\]]*)\]/g))
  for (const id of m[1].match(/'([^']+)'/g).map(x => x.slice(1, -1))) link('tech:domains', 'product:' + id, 'the product runs on a domain of the die');
link('tech:silicon', 'product:chipset', 'the chipset is the die itself');
// a product whose story rests on the 8.6 ms frame budget is explained by Sensor to compute (the product page links there
// on the same rule, app/views/product.tsx)
for (const p of products) if (JSON.stringify(stories[p.id] || '').includes('8.6 ms')) link('product:' + p.id, 'tech:sensors', "the product's story rests on the 8.6 ms frame budget");
// part dividers of the portfolio narrative lead to the products in that part
const parts = notes.map((x, i) => [i + 1, x.title]).filter(([, t]) => /^Part [a-z]+, /.test(t)).map(([n]) => n);
parts.forEach((start, i) => {
  const end = parts[i + 1] ?? notes.length + 1;
  for (const p of products) if (p.slideNum > start && p.slideNum < end) link('slide:' + start, 'product:' + p.id, `slide ${start} opens the part of the portfolio narrative this product is in`);
});
// every use case is a section of the memorandum's use cases chapter
for (const k of Object.keys(nodes).filter(k => k.startsWith('usecase:'))) link(k, 'memo:usecases', 'the use case is part of this chapter');
// the walkthrough moment of every slide
for (const m of manifest) if (m.slide && m.t != null) link('slide:' + m.slide, 'film:master', 'the slide in the narrated walkthrough', m.t);
// curated
for (const [a, b, why] of curated) link(a, b, why);
// a silicon film carries its chapter's slides, so a slide explained by a film leads to it
for (const [key] of Object.entries(nodes).filter(([k]) => k.startsWith('film:') && k !== 'film:master'))
  for (const t of Object.keys(edges[key]).filter(k => k.startsWith('tech:')))
    for (const s of Object.keys(edges[t]).filter(k => k.startsWith('slide:')))
      link(key, s, `the film explains the ${nodes[t].label} chapter, which is written from this slide`);

const out = {nodes, edges: Object.fromEntries(Object.entries(edges).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([y, e]) => [y, e.t != null ? {t: e.t} : {}]))]))};
fs.writeFileSync('app/data/relations.json', JSON.stringify(out) + '\n');
fs.writeFileSync('knowledge/relations-why.json', JSON.stringify(Object.fromEntries(Object.entries(edges).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([y, e]) => [y, e.why]))])), null, 1) + '\n');
const n = Object.values(edges).reduce((s, v) => s + Object.keys(v).length, 0) / 2;
console.log(`relations: ${Object.keys(nodes).length} items, ${n} two-way links -> app/data/relations.json (reasons in knowledge/relations-why.json)`);
