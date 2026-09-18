// Ask DeepGrid's GraphRAG engine for the showcase: the DG32 site's pattern over this page's content.
//   1. graph: graphify's entity graph over the products, deck, use cases and memorandum, resolved onto
//      the fifteen products and SoC2 (scripts/build-graphrag-index.mjs)
//   2. entry: the question is matched to graph nodes and passages by in-browser embeddings
//      (semantic.ts), or by TF-IDF until the model loads or if it cannot
//   3. traversal: the seed entity's typed edges, and the passages that mention it or its neighbours
//   4. grounding: every sentence shown is quoted from a passage, each linked to its slide, product
//      dossier, use case or memorandum chapter
// No server, no key, no generated prose.
import indexRaw from './graphrag-index.json';
import {themes, type Theme} from './themes';
import {THEME_EXAMPLES} from './theme-examples';

export type Source = {kind: 'product' | 'slide' | 'memo' | 'usecase' | 'document'; productId?: string; slide?: number; chapter?: string; heading?: string; useCase?: string;
  /** source documents: where the passage comes from, e.g. "DeepGrid Semi — Confidential Information Memorandum (June 2026) · p. 5" */
  label?: string; docKind?: string};
export interface Passage {id: string; title: string; text: string; source: Source}
export interface Seed {id: string; name: string; kind: string; community: string; productId?: string}
export interface AskResult {
  query: string;
  kind: 'theme' | 'product' | 'slide' | 'search' | 'none';
  /** the curated theme reached, if any: what the routing eval scores */
  theme: string | null;
  tag: string;
  title: string;
  answer: string;
  passages: Passage[];
  facts: string[];
  seeds: Seed[];
  path: {source: string; relation: string; target: string}[];
  focus: string;
  products: string[];
  slide?: number;
  related: {label: string; query: string}[];
}

interface IndexNode extends Seed {description: string; aliases: string[]; mentions: number[]; vector: Record<string, number>}
interface IndexChunk extends Passage {kind: string; keys: string[]; noise?: number; vector: Record<string, number>}
interface GraphIndex {
  graph: {nodes: number; edges: number; communities: number};
  nodes: IndexNode[]; edges: {from: string; to: string; label: string; confidence: string; weight: number}[];
  chunks: IndexChunk[]; vocab: string[]; idf: number[];
}
const index = indexRaw as unknown as GraphIndex;
export const graphStats = index.graph;
const vocab = new Map(index.vocab.map((w, i) => [w, i]));
const nodeById = new Map(index.nodes.map(n => [n.id, n]));
const chunkById = new Map(index.chunks.map(c => [c.id, c]));

export interface SemanticScores {
  nodes: Float32Array; chunks: Float32Array; themes: Float32Array;
  // picked by the routing eval when the index was built (scripts/ask-routing-eval.json)
  themeMin?: number; themeGap?: number; themeLift?: number; floor?: number;
}
// fallbacks only: `npm run build:semantic` picks these from the routing eval and the index carries them
export const SEMANTIC_THEME_MIN = 0.6;
export const SEMANTIC_THEME_GAP = 0.04;
export const SEMANTIC_LIFT = 0.02;
export const SEMANTIC_FLOOR = 0.5;
/** share of the TF-IDF score added to the embedding score when ranking passages */
export const HYBRID_TFIDF = 0.3;
const TFIDF_FLOOR = 0.08;

/** The row order the semantic index must match; build and browser both hash it (see semantic.ts). */
export function semanticRowKey(): string {
  return [index.nodes.map(n => n.id).join('\n'), index.chunks.map(c => c.id).join('\n'),
    themes.map(t => `${t.title}|${t.sections.join('|')}`).join('\n'),
    themes.map(t => (THEME_EXAMPLES[t.title] || []).join('\n')).join('\n~\n')].join('\n--\n');
}
/** The text each theme is embedded as: its title, the passage it leads with, and its keywords. */
export const themeText = (t: Theme) => `${t.title}. ${themePassages(t)[0]?.text.slice(0, 600) || ''} ${t.keywords.join(', ')}`;

function themePassages(t: Theme): IndexChunk[] {
  return t.sections.flatMap(h => index.chunks.filter(c => c.kind === 'memo' && c.title.startsWith(h)));
}
/** Every theme section must still exist in the memorandum; returns the ones that do not. */
export function missingThemeSections(): string[] {
  return themes.flatMap(t => t.sections.filter(h => !index.chunks.some(c => c.kind === 'memo' && c.title.startsWith(h))).map(h => `${t.title}: "${h}"`));
}

const tokens = (s: string) => s.toLowerCase().match(/[a-z0-9_]+/g)?.filter(w => w.length > 2) || [];
function vectorize(text: string): Map<number, number> {
  const v = new Map<number, number>();
  for (const w of tokens(text)) { const i = vocab.get(w); if (i !== undefined) v.set(i, (v.get(i) || 0) + 1); }
  let norm = 0; for (const [i, c] of v) { const x = c * index.idf[i]; v.set(i, x); norm += x * x; }
  norm = Math.sqrt(norm) || 1; for (const [i, x] of v) v.set(i, x / norm);
  return v;
}
const dot = (q: Map<number, number>, d: Record<string, number>) => { let s = 0; for (const [i, x] of q) s += x * (d[i] || 0); return s; };
const has = (q: string, kw: string) => new RegExp(`(^|[^a-z0-9])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(q);

// Quoting: whole sentences, so an excerpt never ends mid-claim. OCR and table text can run for pages with
// no sentence break; that is cut at a word and marked, rather than shown whole.
function sentences(text: string, max: number): string {
  // break only where punctuation is followed by a space: "Rs 1.7 Cr" and "5.2%" are not sentence ends
  const parts = text.split(/(?<=[.!?])\s+/).map(s => s + ' ');
  let out = '';
  for (const s of parts) { if (out && (out + s).length > max) break; out += s; }
  out = out.trim();
  return out.length <= max * 1.25 ? out : out.slice(0, max).replace(/\s+\S*$/, '') + ' …';
}
const clip = (t: string, n: number) => t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + ' …';
// A workbook passage is one row per line; lead with the rows that share the most words with the question.
function rowsFor(c: IndexChunk, q: string, n = 2): string | null {
  if (c.source.docKind !== 'Workbook') return null;
  // rows with figures only: a section heading ("A. PHASED TAPEOUT PROGRAM:") answers nothing
  const want = new Set(tokens(q)), rows = c.text.split('\n').filter(r => /\d/.test(r) && !r.trim().endsWith(':'));
  const scored = rows.map((r, i) => ({r, i, s: tokens(r.split(' — ')[0]).filter(w => want.has(w)).length * 2 + tokens(r).filter(w => want.has(w)).length}))
    .filter(x => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i).slice(0, n).sort((a, b) => a.i - b.i);
  return scored.length ? scored.map(x => x.r).join(' · ') : null;
}
const passage = (c: IndexChunk, max = 480): Passage => ({id: c.id, title: clip(c.title, 110), text: sentences(c.text, max), source: c.source});

function traverse(seed: IndexNode) {
  const path: AskResult['path'] = [], neighbours: IndexNode[] = [];
  for (const e of [...index.edges].sort((a, b) => b.weight - a.weight)) {
    if (e.from !== seed.id && e.to !== seed.id) continue;
    const other = nodeById.get(e.from === seed.id ? e.to : e.from);
    if (!other) continue;
    neighbours.push(other);
    if (path.length < 4) path.push({source: nodeById.get(e.from)!.name, relation: e.label.replace(/_/g, ' '), target: nodeById.get(e.to)!.name});
  }
  return {path, neighbours};
}

const productFacts = (id: string, products: ProductLike[]) => {
  const p = products.find(x => x.id === id);
  return p ? [`Listed price ${p.price}`, `FY2032 revenue projection ${p.revenue} (${p.share} of plan)`, `Gross margin ${p.margin}`,
    `First revenue ${p.firstRevenue}`, `Volume plan ${p.units}`] : [];
};
export type ProductLike = {id: string; name: string; price: string; revenue: string; share: string; margin: string; firstRevenue: string; units: string; slideNum: number};

const related = (except: string | null) => themes.filter(t => t.title !== except).slice(0, 5).map(t => ({label: t.title, query: t.ask}));

export function executeGraphRAG(raw: string, products: ProductLike[], sem?: SemanticScores | null): AskResult {
  const q = raw.trim().toLowerCase();
  const qv = vectorize(q);
  const useSem = !!sem && sem.nodes.length === index.nodes.length && sem.chunks.length === index.chunks.length && sem.themes.length === themes.length;
  const base = {query: raw, facts: [] as string[], products: [] as string[], related: related(null)};

  // 1. "slide 19": the deck page itself
  const sm = q.match(/\bslide\s+(\d{1,3})\b/);
  if (sm && +sm[1] >= 1 && +sm[1] <= 104) {
    const c = chunkById.get(`slide:${+sm[1]}`)!;
    return {...base, kind: 'slide', theme: null, tag: 'SLIDE DECK', title: c.title, answer: sentences(c.text, 900), passages: [passage(c)],
      seeds: [], path: [], focus: '', slide: +sm[1], products: products.filter(p => p.slideNum === +sm[1]).map(p => p.id)};
  }

  // 2. graph entry: every node scored; named products are found by alias before any similarity
  const nodeScore = index.nodes.map((n, i) => useSem ? Math.max(0, sem!.nodes[i]) : dot(qv, n.vector));
  const named = index.nodes.filter(n => n.kind === 'product' || n.kind === 'platform')
    .map(n => ({n, len: Math.max(0, ...n.aliases.filter(a => has(q, a)).map(a => a.length))})).filter(x => x.len > 0).sort((a, b) => b.len - a.len);
  const ranked = index.nodes.map((n, i) => ({n, s: nodeScore[i]})).sort((a, b) => b.s - a.s);
  const seedNode = named[0]?.n || ranked[0].n;
  const {path, neighbours} = traverse(seedNode);
  const seeds: Seed[] = [seedNode, ...ranked.map(r => r.n).filter(n => n !== seedNode)].slice(0, 3)
    .map(({id, name, kind, community, productId}) => ({id, name, kind, community, productId}));

  // 3. grounding: passages by similarity, lifted when they mention the seed or its neighbours
  const seedMentions = new Set(seedNode.mentions), nearMentions = new Set(neighbours.flatMap(n => n.mentions));
  const chunkSim = index.chunks.map((c, i) => useSem ? Math.max(0, sem!.chunks[i]) : dot(qv, c.vector));
  // ranking is hybrid: embeddings blur exact terms ("EBITDA", "CGTMSE"), so a share of the TF-IDF match is
  // added. The relevance floor and the theme test below stay on the embedding score alone.
  const rankSim = index.chunks.map((c, i) => useSem ? chunkSim[i] + HYBRID_TFIDF * dot(qv, c.vector) : chunkSim[i]);
  // OCR-garbled passages (noise = % of garbage characters, measured by the source index) rank below clean ones
  const chunkRank = index.chunks.map((c, i) => ({c, s: rankSim[i] + (seedMentions.has(i) ? 0.06 : 0) + (nearMentions.has(i) ? 0.02 : 0) - Math.min(0.08, (c.noise || 0) / 500)}))
    .sort((a, b) => b.s - a.s);

  // 4a. a curated theme: by keyword, or by meaning when the question clearly sits closest to one
  // Keywords pick a theme only without embeddings (TF-IDF fallback). With them, keywords are ignored:
  // "EBITDA in FY2032" names two revenue-ramp keywords, scores 0.690 on that theme and 0.691 on the P&L row,
  // and the row is the answer. Measured 18 Sep 2026: even a +0.04 keyword nudge forced it into the essay.
  const kwScore = themes.map(t => t.keywords.reduce((acc, kw) => acc + (has(q, kw) ? 15 + kw.length : 0), 0));
  let theme: Theme | null = null, best = 0;
  if (!useSem) kwScore.forEach((s, i) => { if (s > best) { best = s; theme = themes[i]; } });
  // By meaning, a theme must be close, clearly closer than the runner-up, and closer than the best single
  // passage by a margin: otherwise the question is narrower than any curated answer, and that passage is
  // the better answer. An off-topic question (best passage under the floor) never reaches a theme.
  const floor = useSem ? (sem!.floor ?? SEMANTIC_FLOOR) : TFIDF_FLOOR;
  const bestChunk = Math.max(0, ...chunkSim);
  if (!named.length && useSem && bestChunk >= floor) {
    const order = Array.from(sem!.themes, (v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
    const min = sem!.themeMin ?? SEMANTIC_THEME_MIN, gap = sem!.themeGap ?? SEMANTIC_THEME_GAP, lift = sem!.themeLift ?? SEMANTIC_LIFT;
    if (order[0][0] >= min && order[0][0] - (order[1]?.[0] ?? 0) >= gap && order[0][0] >= bestChunk + lift) theme = themes[order[0][1]];
  }
  if (named.length && theme && !named.some(x => x.n.kind === 'platform')) theme = null;   // "AD2 revenue" is about AD2
  if (theme) {
    const own = themePassages(theme);
    const lead = own[0];
    const support = [...own.slice(1, 3), ...theme.slides.map(n => chunkById.get(`slide:${n}`)!)].filter(Boolean);
    return {...base, kind: 'theme', theme: theme.title, tag: theme.tag, title: theme.title,
      answer: sentences(lead.text, 520), passages: [passage(lead, 900), ...support.map(c => passage(c))].slice(0, 4),
      seeds, path, focus: theme.focus, products: theme.products, related: related(theme.title)};
  }

  // 4b. a named product: its dossier leads, then what the graph connects it to
  const namedProduct = named.find(x => x.n.kind === 'product')?.n;
  if (namedProduct) {
    const dossier = chunkById.get(`product:${namedProduct.productId}`)!;
    const support = chunkRank.filter(r => r.c.id !== dossier.id && seedMentions.has(index.chunks.indexOf(r.c))).slice(0, 3).map(r => passage(r.c));
    return {...base, kind: 'product', theme: null, tag: `PRODUCT · ${namedProduct.community.toUpperCase()}`, title: namedProduct.name,
      answer: sentences(dossier.text, 520), passages: [passage(dossier, 900), ...support], facts: productFacts(namedProduct.productId!, products),
      seeds, path, focus: namedProduct.name, products: [namedProduct.productId!]};
  }

  // 4c. anything else: the best-grounded passages, or an honest miss
  if (!chunkRank.length || bestChunk < floor) {
    return {...base, kind: 'none', theme: null, tag: 'NO GROUNDED ANSWER', title: 'No reliable source match',
      answer: 'Nothing in the DeepGrid materials answers this closely enough to quote. Try a product, the silicon, the round, or the risks.',
      passages: [], seeds: [], path: [], focus: ''};
  }
  const top = chunkRank.slice(0, 4).map(r => r.c);
  const productIds = [...new Set(top.flatMap(c => c.source.productId ? [c.source.productId] : [])
    .concat(seedNode.productId ? [seedNode.productId] : []))].slice(0, 3);
  return {...base, kind: 'search', theme: null, tag: (seedNode.community || 'DeepGrid').toUpperCase(), title: clip(top[0].title.replace(/^Slide \d+ · /, ''), 110),
    answer: rowsFor(top[0], q) || sentences(top[0].text, 520), passages: top.map(c => passage(c)), seeds, path, focus: seedNode.name, products: productIds,
    facts: productIds.slice(0, 1).flatMap(id => productFacts(id, products)).slice(0, 3)};
}
