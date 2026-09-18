'use client';
// Ask DeepGrid (#briefing): the DG32 site's GraphRAG console over this showcase's own materials. Layout and
// classes follow the DG32 site (app/ask.css); the answers come from app/data/graphrag-engine.ts, and every
// source links back into this page: a slide, a product dossier, a memorandum chapter or a use case.
import {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, BookOpen, Download, FileText, LayoutGrid, Maximize2, Network, Search, ShieldCheck, X} from 'lucide-react';
import {SectionHead} from './detail';
import products from './products.json';
import {themes} from './data/themes';
import {executeGraphRAG, graphStats, type Passage, type SemanticScores} from './data/graphrag-engine';
import {getSemantic} from './data/semantic';

type Product = typeof products[number];
const CHAPTER_TITLES: Record<string, string> = {summary: 'Executive summary', business: 'Business', technology: 'Technology',
  usecases: 'Use cases', choice: 'Strategy & economics', numbers: 'Financials & risks'};

// Semantic scores for the question on screen, once the in-browser model has them. Loading starts when
// Ask opens; each question is embedded 250 ms after typing pauses. Until then, or if the model cannot
// load, this is null and the engine ranks by TF-IDF.
function useSemanticScores(question: string): SemanticScores | null {
  const [state, setState] = useState<{q: string; s: SemanticScores} | null>(null);
  useEffect(() => { void getSemantic(); }, []);
  useEffect(() => {
    if (question.trim().length < 3) return;
    let live = true;
    const t = setTimeout(async () => {
      const sem = await getSemantic();
      if (!sem || !live) return;
      try { const s = await sem.scores(question); if (live) setState({q: question, s}); } catch { /* stay on TF-IDF */ }
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [question]);
  return state && state.q === question ? state.s : null;
}

type Props = {
  onProduct: (p: Product) => void;
  onSlide: (n: number) => void;
  go: (hash: string) => void;
  productImage: (p: Product) => string;
};

export default function AskDeepGrid({onProduct, onSlide, go, productImage}: Props) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'answers' | 'graph' | 'dossiers'>('answers');
  const question = query.trim() || themes[0].ask;
  const sem = useSemanticScores(question);
  const result = executeGraphRAG(question, products, sem);
  const frame = useRef<HTMLIFrameElement | null>(null);
  const focusGraph = (label: string) => frame.current?.contentWindow?.postMessage({search: label}, '*');

  // where a passage came from, and the place on this page that shows it
  const open = (p: Passage): {label: string; where: string; act?: () => void} => {
    const s = p.source;
    if (s.kind === 'slide') return {label: `Open slide ${s.slide}`, where: `104-slide deck · slide ${s.slide}`, act: () => onSlide(s.slide!)};
    if (s.kind === 'product') {
      const prod = products.find(x => x.id === s.productId)!;
      return {label: 'Open product dossier', where: `Product dossier · source slide ${prod.slideNum}`, act: () => onProduct(prod)};
    }
    if (s.kind === 'usecase') return {label: 'Open use case', where: `Use cases${s.useCase ? ' · ' + s.useCase : ''}`,
      act: () => go(`investment?chapter=usecases${s.useCase ? '&usecase=' + s.useCase : ''}`)};
    if (s.kind === 'memo') return {label: 'Read in the memorandum', where: `Investment memorandum · ${CHAPTER_TITLES[s.chapter!] || s.chapter}`,
      act: () => go(`investment?chapter=${s.chapter}`)};
    return {label: '', where: s.label || 'Source document'};
  };

  const cards = result.products.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const graphSrc = `./knowledge/graph.html${result.focus ? `?search=${encodeURIComponent(result.focus)}` : ''}`;
  // the embedded graph loads once, centred on the answer on screen; later answers re-centre it by message
  const [frameSrc] = useState(graphSrc);
  useEffect(() => { if (view === 'graph' && result.focus) focusGraph(result.focus); }, [view, result.focus]);

  return (
    <section className="page-wrap dr-ask-section">
      <SectionHead tag="04 / ASK DEEPGRID" title="Ask DeepGrid"
        copy="Ask about the products, the silicon, the round or the risks. Answers quote the DeepGrid materials — the deck, the product dossiers, the investment memorandum and its sources — and link to where each passage lives."/>

      <div className="dr-ask-top-bar">
        <div className="dr-ask-view-toggle">
          <button className={`dr-ask-toggle-btn ${view === 'answers' ? 'active' : ''}`} onClick={() => setView('answers')}>
            <BookOpen size={16}/> <span>Grounded answers</span>
          </button>
          <button className={`dr-ask-toggle-btn ${view === 'graph' ? 'active' : ''}`} onClick={() => setView('graph')}>
            <Network size={16}/> <span>Knowledge graph</span>
          </button>
          <button className={`dr-ask-toggle-btn ${view === 'dossiers' ? 'active' : ''}`} onClick={() => setView('dossiers')}>
            <LayoutGrid size={16}/> <span>Product dossiers ({products.length})</span>
          </button>
        </div>
        <span className="dr-ask-badge-verified"><ShieldCheck size={14}/> QUOTED FROM SOURCE</span>
      </div>

      {view !== 'dossiers' && (
        <div className="dr-ask-bar" style={{marginBottom: '18px'}}>
          <form className="dr-ask-input-wrap" onSubmit={e => e.preventDefault()}>
            <Search className="dr-ask-search-icon" size={20}/>
            <input type="search" name="deepgrid-question" autoComplete="off" className="dr-ask-input" value={query} maxLength={300}
              onChange={e => setQuery(e.target.value)} aria-label="Ask a question about DeepGrid"
              placeholder="Ask about a product, the SoC2 silicon, the round, the regulation or the risks…"/>
            {query && <button type="button" className="dr-ask-clear" onClick={() => setQuery('')} aria-label="Clear question"><X size={18}/></button>}
          </form>
          <div className="dr-ask-prompts" style={{marginTop: '10px'}} aria-label="Suggested questions">
            {themes.map(t => (
              <button key={t.title} className={`dr-ask-chip ${question === t.ask ? 'active' : ''}`} onClick={() => setQuery(t.ask)}>
                <span className="dr-ask-chip-doc">{t.tag.split(' ').find(w => w !== 'THE')}</span><span className="dr-ask-chip-text">{t.ask}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'answers' && (
        <div className="dr-grounded-answer-wrap" data-semantic={sem ? 'on' : 'off'} aria-live="polite">
          <article className="dr-answer-card">
            <div className="dr-answer-header">
              <div className="dr-answer-badge"><span className="dr-bullet-pulse"/><span className="mono dr-domain-tag">{result.tag}</span></div>
              {result.passages.length > 0 && <span className="dr-answer-source-ref">Quoted from {result.passages.length} source{result.passages.length > 1 ? 's' : ''}</span>}
            </div>
            <h2 className="dr-contextual-title">{result.title}</h2>
            <p className="dr-answer-lead">{result.answer}</p>

            {result.path.length > 0 && (
              <div className="dr-graphrag-path-card">
                <div className="dr-graphrag-path-head">
                  <span className="mono dr-graphrag-path-label">KNOWLEDGE GRAPH</span>
                  {result.seeds[0] && <span className="dr-graphrag-community">{result.seeds[0].community}</span>}
                </div>
                <div className="dr-graphrag-breadcrumbs">
                  {result.path.map((s, i) => (
                    <span className="dr-graphrag-step" key={i}>
                      <span className="dr-step-node">{s.source}</span><span className="dr-step-rel">— {s.relation} →</span><span className="dr-step-node">{s.target}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.facts.length > 0 && (
              <div className="dr-answer-facts">
                <span className="mono dr-facts-heading">FROM THE PRODUCT PLAN · MANAGEMENT PROJECTIONS</span>
                <ul className="dr-facts-list">{result.facts.map(f => <li key={f}><span className="dr-bullet-dot"/><span>{f}</span></li>)}</ul>
              </div>
            )}

            {result.passages.length > 0 && (
              <div className="dr-answer-references">
                <div className="dr-ref-header"><span className="mono dr-ref-title">SOURCES</span></div>
                {result.passages.map((p, i) => {
                  const o = open(p);
                  return (
                    <div className="dr-citation-card" key={p.id + i}>
                      <div className="dr-citation-content">
                        <div className="dr-citation-icon-wrap"><FileText size={20} style={{color: 'var(--copper)'}}/></div>
                        <div className="dr-citation-meta">
                          <span className="mono dr-citation-tag">{i === 0 ? 'PRIMARY SOURCE' : 'SUPPORTING SOURCE'} · {o.where}</span>
                          <strong className="dr-citation-title">{p.title}</strong>
                          <span className="dr-citation-quote">{p.text}</span>
                        </div>
                      </div>
                      {o.act && <div className="dr-citation-actions">
                        <button type="button" className={`dr-citation-btn ${i === 0 ? 'primary' : 'outline'}`} onClick={o.act}>{o.label} <ArrowUpRight size={14}/></button>
                      </div>}
                    </div>
                  );
                })}
              </div>
            )}

            {cards.length > 0 && (
              <div className="dr-ask-products">
                {cards.map(p => (
                  <button key={p.id} className="mini-product" onClick={() => onProduct(p)}>
                    <img src={productImage(p)} alt={p.name}/><span>{p.name} · product dossier<ArrowUpRight size={16}/></span>
                  </button>
                ))}
              </div>
            )}
            {result.kind === 'none' && <button className="text-link" onClick={() => go('portfolio')}>Browse all products <ArrowUpRight size={16}/></button>}
          </article>

          <div className="dr-related-wrap">
            <span className="mono dr-related-heading">RELATED QUESTIONS</span>
            <div className="dr-related-chips">
              {result.related.map(t => <button key={t.label} type="button" className="dr-related-chip" onClick={() => setQuery(t.query)}>{t.label}</button>)}
            </div>
          </div>
          <p className="disclaimer">Quoted from DeepGrid’s own materials; not independent verification. Financial values are management projections.</p>
        </div>
      )}

      {view === 'graph' && (
        <div className="dr-graphify-embed-container">
          <div className="dr-graphify-embed-header">
            <div className="dr-graphify-header-left">
              <div className="dr-graphify-title">
                <Network size={18} style={{color: 'var(--copper)'}}/><span>DEEPGRID KNOWLEDGE GRAPH</span>
                <span className="dr-graphify-badge">{graphStats.nodes} NODES · {graphStats.edges} EDGES · {graphStats.communities} COMMUNITIES</span>
              </div>
              <p className="dr-graphify-subtitle">Extracted by graphify from the deck, the fifteen product dossiers, the use cases, the investment memorandum, the Information Memorandum and the research behind it.</p>
            </div>
            <div className="dr-graphify-header-right">
              <a href={graphSrc} target="_blank" rel="noreferrer" className="dr-graphify-btn outline"><Maximize2 size={13}/> Fullscreen</a>
              <a href="./knowledge/graph.json" download="deepgrid-showcase-graph.json" className="dr-graphify-btn outline"><Download size={13}/> Graph JSON</a>
              <a href="./knowledge/GRAPH_REPORT.md" target="_blank" rel="noreferrer" className="dr-graphify-btn primary"><FileText size={13}/> Graph report</a>
            </div>
          </div>
          <div className="dr-graphify-focus-strip">
            <span className="dr-focus-label">FOCUS:</span>
            <div className="dr-focus-chips">
              {[...new Set(themes.map(t => t.focus))].map(f => <button key={f} type="button" className="dr-focus-chip" onClick={() => focusGraph(f)}>{f}</button>)}
            </div>
          </div>
          <div className="dr-graphify-frame-wrap">
            <iframe ref={frame} src={frameSrc} title="DeepGrid knowledge graph" className="dr-graphify-iframe" loading="lazy"/>
          </div>
        </div>
      )}

      {view === 'dossiers' && (
        <div className="dr-ask-dossiers">
          {products.map(p => (
            <button key={p.id} className="dr-ask-dossier" onClick={() => onProduct(p)}>
              <img src={productImage(p)} alt="" loading="lazy"/>
              <span className="mono">{p.category.toUpperCase()} · SLIDE {p.slideNum}</span>
              <strong>{p.name}</strong>
              <span>{p.description}</span>
              <span className="mono">{p.price} · {p.revenue} FY2032</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
