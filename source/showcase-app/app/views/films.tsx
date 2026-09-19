'use client';
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
export default function Films({
  reduced,
  focus,
}: {
  reduced: boolean;
  focus?: { id: string; t: number };
}) {
  useEffect(() => {
    if (!focus?.id) return;
    requestAnimationFrame(() =>
      document
        .getElementById('film-' + focus.id)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' }),
    );
  }, [focus?.id, focus?.t]);
  const at = (id: string) => (focus?.id === id ? focus.t : 0);
  return (
    <section className="page-wrap">
      <SectionHead
        title="Video library"
        copy="The full narrated walkthrough of the portfolio, and short films of the products running in simulation. Every film has captions and a transcript."
      />
      <nav className="film-navigation" aria-label="Jump to a film">
        {[master, ...films, ...siliconFilms].map((f) => (
          <a
            key={f.id}
            href={'#film-' + f.id}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('film-' + f.id)?.scrollIntoView({
                behavior: reduced ? 'instant' : 'smooth',
                block: 'start',
              });
            }}
          >
            {f.id === 'master' ? 'Full walkthrough' : f.title}
          </a>
        ))}
      </nav>
      <article className="master-player" id="film-master">
        <Player film={master} startAt={at('master')} />
        <div>
          <h2>{master.title}</h2>
          <p>{master.sub}</p>
          <p className="num film-length">{master.length}</p>
          <Transcript id="master" />
        </div>
      </article>
      <h2 className="film-grid-title">Product films</h2>
      <div className="film-grid">
        {films.map((f) => (
          <article key={f.id} id={'film-' + f.id}>
            <Player film={f} startAt={at(f.id)} />
            <div>
              <h3>{f.title}</h3>
              <p>
                {f.sub} <span className="num">· {f.length}</span>
              </p>
              <Transcript id={f.id} />
            </div>
          </article>
        ))}
      </div>
      <h2 className="film-grid-title">Silicon films</h2>
      <div className="film-grid">
        {siliconFilms.map((f) => (
          <article key={f.id} id={'film-' + f.id}>
            <Player film={f} startAt={at(f.id)} />
            <div>
              <h3>{f.title}</h3>
              <p>
                {f.sub} <span className="num">· {f.length}</span>
              </p>
              <Transcript id={f.id} />
            </div>
          </article>
        ))}
      </div>
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
}: {
  film: Film;
  startAt?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null),
    [started, setStarted] = useState(false);
  return (
    <div className={'film-frame' + (started ? ' is-started' : '')}>
      <video
        ref={ref}
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
            void ref.current?.play();
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
