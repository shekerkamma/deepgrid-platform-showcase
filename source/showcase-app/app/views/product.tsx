'use client';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import {
  products,
  productById,
  domains,
  nb,
  type Go,
  type Product,
} from '../shared';
import briefs from '../data/product-briefs.json';
import stories from '../data/product-stories.json';
import slideNotes from '../slide-notes.json';
import { films as filmList, master, Player, clock } from './films';
import { chapters as memoChapters } from './investment';

// One product, read the way an executive reads it: the case in three lines, what it is used for, the product's story
// told from its own chapter of the portfolio deck (a headline, a short narrative and data pills per chapter, with the
// simulator film where there is one), what has to go right, and further reading. Every link names its destination.
// Story: scripts/build-product-stories.mjs. Use cases and risks: scripts/build-product-briefs.mjs. Both are written
// from the GraphRAG index and gated on figures and maturity claims; slide ranges, films and ramps are derived.

type Brief = (typeof briefs.products)[keyof typeof briefs.products];
type Chapter = {
  kind: string;
  title: string;
  slides: number[];
  headline: string;
  narrative: string;
  pills: { value: string; label: string }[];
  ramp?: { years: string[]; units: number[]; revenue: number[] };
};
type Story = { takeaways: string[]; chapters: Chapter[] };
type Source = Brief['sources'][number];
type Link = { label: string; detail?: string; hash?: string; href?: string };

const slideName = (n: number) => {
  const t = slideNotes[n - 1]?.title || '';
  return t.includes(' · ') ? t.split(' · ').slice(1).join(' · ') : t;
};

// A source becomes a link only if it goes somewhere, and its label says where.
function linkFor(s: Source): Link | null {
  const nav = s.nav || '';
  if (nav.startsWith('slides?slide=')) {
    const n = Number(nav.split('=')[1]);
    return {
      label: `Portfolio deck, slide ${n}`,
      detail: slideName(n),
      hash: nav,
    };
  }
  if (nav.includes('usecase=UC-')) {
    const [id, ...rest] = s.section.split(' ');
    return {
      label: `Commercial use case ${id}`,
      detail: rest.join(' '),
      hash: nav,
    };
  }
  if (nav.startsWith('investment?chapter=')) {
    const ch = nav.split('chapter=')[1].split('&')[0];
    const title = memoChapters.find((c) => c[0] === ch)?.[1] || 'Overview';
    return {
      label: `Investment memorandum: ${title}`,
      detail: s.section,
      hash: nav,
    };
  }
  if (s.href) {
    const page =
      /#page=(\d+)/.exec(s.href)?.[1] || /^p\. (\d+)$/.exec(s.section)?.[1];
    const kind = s.href.endsWith('.xlsx')
      ? 'workbook'
      : s.href.endsWith('.docx')
        ? 'document'
        : page
          ? `page ${page}`
          : 'PDF';
    return { label: `${s.doc}, ${kind}`, detail: s.section, href: s.href };
  }
  return null;
}
const dedupe = (list: Link[]) => [
  ...new Map(list.map((l) => [l.label + '|' + (l.detail || ''), l])).values(),
];

function Anchor({
  link,
  go,
  className = 'pp-link',
}: {
  link: Link;
  go: Go;
  className?: string;
}) {
  const body = (
    <>
      <span>
        <strong>{link.label}</strong>
        {link.detail && <small>{link.detail}</small>}
      </span>
      {link.href ? (
        <ArrowUpRight size={15} aria-hidden="true" />
      ) : (
        <ArrowRight size={15} aria-hidden="true" />
      )}
    </>
  );
  return link.href ? (
    <a className={className} href={link.href} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <a
      className={className}
      href={'#' + link.hash}
      onClick={(e) => {
        e.preventDefault();
        go(link.hash!);
      }}
    >
      {body}
    </a>
  );
}

function Ramp({ ramp }: { ramp: NonNullable<Chapter['ramp']> }) {
  const max = Math.max(...ramp.revenue, 1);
  return (
    <figure className="pp-ramp">
      <figcaption>Revenue and units by year (management projection)</figcaption>
      <ol>
        {ramp.years.map((y, i) => (
          <li key={y}>
            <span className="pp-ramp-value num">
              ₹{ramp.revenue[i].toLocaleString('en-IN')} Cr
            </span>
            <span
              className="pp-ramp-bar"
              style={{
                ['--h' as string]: `${Math.max(2, (ramp.revenue[i] / max) * 100)}%`,
              }}
            />
            <span className="pp-ramp-year num">{y}</span>
            <span className="pp-ramp-units num">
              {ramp.units[i].toLocaleString('en-IN')} units
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Films({ films }: { films: typeof filmList }) {
  return (
    <div className={'pp-films' + (films.length === 1 ? ' is-single' : '')}>
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
  );
}

export default function ProductPage({
  product: p,
  go,
  back,
}: {
  product: Product;
  go: Go;
  back: () => void;
}) {
  const b = (briefs.products as Record<string, Brief>)[p.id];
  const story = (stories as Record<string, Story>)[p.id];
  const line = products.filter((x) => x.category === p.category),
    i = line.findIndex((x) => x.id === p.id),
    prev = line[i - 1],
    next = line[i + 1];
  const films = filmList.filter((f) =>
    (b?.films as string[] | undefined)?.includes(f.id),
  );
  const hasProof = !!story?.chapters.some((c) => c.kind === 'proof');
  const risk = b?.sections.find((s) => /go right/i.test(s.label));
  const cited = (ids: number[]) =>
    dedupe(
      ids
        .map((n) => b?.sources[n - 1])
        .filter(Boolean)
        .map((s) => linkFor(s!))
        .filter(Boolean) as Link[],
    );
  const storySlides = new Set(story?.chapters.flatMap((c) => c.slides) || []);
  // further reading: every linked source, except slides the story already links chapter by chapter
  const reading = dedupe(
    (b?.sources.map(linkFor).filter(Boolean) as Link[]) || [],
  ).filter(
    (l) =>
      !(
        l.hash?.startsWith('slides?slide=') &&
        storySlides.has(Number(l.hash.split('=')[1]))
      ),
  );
  // where this product sits on the silicon: its domain on the Technology page, and the frame budget where the
  // product's story rests on it, so a figure read here is explained there in the same words
  const domain = domains.find((d) =>
    (d.carries as readonly string[]).includes(p.id),
  );
  const silicon: Link[] = [
    domain
      ? {
          label: `The ${domain.code} ${domain.name} on the SoC2 die`,
          detail: 'Technology: six domains, one tapeout',
          hash: `silicon?chapter=domains&domain=${domain.code}`,
        }
      : {
          label: 'The SoC2 die under every product',
          detail: 'Technology: the silicon',
          hash: 'silicon?chapter=silicon',
        },
    ...(JSON.stringify(story || '').includes('8.6 ms')
      ? [
          {
            label: 'How eleven sensors fit an 8.6 ms budget',
            detail: 'Technology: sensor to compute',
            hash: 'silicon?chapter=sensors',
          },
        ]
      : []),
  ];
  const ask = `Tell me about the ${p.name}`;

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
      </header>

      {story && (
        <section className="pp-block pp-case" aria-labelledby="pp-case-title">
          <h2 id="pp-case-title">The case in brief</h2>
          <ul>
            {story.takeaways.map((t) => (
              <li key={t}>{nb(t)}</li>
            ))}
          </ul>
        </section>
      )}

      {b && (
        <section className="pp-block" aria-labelledby="pp-uses-title">
          <h2 id="pp-uses-title">What it is used for</h2>
          <div className="pp-usecases">
            {b.useCases.map((u) => {
              const refs = cited(u.sources).filter(
                (l) => !(u.detail && l.hash === u.detail.nav),
              );
              return (
                <article key={u.title} className="pp-usecase">
                  <h3>{u.title}</h3>
                  <dl>
                    <div>
                      <dt>Buyer</dt>
                      <dd>{u.buyer}</dd>
                    </div>
                    <div>
                      <dt>The job</dt>
                      <dd>{nb(u.problem)}</dd>
                    </div>
                    <div>
                      <dt>What DeepGrid supplies</dt>
                      <dd>{nb(u.delivers)}</dd>
                    </div>
                  </dl>
                  {(u.detail || refs.length > 0) && (
                    <div className="pp-usecase-links">
                      {u.detail && (
                        <Anchor
                          go={go}
                          className="pp-link is-primary"
                          link={{
                            label: `Full use case ${u.detail.id}`,
                            detail: u.detail.title,
                            hash: u.detail.nav,
                          }}
                        />
                      )}
                      {refs.slice(0, 2).map((l) => (
                        <Anchor key={l.label + l.detail} go={go} link={l} />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {story && (
        <section className="pp-block pp-story" aria-labelledby="pp-story-title">
          <h2 id="pp-story-title">The story</h2>
          {story.chapters.map((c) => (
            <section
              key={c.kind}
              className={'pp-chapter pp-chapter-' + c.kind}
              aria-labelledby={'pp-ch-' + c.kind}
            >
              <h3 id={'pp-ch-' + c.kind}>{nb(c.headline)}</h3>
              <p className="pp-narrative">{nb(c.narrative)}</p>
              <ul className="pp-pills" aria-label={c.title + ': key points'}>
                {c.pills.map((x) => (
                  <li key={x.value + x.label}>
                    <strong>{nb(x.value)}</strong>
                    <span>{nb(x.label)}</span>
                  </li>
                ))}
              </ul>
              {c.kind === 'how' && (
                <ol className="pp-steps" aria-label="From sensing to action">
                  {p.signalChain.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              )}
              {c.kind === 'fits' && c.ramp && <Ramp ramp={c.ramp} />}
              {c.kind === 'proof' && films.length > 0 && (
                <Films films={films} />
              )}
              <p className="pp-chapter-source">
                {c.slides.map((n) => (
                  <a
                    key={n}
                    href={'#slides?slide=' + n}
                    onClick={(e) => {
                      e.preventDefault();
                      go('slides?slide=' + n);
                    }}
                  >
                    Portfolio deck, slide {n}: {slideName(n)}
                  </a>
                ))}
              </p>
            </section>
          ))}
          {!hasProof && films.length > 0 && (
            <section className="pp-chapter" aria-labelledby="pp-ch-films">
              <p className="kicker">See it running</p>
              <h3 id="pp-ch-films">
                The platform behind this product, running in simulation.
              </h3>
              <Films films={films} />
            </section>
          )}
        </section>
      )}

      {(risk || p.dependsOn) && (
        <section className="pp-block pp-risk" aria-labelledby="pp-risk-title">
          <h2 id="pp-risk-title">What has to go right</h2>
          {risk && <p>{risk.text}</p>}
          <p className="pp-dependency">
            <strong>Key dependency</strong> {p.dependsOn}
          </p>
        </section>
      )}

      <section className="pp-block" aria-labelledby="pp-more-title">
        <h2 id="pp-more-title">Further reading and viewing</h2>
        <div className="pp-more">
          {(b?.walkthrough != null || films.length > 0) && (
            <div>
              <h3>Watch</h3>
              {b?.walkthrough != null && (
                <a
                  className="pp-link is-primary"
                  href={`#film?v=master&t=${b.walkthrough}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(`film?v=master&t=${b.walkthrough}`);
                  }}
                >
                  <span>
                    <strong>
                      <Play size={12} fill="currentColor" aria-hidden="true" />{' '}
                      The {p.name} in the narrated walkthrough
                    </strong>
                    <small>
                      {master.title} From{' '}
                      <span className="num">{clock(b.walkthrough)}</span>
                    </small>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              )}
              {films.map((f) => (
                <Anchor
                  key={f.id}
                  go={go}
                  link={{
                    label: `Film: ${f.title}`,
                    detail: `${f.sub} · ${f.length}`,
                    hash: `film?v=${f.id}`,
                  }}
                />
              ))}
            </div>
          )}
          <div>
            <h3>Read</h3>
            {[...silicon, ...reading].map((l) => (
              <Anchor key={l.label + l.detail} go={go} link={l} />
            ))}
            <Anchor
              go={go}
              className="pp-link is-ask"
              link={{
                label: `Ask DeepGrid about the ${p.name}`,
                detail: 'Any question, answered from the same documents',
                hash: 'briefing?q=' + encodeURIComponent(ask),
              }}
            />
          </div>
        </div>
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
        text is written from the linked documents, and every figure in it
        appears in the source it came from.
      </p>
    </article>
  );
}
