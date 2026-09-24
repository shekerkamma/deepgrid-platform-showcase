'use client';
import { useRef, useState } from 'react';
import boards from './data/storyboards.json';
import relations from './data/relations.json';
import slideNotes from './slide-notes.json';
import { products } from './shared';
import { Player, clock, type Film } from './views/films';
import { deckChapters } from './views/deck';

// A film told as a storyboard: the player, and beneath it the film's story in beats, each with the moment it starts, a
// short title and a sentence or two a reader can take in without pressing play. A beat is a button that plays the film
// from that moment; the beat now playing is marked. Beats are written from the film's own reviewed narration
// (scripts/build-storyboards.mjs).
//
// Frames are shown only where they read at thumbnail size. Decided by looking at the contact sheets (2026-09-19): the
// three 3D simulations (D-Drive, forklift, container yard) have distinct, legible frames; the other films are diagram
// and interface animations whose labels only read at full size, so their storyboard is a timeline and the player shows
// the frame.
const THUMBS = new Set(['ddrive', 'forklift', 'yard']);

type Beat = {
  t: number;
  title: string;
  text: string;
  frame?: string;
  size?: number[];
};
const films = (
  boards as unknown as { films: Record<string, { beats: Beat[] }> }
).films;
export const beatsFor = (id: string) => films[id]?.beats || [];

function Board({
  label,
  beats,
  now,
  play,
  thumbs,
}: {
  label: string;
  beats: Beat[];
  now: number;
  play: (t: number) => void;
  thumbs: boolean;
}) {
  const active = beats.reduce((a, b, i) => (now >= b.t ? i : a), -1);
  return (
    <ol
      className={'storyboard' + (thumbs ? ' has-thumbs' : '')}
      aria-label={label}
    >
      {beats.map((b, i) => (
        <li key={b.t} aria-current={i === active ? 'step' : undefined}>
          <button
            type="button"
            onClick={() => play(b.t)}
            aria-label={`Play from ${clock(b.t)}: ${b.title}`}
          >
            {thumbs && b.frame && (
              <img
                src={'./' + b.frame}
                width={b.size?.[0]}
                height={b.size?.[1]}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            <span className="sb-time num">{clock(b.t)}</span>
            <strong>{b.title}</strong>
          </button>
          <p>{b.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function StoryFilm({
  film,
  startAt = 0,
}: {
  film: Film;
  startAt?: number;
}) {
  const seek = useRef<((t: number) => void) | null>(null);
  const [now, setNow] = useState(-1);
  const beats = beatsFor(film.id);
  return (
    <div className="story-film">
      <Player film={film} startAt={startAt} seek={seek} onTime={setNow} />
      {beats.length > 0 && (
        <Board
          label={`${film.title}: the story in ${beats.length} moments`}
          beats={beats}
          now={now}
          play={(t) => seek.current?.(t)}
          thumbs={THUMBS.has(film.id)}
        />
      )}
    </div>
  );
}

// The narrated walkthrough is 32 minutes, so its storyboard is the portfolio's own chapters, each at the moment the
// narration reaches it, with the product lines inside it as moments of their own. A bar above the index draws the
// film as its chapters, each as wide as it runs, and fills the one playing.
//
// Each chapter carries the figures printed on its opening slide (slides 1, 7, 24, 31, 63, 74 and 97), not the
// narration, which spells numbers out for the voice ("seven hundred and sixty-two crore").
const CHAPTER_COPY: Record<number, { figs: string[]; line: string }> = {
  1: {
    figs: ['15 SKUs', 'One chip', 'SoC2 · 28\u00a0nm'],
    line: 'Every product in the plan: what it is, how it runs on the shared silicon, who buys it and what it contributes.',
  },
  7: {
    figs: ['₹762 Cr', '67.5% of FY2032', '3 SKUs'],
    line: 'Three kits on one chip: where the mandate acts, and where the concentration risk sits.',
  },
  24: {
    figs: ['11 inputs', '1 compute product'],
    line: 'Seven RGB cameras, two thermal cameras and two radars converge on the in-cab processor.',
  },
  31: {
    figs: ['₹194 Cr', '17.2% of FY2032', '5 SKUs'],
    line: 'Selling the chip, not the vehicle: the highest margins in the plan, with no installation to fund.',
  },
  63: {
    figs: ['₹88.7 Cr', '7.9% of FY2032', '2 SKUs'],
    line: 'The highest revenue per unit in the portfolio: selling the work the product does.',
  },
  74: {
    figs: ['₹83.5 Cr', '7.4% of FY2032', '5 SKUs'],
    line: 'Capability, channel and a second cycle: sensors for where cameras fail, and robotics on the same silicon.',
  },
  97: {
    figs: [],
    line: 'What the fifteen do together: concentration, sequencing, operating domains, the margin ladder and demand headroom.',
  },
};
const toMaster = relations.edges as Record<
  string,
  Record<string, { t?: number }>
>;
const slideAt = (n: number) => toMaster['slide:' + n]?.['film:master']?.t;
const firstSentence = (s: string) =>
  (s.match(/^.*?[.!?](\s|$)/)?.[0] || s).trim();
const seconds = (len: string) =>
  len.split(':').reduce((a, x) => a * 60 + Number(x), 0);

export function WalkthroughFilm({
  film,
  startAt = 0,
}: {
  film: Film;
  startAt?: number;
}) {
  const seek = useRef<((t: number) => void) | null>(null);
  const [now, setNow] = useState(-1);
  const total = seconds(film.length);
  const chapters = deckChapters.map(([start, title], i) => {
    const end =
      i + 1 < deckChapters.length
        ? deckChapters[i + 1][0] - 1
        : slideNotes.length;
    let n = start;
    while (n <= end && slideAt(n) == null) n++;
    const lines = products
      .filter((p) => p.slideNum >= start && p.slideNum <= end)
      .map((p) => ({ id: p.id, name: p.name, t: slideAt(p.slideNum) }))
      .filter((p): p is { id: string; name: string; t: number } => p.t != null)
      .sort((a, b) => a.t - b.t);
    return {
      start,
      title,
      t: slideAt(n) ?? 0,
      copy: CHAPTER_COPY[start] ?? {
        figs: [],
        line: firstSentence(slideNotes[start - 1].script),
      },
      lines,
    };
  });
  const spans = chapters.map((c, i) => ({
    t: c.t,
    len: (i + 1 < chapters.length ? chapters[i + 1].t : total) - c.t,
  }));
  const active = chapters.reduce((a, c, i) => (now >= c.t ? i : a), -1);
  const play = (t: number) => seek.current?.(t);
  return (
    <div className="story-film is-walkthrough">
      <Player film={film} startAt={startAt} seek={seek} onTime={setNow} />
      <div className="wt-bar" role="group" aria-label="The walkthrough by chapter, sized by running time">
        {chapters.map((c, i) => {
          const fill =
            i < active
              ? 1
              : i === active
                ? Math.min(1, (now - spans[i].t) / spans[i].len)
                : 0;
          return (
            <button
              key={c.start}
              type="button"
              style={{ flexGrow: spans[i].len }}
              className={i === active ? 'is-active' : undefined}
              onClick={() => play(c.t)}
              aria-label={`Play from ${clock(c.t)}: ${c.title}`}
              title={`${c.title} · ${clock(c.t)}`}
            >
              <i style={{ transform: `scaleX(${fill})` }} aria-hidden="true" />
              <span className="num">{clock(c.t)}</span>
              <strong>{c.title}</strong>
            </button>
          );
        })}
      </div>
      <ol
        className="storyboard is-chapters"
        tabIndex={0}
        aria-label="The walkthrough, chapter by chapter"
      >
        {chapters.map((c, i) => (
          <li key={c.start} aria-current={i === active ? 'step' : undefined}>
            <button
              type="button"
              onClick={() => play(c.t)}
              aria-label={`Play from ${clock(c.t)}: ${c.title}`}
            >
              <span className="sb-time num">{clock(c.t)}</span>
              <strong>{c.title}</strong>
            </button>
            <p>{c.copy.line}</p>
            {c.copy.figs.length > 0 && (
              <ul className="sb-figs" aria-label={`${c.title}: figures from slide ${c.start}`}>
                {c.copy.figs.map((f) => (
                  <li key={f} className="num">
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {c.lines.length > 0 && (
              <ul
                className="sb-lines"
                aria-label={`${c.title}: product lines in this chapter`}
              >
                {c.lines.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => play(l.t)}
                      aria-label={`Play from ${clock(l.t)}: ${l.name}`}
                    >
                      {l.name} <span className="num">{clock(l.t)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
