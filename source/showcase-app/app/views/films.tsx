'use client';
import Related from '../related';
import { StoryFilm, WalkthroughFilm } from '../storyboard';
import type { Go } from '../shared';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { SectionHead } from '../shared';

// Videos: the narrated 104-slide walkthrough and six product films. Each film has its own poster
// (a frame from that film, not a shared render), its running time, English captions and a
// transcript. Captions were transcribed from the films' own narration (scripts/transcribe-films.py).
// The films are served by the content-ideas Pages site on the same origin, so the tracks load.

const origin = 'https://shekerkamma.github.io/content-ideas/deepgrid-platform/';
export const master = {
  id: 'master',
  title: 'One silicon. The full story.',
  sub: 'The 104-slide product portfolio, narrated end to end',
  src:
    origin +
    'deck_assets/DeepGrid-Semi-Product-Portfolio-104-Slide-Explainer.mp4',
  poster: './slides/slide_01.png',
  length: '32:16',
};
export const films = [
  {
    id: 'truck',
    title: 'The truck kit’s sensors',
    sub: 'Mirror towers, cab cameras and 4D radar on a heavy truck',
    length: '0:46',
  },
  {
    id: 'computebox',
    title: 'Eleven sensors, one output',
    sub: 'The 8.6 ms frame budget on the compute box',
    length: '0:54',
  },
  {
    id: 'ddrive',
    title: 'D-Drive on three road profiles',
    sub: 'Vehicle physics solved live, not a recorded drive',
    length: '1:18',
  },
  {
    id: 'forklift',
    title: 'Indoor autonomy',
    sub: 'A warehouse truck that steers, brakes and stops for people',
    length: '1:12',
  },
  {
    id: 'yard',
    title: 'A container terminal twin',
    sub: 'Positioning, routing and dispatch under quay cranes',
    length: '0:53',
  },
  {
    id: 'sentinel',
    title: 'Perimeter threat fusion',
    sub: 'Radar, thermal and camera tracks correlated at the fence',
    length: '0:49',
  },
].map((f) => ({
  ...f,
  src: origin + 'media/' + f.id + '.mp4',
  poster: './images/posters/' + f.id + '.webp',
}));
// The silicon films: how the chip moves data and why the 28 nm part is built the way it is. Posters are frames from
// each film; mesh and roadmap open on a title card, so their poster is a frame from the chapter itself.
export const siliconFilms = [
  {
    id: 'problem',
    title: 'Compute waits on data',
    sub: 'Eight cores behind one data engine, then an engine per core',
    length: '0:55',
  },
  {
    id: 'cube',
    title: 'From flat matrix to cube',
    sub: 'The same arithmetic, eight layers deep in one cycle',
    length: '0:51',
  },
  {
    id: 'landscape',
    title: 'Six answers to one question',
    sub: 'Where six chips keep their data, and where DeepGrid lands',
    length: '1:15',
  },
  {
    id: 'roadmap',
    title: 'Nine steps of silicon',
    sub: 'From SoC 1.0 on an FPGA to the 28 nm part this raise funds',
    length: '0:57',
  },
  {
    id: 'mesh',
    title: 'The far horizon',
    sub: 'SoC4-A, a 1,024-tile mesh the raise does not fund',
    length: '0:57',
  },
].map((f) => ({
  ...f,
  src: origin + 'media/' + f.id + '.mp4',
  poster: './images/posters/' + f.id + '.webp',
}));
export type Film = typeof master;
export const clock = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// #film?v=master&t=325 opens a film at a moment (product pages link to their section of the walkthrough):
// the page scrolls to it and its play button starts from there.
// The films grouped by what they show the business, each group a stage: choose a film, watch it, or read its story in
// beats and play it from any moment. #film?v=cube&t=35 opens the group holding that film with it chosen.
const GROUPS = [
  {
    id: 'products',
    title: 'Product lines in simulation',
    copy: 'The DeepGrid simulators running each product line: what it senses, how it decides and what it hands to the operator. Simulator runs, not road or site footage.',
    list: films,
  },
  {
    id: 'silicon',
    title: 'The silicon platform, animated',
    copy: 'How the 28\u00a0nm part moves data and computes, and where the roadmap goes. Animated explanations of the design, not recordings of a fabricated chip.',
    list: siliconFilms,
  },
];

function FilmGroup({
  group,
  focus,
  go,
}: {
  group: (typeof GROUPS)[number];
  focus?: { id: string; t: number };
  go: Go;
}) {
  const inGroup = (id?: string) => group.list.some((f) => f.id === id);
  const [selected, setSelected] = useState(
    inGroup(focus?.id) ? focus!.id : group.list[0].id,
  );
  useEffect(() => {
    if (inGroup(focus?.id)) setSelected(focus!.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.id]);
  const f = group.list.find((x) => x.id === selected)!;
  return (
    <section
      className="film-group"
      id={'films-' + group.id}
      aria-labelledby={'films-' + group.id + '-title'}
    >
      <header className="film-group-head">
        <h2 id={'films-' + group.id + '-title'}>{group.title}</h2>
        <p>{group.copy}</p>
      </header>
      <div className="film-chooser" role="tablist" aria-label={group.title}>
        {group.list.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={'tab-' + x.id}
            aria-selected={x.id === selected}
            aria-controls={'film-' + x.id}
            tabIndex={x.id === selected ? 0 : -1}
            onClick={() => setSelected(x.id)}
            onKeyDown={(e) => {
              const i = group.list.findIndex((y) => y.id === selected);
              const n =
                e.key === 'ArrowRight'
                  ? i + 1
                  : e.key === 'ArrowLeft'
                    ? i - 1
                    : -9;
              if (n === -9) return;
              e.preventDefault();
              const next =
                group.list[(n + group.list.length) % group.list.length];
              setSelected(next.id);
              document.getElementById('tab-' + next.id)?.focus();
            }}
          >
            <img
              src={x.poster}
              width={160}
              height={90}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span>
              <strong>{x.title}</strong>
              <small className="num">{x.length}</small>
            </span>
          </button>
        ))}
      </div>
      <article
        className="film-stage"
        id={'film-' + f.id}
        role="tabpanel"
        aria-labelledby={'tab-' + f.id}
      >
        <header>
          <h3>{f.title}</h3>
          <p>
            {f.sub} <span className="num">· {f.length}</span>
          </p>
        </header>
        <p className="visual-status">
          {siliconFilms.some((x) => x.id === f.id)
            ? 'Architecture explanation · not fabricated-silicon footage'
            : 'Software simulation · not road or site footage'}
        </p>
        <StoryFilm
          key={f.id}
          film={f}
          startAt={focus?.id === f.id ? focus.t : 0}
        />
        <Transcript key={'tx-' + f.id} id={f.id} />
        <Related item={'film:' + f.id} go={go} />
      </article>
    </section>
  );
}

export default function Films({
  reduced,
  focus,
  go,
}: {
  reduced: boolean;
  focus?: { id: string; t: number };
  go: Go;
}) {
  // land on the film a link names, one frame after navigation restores the scroll position (use-navigation.ts)
  useEffect(() => {
    if (!focus?.id) return;
    const land = () =>
      document
        .getElementById('film-' + focus.id)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => requestAnimationFrame(land)),
    );
  }, [focus?.id, focus?.t]);
  return (
    <section className="page-wrap">
      <SectionHead
        title="Demonstrations"
        copy="The portfolio narrated end to end, the product lines running in their simulators, and the silicon animated. Every film is told as a storyboard: read the moments, or play from any one of them. Every film has captions and a transcript."
      />
      <nav className="film-navigation" aria-label="Film groups">
        {[
          ['film-master', 'The narrated portfolio'],
          ['films-products', 'Product lines in simulation'],
          ['films-silicon', 'The silicon platform, animated'],
        ].map(([id, label]) => (
          <a
            key={id}
            href={'#' + id}
            onClick={(e) => {
              if (
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
              )
                return;
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({
                behavior: reduced ? 'instant' : 'smooth',
                block: 'start',
              });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <article
        className="film-group film-walkthrough"
        id="film-master"
        aria-labelledby="film-master-title"
      >
        <header className="film-group-head">
          <h2 id="film-master-title">The narrated portfolio</h2>
          <p>
            The 104-slide portfolio, narrated end to end in {master.length}.
            Choose a chapter, or a product line inside it, to play from that
            moment.
          </p>
        </header>
        <WalkthroughFilm
          film={master}
          startAt={focus?.id === 'master' ? focus.t : 0}
        />
        <Transcript id="master" />
      </article>
      {GROUPS.map((g) => (
        <FilmGroup key={g.id} group={g} focus={focus} go={go} />
      ))}
      <p className="disclaimer">
        Product films show the DeepGrid simulators, not road or site footage.
        Silicon films are animated explanations of the design, not recordings of
        a fabricated 28&nbsp;nm chip. The walkthrough can also be{' '}
        <a
          className="inline-link"
          href="https://drive.google.com/file/d/1pVlhAll8U9Y2N2pW-WG-Lm6N9R3CRm10/view"
          target="_blank"
          rel="noreferrer"
        >
          opened on Google Drive <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        .
      </p>
    </section>
  );
}

// The poster and a single play button until the viewer starts it; then the browser's own
// controls, which carry the captions menu, the scrubber and full screen.
export function Player({
  film,
  startAt = 0,
  seek,
  onTime,
}: {
  film: Film;
  startAt?: number;
  // a storyboard plays the film from a beat: it is handed the function that does it
  seek?: { current: ((t: number) => void) | null };
  onTime?: (t: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null),
    [started, setStarted] = useState(false);
  if (seek)
    seek.current = (t: number) => {
      const v = ref.current;
      if (!v) return;
      setStarted(true);
      const play = () => {
        v.currentTime = t;
        v.play().catch(() => {}); // a play cut short by switching films is not an error
      };
      if (v.readyState >= 1) play();
      else {
        v.addEventListener('loadedmetadata', play, { once: true });
        v.load();
      }
    };
  return (
    <div className={'film-frame' + (started ? ' is-started' : '')}>
      <video
        ref={ref}
        onTimeUpdate={
          onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined
        }
        controls={started}
        preload="none"
        poster={film.poster}
        playsInline
        crossOrigin="anonymous"
        width={1600}
        height={900}
      >
        <source
          src={film.src + (startAt ? '#t=' + startAt : '')}
          type="video/mp4"
        />
        <track
          kind="captions"
          src={'./media/captions/' + film.id + '.vtt'}
          srcLang="en"
          label="English"
          default
        />
      </video>
      {!started && (
        <button
          className="film-play"
          aria-label={
            startAt
              ? `Play ${film.title} from ${clock(startAt)}`
              : `Play ${film.title}, ${film.length}`
          }
          onClick={() => {
            setStarted(true);
            ref.current?.play().catch(() => {});
          }}
        >
          <span>
            <Play size={20} fill="currentColor" aria-hidden="true" />
          </span>
          {startAt > 0 && (
            <em className="film-from num">from {clock(startAt)}</em>
          )}
        </button>
      )}
    </div>
  );
}

// The transcript is the caption file read as prose, fetched only when opened.
export function Transcript({ id }: { id: string }) {
  const [open, setOpen] = useState(false),
    [text, setText] = useState<string[] | null>(null);
  useEffect(() => {
    if (!open || text) return;
    fetch('./media/captions/' + id + '.vtt')
      .then((r) => (r.ok ? r.text() : ''))
      .then((vtt) => {
        const lines = vtt
          .split('\n')
          .filter((l) => l && !l.startsWith('WEBVTT') && !l.includes('-->'));
        // group caption lines into short paragraphs of about five cues
        const paras: string[] = [];
        for (let i = 0; i < lines.length; i += 5)
          paras.push(lines.slice(i, i + 5).join(' '));
        setText(paras.length ? paras : ['Transcript unavailable.']);
      })
      .catch(() => setText(['Transcript unavailable.']));
  }, [open, id, text]);
  return (
    <details
      className="transcript"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary>Transcript</summary>
      {text ? text.map((p, i) => <p key={i}>{p}</p>) : <p>Loading…</p>}
    </details>
  );
}
