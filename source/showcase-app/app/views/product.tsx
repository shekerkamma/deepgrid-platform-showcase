'use client';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  MessageSquare,
  Play,
} from 'lucide-react';
import { products, productById, type Go, type Product } from '../shared';
import briefs from '../data/product-briefs.json';
import slideNotes from '../slide-notes.json';
import { films as filmList, master, Player, clock } from './films';

// One product, as an investor would read it: what it is used for first, then the product running (its films and
// its own slides), how it works, how it makes money, what has to go right, and every source behind the text.
// The text is written from the GraphRAG index by scripts/build-product-briefs.mjs and figure-gated there; the
// slide range, films, walkthrough time and related products are derived, not written.

type Brief = (typeof briefs.products)[keyof typeof briefs.products];
const slideFile = (n: number) => 'slide_' + String(n).padStart(2, '0');

export default function ProductPage({
  product: p,
  go,
  openSlide,
  back,
}: {
  product: Product;
  go: Go;
  openSlide: (n: number) => void;
  back: () => void;
}) {
  const b = (briefs.products as Record<string, Brief>)[p.id];
  const line = products.filter((x) => x.category === p.category),
    i = line.findIndex((x) => x.id === p.id),
    prev = line[i - 1],
    next = line[i + 1];
  const films = filmList.filter((f) =>
    (b?.films as string[] | undefined)?.includes(f.id),
  );
  const cite = (list: number[]) =>
    list.length ? (
      <sup className="cite">
        {list.map((n) => (
          <a key={n} href={'#src-' + n} aria-label={'Source ' + n}>
            {n}
          </a>
        ))}
      </sup>
    ) : null;

  return (
    <article className="page-wrap product-page">
      <nav className="product-crumbs" aria-label="Product">
        <button className="inline-link" onClick={back}>
          <ArrowLeft size={15} aria-hidden="true" /> All products
        </button>
        <span aria-hidden="true">/</span>
        <span>{p.category}</span>
      </nav>

      <header className="product-head">
        <p className="product-meta">
          {p.category}
          <span className="num">{p.id.toUpperCase()}</span>
        </p>
        <h1>{p.name}</h1>
        <p className="product-lead">{b?.lead || p.description}</p>
        <dl className="product-figures">
          {[
            ['Listed price', p.price],
            ['FY2032 revenue', p.revenue],
            ['Share of plan', p.share],
            ['Gross margin', p.margin],
            ['First revenue', p.firstRevenue],
            ['Volume plan', p.units],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className="num">{v}</dd>
            </div>
          ))}
        </dl>
        <nav className="product-jump" aria-label="On this page">
          {[
            ['pp-uses', 'Use cases'],
            ['pp-see', 'See it'],
            ['pp-how', 'How it works'],
            ['pp-sources', 'Sources'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={'#' + id}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ block: 'start' });
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      {b && (
        <section
          className="pp-block"
          id="pp-uses"
          aria-labelledby="pp-uses-title"
        >
          <h2 id="pp-uses-title">What it is used for</h2>
          <div className="pp-usecases">
            {b.useCases.map((u) => (
              <article key={u.title} className="pp-usecase">
                <h3>{u.title}</h3>
                <dl>
                  <div>
                    <dt>Buyer</dt>
                    <dd>{u.buyer}</dd>
                  </div>
                  <div>
                    <dt>The job</dt>
                    <dd>{u.problem}</dd>
                  </div>
                  <div>
                    <dt>What DeepGrid supplies</dt>
                    <dd>
                      {u.delivers}
                      {cite(u.sources)}
                    </dd>
                  </div>
                </dl>
                {u.detail && (
                  <a
                    className="text-link pp-usecase-more"
                    href={'#' + u.detail.nav}
                    onClick={(e) => {
                      e.preventDefault();
                      go(u.detail!.nav);
                    }}
                  >
                    Full use case {u.detail.id}: {u.detail.title}{' '}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="pp-block" id="pp-see" aria-labelledby="pp-see-title">
        <h2 id="pp-see-title">See it</h2>
        {films.length > 0 && (
          <div
            className={'pp-films' + (films.length === 1 ? ' is-single' : '')}
          >
            {films.map((f) => (
              <figure key={f.id}>
                <Player film={f} />
                <figcaption>
                  <strong>{f.title}</strong> {f.sub}
                  <span className="num"> · {f.length}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        {b?.walkthrough != null && (
          <a
            className="pp-walkthrough"
            href={`#film?v=master&t=${b.walkthrough}`}
            onClick={(e) => {
              e.preventDefault();
              go(`film?v=master&t=${b.walkthrough}`);
            }}
          >
            <span className="pp-walk-icon" aria-hidden="true">
              <Play size={16} fill="currentColor" />
            </span>
            <span>
              <strong>{p.name} in the narrated walkthrough</strong>
              <small>
                {master.title} Starts at{' '}
                <span className="num">{clock(b.walkthrough)}</span>
              </small>
            </span>
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        )}
        {b && b.slides.length > 0 && (
          <>
            <h3 className="pp-sub">
              Its {b.slides.length} slides in the portfolio deck
            </h3>
            <ol className="pp-slides">
              {b.slides.map((n) => (
                <li key={n}>
                  <button
                    onClick={() => openSlide(n)}
                    aria-label={`Open slide ${n}: ${slideNotes[n - 1].title}`}
                  >
                    <img
                      src={'./slides/thumbs/' + slideFile(n) + '.webp'}
                      alt=""
                      width={240}
                      height={134}
                      loading="lazy"
                    />
                    <span>
                      <span className="num">{n}</span>{' '}
                      {slideNotes[n - 1].title
                        .split(' · ')
                        .slice(1)
                        .join(' · ')}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      <section
        className="pp-block pp-brief"
        id="pp-how"
        aria-labelledby="pp-how-title"
      >
        <h2 id="pp-how-title" className="sr-only">
          How it works, why now and the economics
        </h2>
        <div className="pp-chain">
          <h3>From sensing to action</h3>
          <ol className="signal-chain">
            {p.signalChain.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        {b?.sections.map((s) => (
          <section key={s.label} className="pp-section">
            <h3>{s.label}</h3>
            <p>
              {s.text}
              {cite(s.sources)}
            </p>
          </section>
        ))}
        {b && (
          <ul className="pp-facts">
            {b.facts.map((f) => {
              const [label, ...rest] = f.text.split(': ');
              return (
                <li key={f.text}>
                  <strong>{rest.length ? label : ''}</strong>
                  <span>
                    {rest.length ? rest.join(': ') : f.text}
                    {cite(f.sources)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="dependency">
          <h3>Key dependency</h3>
          <p>{p.dependsOn}</p>
        </div>
      </section>

      <section
        className="pp-block"
        id="pp-sources"
        aria-labelledby="pp-src-title"
      >
        <h2 id="pp-src-title">Sources and further reading</h2>
        {b && (
          <ol className="pp-sources">
            {b.sources.map((s, n) => (
              <li key={s.id} id={'src-' + (n + 1)}>
                <span className="num pp-src-n">{n + 1}</span>
                <span className="pp-src-body">
                  <strong>{s.doc}</strong>
                  <small>
                    {s.section}
                    {s.page &&
                    !s.section.toLowerCase().startsWith(s.page.toLowerCase())
                      ? ` · ${s.page}`
                      : ''}
                  </small>
                </span>
                <span className="pp-src-links">
                  {s.nav && !s.nav.startsWith('portfolio?product=') && (
                    <a
                      href={'#' + s.nav}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.nav);
                      }}
                    >
                      {s.nav.startsWith('slides')
                        ? 'Open slide'
                        : s.nav.startsWith('investment')
                          ? 'Read'
                          : 'Open'}
                    </a>
                  )}
                  {s.href && !s.href.endsWith('.pptx') && (
                    <a
                      href={s.href}
                      download={!s.href.includes('.pdf') || undefined}
                      target={s.href.includes('.pdf') ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      {s.href.includes('.pdf') ? 'PDF' : 'Download'}{' '}
                      <Download size={13} aria-hidden="true" />
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
        <a
          className="pp-ask"
          href={
            '#briefing?q=' + encodeURIComponent(`Tell me about the ${p.name}`)
          }
          onClick={(e) => {
            e.preventDefault();
            go(
              'briefing?q=' + encodeURIComponent(`Tell me about the ${p.name}`),
            );
          }}
        >
          <MessageSquare size={18} aria-hidden="true" />
          <span>
            <strong>Ask DeepGrid about the {p.name}</strong>
            <small>Any question, answered from the same documents</small>
          </span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>

      {b && b.related.length > 0 && (
        <section className="pp-block" aria-labelledby="pp-rel-title">
          <h2 id="pp-rel-title">Related products</h2>
          <div className="pp-related">
            {b.related.map((id) => {
              const r = productById(id);
              return r ? (
                <a
                  key={id}
                  href={'#portfolio?product=' + id}
                  onClick={(e) => {
                    e.preventDefault();
                    go('portfolio?product=' + id);
                  }}
                >
                  <span className="product-meta">{r.category}</span>
                  <strong>{r.name}</strong>
                  <span className="num">
                    {r.price} · {r.revenue} FY2032
                  </span>
                </a>
              ) : null;
            })}
          </div>
        </section>
      )}

      <nav
        className="section-pagination pp-pagination"
        aria-label="Products in this line"
      >
        {prev ? (
          <a
            href={'#portfolio?product=' + prev.id}
            onClick={(e) => {
              e.preventDefault();
              go('portfolio?product=' + prev.id);
            }}
          >
            <ArrowLeft size={19} aria-hidden="true" />
            <span>
              <small>Previous in {p.category}</small>
              {prev.name}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a
            href={'#portfolio?product=' + next.id}
            onClick={(e) => {
              e.preventDefault();
              go('portfolio?product=' + next.id);
            }}
          >
            <span>
              <small>Next in {p.category}</small>
              {next.name}
            </span>
            <ArrowRight size={19} aria-hidden="true" />
          </a>
        )}
      </nav>
      <p className="disclaimer">
        Prices, volumes, revenues and margins are management projections. The
        text above is written from the source documents listed, and every figure
        in it appears in the source it cites.
      </p>
    </article>
  );
}
