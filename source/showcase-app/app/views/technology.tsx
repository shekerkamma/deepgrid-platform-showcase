'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import Silicon from '../silicon';
import {
  SectionHead,
  Scene,
  domains,
  nb,
  productById,
  type Go,
} from '../shared';
import story from '../data/tech-story.json';
import slideNotes from '../slide-notes.json';
import { films, siliconFilms, Player } from './films';
import Related from '../related';
import { StoryFilm } from '../storyboard';
import boards from '../data/storyboards.json';
const figureNotes = (
  boards as unknown as {
    figures: Record<string, { title: string; shows: string; matters: string }>;
  }
).figures;

// Technology: the silicon told as a story for executives and investors, in the Overview's shape. Each chapter has a
// kicker, a verdict headline and a lede on why it matters, story pills, the component or film that shows it, and the
// technical detail beneath with labelled references to the deck slides and memorandum pages it was written from.
// The copy is generated and gated by scripts/build-tech-story.mjs (every figure must appear in the chapter's sources).

type Chapter = (typeof story.chapters)[number];
// Two chapters are laid out side by side, so the page does not repeat one stacked shape seven times: the die beside
// the case for it, and the cube (the differentiator) with its film leading. Only the turns carry a kicker: the
// scroll-craft floor allows one eyebrow per three sections, and the chapter nav already names every chapter.
const SPLIT: Record<string, 'lead' | 'trail'> = {
  silicon: 'lead',
  cube: 'trail',
};
const SIGNPOSTS = new Set(['measured', 'horizon']);
const FRAME = 33.3,
  FUSION = 8.6;
const channels = [
  ['7', 'RGB cameras', 'road, sides, dashcam, driver, rear'],
  ['2', 'thermal cameras', 'left and right towers'],
  ['2', '4D radar', '77 GHz, front and rear'],
];
const stages = [
  [
    'FPGA demonstration',
    'Exercise the software, interfaces and prototype compute.',
  ],
  [
    'Production ASIC',
    'Verify scaled compute, memory, clock, power and area together.',
  ],
  [
    'Vehicle integration',
    'Test thermal behaviour, safety path and operational conditions.',
  ],
  [
    'Capital-release gate',
    'Reproducible measurements on the intended configuration.',
  ],
];
const allFilms = [...films, ...siliconFilms];
const slideName = (n: number) => {
  const t = slideNotes[n - 1]?.title || '';
  return t.includes(' · ') ? t.split(' · ').slice(1).join(' · ') : t;
};

function FilmRow({ ids }: { ids: string[] }) {
  const list = ids
    .map((id) => allFilms.find((f) => f.id === id))
    .filter((f): f is (typeof allFilms)[number] => !!f);
  return (
    <div className="tech-films">
      {list.map((f) => (
        <figure key={f.id} className="tech-film">
          <figcaption>
            <strong>{f.title}</strong> {f.sub}
            <span className="num"> · {f.length}</span>
          </figcaption>
          <StoryFilm film={f} />
        </figure>
      ))}
    </div>
  );
}

// A figure with what it shows and why it matters (scripts/build-storyboards.mjs), and where it comes from.
function Figure({
  id,
  size,
  alt,
  from,
}: {
  id: string;
  size: [number, number];
  alt: string;
  from: string;
}) {
  const note = figureNotes[id];
  return (
    <figure className="tech-figure">
      <img
        src={'./images/' + id + '.webp'}
        alt={alt}
        width={size[0]}
        height={size[1]}
        loading="lazy"
        style={{ maxWidth: size[0] }}
      />
      <figcaption>
        {note ? (
          <>
            <strong>{nb(note.title)}</strong>
            <span>{nb(note.shows)}</span>
            <span className="tech-figure-matters">{nb(note.matters)}</span>
          </>
        ) : null}
        <small>{from}</small>
      </figcaption>
    </figure>
  );
}

function Die({ reduced }: { reduced: boolean }) {
  const [exploded, setExploded] = useState(false),
    [motion, setMotion] = useState(!reduced);
  return (
    <div className="architecture-stage tech-die">
      <div className="stage-top">
        <span className="mono">SoC2 architectural model</span>
        <button
          aria-pressed={motion}
          onClick={() => setMotion(!motion)}
          className="small-button"
        >
          Motion {motion ? 'on' : 'off'}
        </button>
      </div>
      <Silicon selected={0} exploded={exploded} reduced={!motion} />
      <div className="stage-bottom">
        <span>Drag to rotate. Conceptual, not a mask layout.</span>
        <button
          className="small-button"
          onClick={() => setExploded(!exploded)}
          aria-pressed={exploded}
        >
          <Layers size={14} aria-hidden="true" />
          {exploded ? 'Assemble layers' : 'Separate layers'}
        </button>
      </div>
    </div>
  );
}

function Domains({ go, initial }: { go: Go; initial: string }) {
  const [domain, setDomain] = useState(
    Math.max(
      0,
      domains.findIndex((x) => x.code === initial),
    ),
  );
  const d = domains[domain];
  return (
    <div className="domain-panel tech-domains">
      <div className="domain-tabs" role="tablist" aria-label="Compute domains">
        {domains.map((x, i) => (
          <button
            key={x.code}
            role="tab"
            aria-selected={domain === i}
            aria-controls="domain-detail"
            onClick={() => setDomain(i)}
          >
            <x.Icon size={16} aria-hidden="true" />
            <span className="num">{x.code}</span>
            <strong>{x.name}</strong>
          </button>
        ))}
      </div>
      <div id="domain-detail" role="tabpanel" className="domain-detail">
        <p className="num domain-code">
          {d.code} · {d.type}
        </p>
        <h3>{d.name}</h3>
        <p>{d.desc}</p>
        <p className="domain-carries-label">Products that rely on it</p>
        <ul>
          {d.carries.map((id) => {
            const p = productById(id);
            return p ? (
              <li key={id}>
                <a
                  href={'#portfolio?product=' + id}
                  onClick={(e) => {
                    e.preventDefault();
                    go('portfolio?product=' + id);
                  }}
                >
                  {p.name}
                </a>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
}

function FrameBudget() {
  const left = Math.round(((FRAME - FUSION) / FRAME) * 100);
  return (
    <div className="frame-budget">
      <div className="fb-flow">
        <ul className="fb-inputs" aria-label="Sensor inputs">
          {channels.map(([n, what, where]) => (
            <li key={what}>
              <strong className="num">{n}</strong>
              <span>
                {what}
                <small>{where}</small>
              </span>
            </li>
          ))}
        </ul>
        <div className="fb-chip" aria-hidden="true">
          <span>SoC2</span>
          <small>one fused perception pass</small>
        </div>
        <div className="fb-out">
          <span>Objects, range and velocity</span>
          <small>to warnings and vehicle control</small>
        </div>
      </div>
      <div
        className="fb-bar"
        role="img"
        aria-label={`Frame budget: fusion ${FUSION} ms of a ${FRAME} ms frame, ${left}% left`}
      >
        <div
          className="fb-used"
          style={{ ['--w' as string]: (FUSION / FRAME) * 100 + '%' }}
        >
          <span className="num">{FUSION} ms fusion</span>
        </div>
        <div className="fb-free">
          <span className="num">
            {(FRAME - FUSION).toFixed(1)} ms left · {left}%
          </span>
        </div>
      </div>
      <div className="fb-scale num" aria-hidden="true">
        <span>0 ms</span>
        <span>33.3 ms, one frame at 30 fps</span>
      </div>
      <p className="tech-note">
        8.6 ms is a design target, not a measured production latency.
      </p>
    </div>
  );
}

// what each chapter shows beside its pills
function Showing({
  id,
  reduced,
  go,
  domain,
}: {
  id: string;
  reduced: boolean;
  go: Go;
  domain: string;
}) {
  switch (id) {
    case 'silicon':
      return <Die reduced={reduced} />;
    case 'domains':
      return (
        <>
          <Domains go={go} initial={domain} />
          <Figure
            id="figure-05"
            size={[1600, 740]}
            alt="Specification table of the 57.1 mm² combo die on TSMC 28 nm HPC+, one row per domain: A100, R100, T100, D100, S100 and H100"
            from="Table from the Information Memorandum"
          />
        </>
      );
    case 'sensors':
      return (
        <>
          <FrameBudget />
          <FilmRow ids={['computebox']} />
          <Figure
            id="figure-07"
            size={[1500, 564]}
            alt="Diagram of seven RGB cameras, two thermal cameras and two 4D radars routed into the in-cab compute box, whose DeepGrid SoC outputs one fused AD2 perception stream"
            from="Diagram from the Information Memorandum, June 2026"
          />
        </>
      );
    case 'measured':
      return (
        <>
          <ol className="pp-steps" aria-label="Stages of proof">
            {stages.map(([t, d]) => (
              <li key={t}>
                <strong>{t}</strong> {d}
              </li>
            ))}
          </ol>
          <FilmRow ids={['roadmap']} />
        </>
      );
    case 'data':
      return <FilmRow ids={['problem', 'landscape']} />;
    case 'cube':
      return (
        <>
          <FilmRow ids={['cube']} />
          <Figure
            id="figure-06"
            size={[1300, 856]}
            alt="Diagram of the 8 by 8 by 8 tensor cube: an activation slab streams through the cube, completing 512 multiply-accumulates per cycle"
            from="Diagram from the Information Memorandum, June 2026"
          />
        </>
      );
    case 'horizon':
      return (
        <>
          <FilmRow ids={['mesh']} />
          <Figure
            id="figure-11"
            size={[760, 488]}
            alt="Rendering of the MicroDC-A1, a 4U 19-inch rack unit holding four SoC4-A modules"
            from="Rendering from the Information Memorandum: a conceptual product, not hardware that exists"
          />
        </>
      );
    default:
      return null;
  }
}

function References({ c, go }: { c: Chapter; go: Go }) {
  return (
    <p className="pp-chapter-source tech-refs">
      {c.slides.map((n) => (
        <a
          key={'s' + n}
          href={'#slides?slide=' + n}
          onClick={(e) => {
            e.preventDefault();
            go('slides?slide=' + n);
          }}
        >
          Portfolio deck, slide {n}: {slideName(n)}
        </a>
      ))}
      {c.passages.map((p) =>
        p.href ? (
          <a key={p.id} href={p.href} target="_blank" rel="noreferrer">
            {p.doc}
            {p.page ? ', ' + p.page : ''}: {p.title}
          </a>
        ) : p.nav ? (
          <a
            key={p.id}
            href={'#' + p.nav}
            onClick={(e) => {
              e.preventDefault();
              go(p.nav);
            }}
          >
            {p.doc}: {p.title}
          </a>
        ) : null,
      )}
    </p>
  );
}

export default function Technology({
  reduced,
  go,
  chapter = '',
  domain = '',
}: {
  reduced: boolean;
  go: Go;
  chapter?: string;
  domain?: string;
}) {
  // #silicon?chapter=domains&domain=R100 (from a product page) opens at that chapter with that domain selected.
  // Navigation restores the scroll position two frames after a route change (use-navigation.ts), so land a frame later.
  useEffect(() => {
    if (!chapter) return;
    const land = () =>
      document
        .getElementById('tech-' + chapter)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => requestAnimationFrame(land)),
    );
  }, [chapter]);
  return (
    <section className="page-wrap tech-page">
      <SectionHead
        title="The silicon behind every product"
        copy={nb(
          'One 28 nm chip, SoC2, carries the whole portfolio. Seven short chapters on what it is, why it is built this way, and what still has to be proven. The chip is not yet fabricated: its figures are design targets and derivations.',
        )}
      />
      <figure className="tech-hero-scene">
        <Scene id="die" sizes="(min-width: 1200px) 1140px, 100vw" eager />
        <figcaption>
          SoC2 as it is meant to ship. Concept render, not the floorplan;
          39.3&nbsp;TOPS is a design target.
        </figcaption>
      </figure>
      <nav
        className="film-navigation tech-nav"
        aria-label="Technology chapters"
      >
        {story.chapters.map((c) => (
          <a
            key={c.id}
            href={'#tech-' + c.id}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('tech-' + c.id)?.scrollIntoView({
                behavior: reduced ? 'instant' : 'smooth',
                block: 'start',
              });
            }}
          >
            {c.kicker}
          </a>
        ))}
      </nav>
      {story.chapters.map((c) => {
        const copy = (
          <>
            <header className="ov-chapter-head">
              {SIGNPOSTS.has(c.id) && <p className="kicker">{c.kicker}</p>}
              <h2 id={'tech-h-' + c.id}>{nb(c.headline)}</h2>
              <p>{nb(c.lede)}</p>
            </header>
            <ul className="pp-pills" aria-label={c.kicker + ': key figures'}>
              {c.pills.map((x) => (
                <li key={x.value + x.label}>
                  <strong>{nb(x.value)}</strong>
                  <span>{nb(x.label)}</span>
                </li>
              ))}
            </ul>
          </>
        );
        const showing = (
          <div className="tech-showing">
            <Showing id={c.id} reduced={reduced} go={go} domain={domain} />
          </div>
        );
        const detail = (
          <>
            <details className="tech-detail">
              <summary>Technical detail</summary>
              <p>{nb(c.detail)}</p>
            </details>
            <References c={c} go={go} />
            <Related
              item={'tech:' + c.id}
              go={go}
              exclude={['slide', 'film']}
              title="This chapter across the site"
            />
          </>
        );
        const split = SPLIT[c.id];
        return (
          <section
            key={c.id}
            id={'tech-' + c.id}
            className={
              'ov-chapter tech-chapter tech-ch-' +
              c.id +
              (split ? ' tech-split is-' + split : '')
            }
            aria-labelledby={'tech-h-' + c.id}
          >
            {split ? (
              <>
                <div className="tech-copy">
                  {copy}
                  {detail}
                </div>
                {showing}
              </>
            ) : (
              <>
                {copy}
                {showing}
                {detail}
              </>
            )}
          </section>
        );
      })}
      <section
        className="ov-close tech-close"
        aria-labelledby="tech-close-title"
      >
        <h2 id="tech-close-title">SoC2 is the business.</h2>
        <p>
          Every product on this site runs on one 28&nbsp;nm die. What the round
          buys is the step from a working FPGA to production silicon; SoC4-A is
          the option that business buys.
        </p>
        <nav className="ov-routes" aria-label="Where to go next">
          {[
            [
              'portfolio',
              'The fifteen products',
              'What each one does with the die',
            ],
            [
              'investment',
              'The investment case',
              'Round, use of funds, tapeout gates and risks',
            ],
            [
              'film',
              'The silicon films',
              'Data movement, the cube and the roadmap, narrated',
            ],
          ].map(([id, title, sub]) => (
            <a
              key={id}
              href={'#' + id}
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
            >
              <strong>{title}</strong>
              <span>{sub}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </section>
    </section>
  );
}
