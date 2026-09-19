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

// The narrated walkthrough is 32 minutes, so its storyboard is the portfolio's own chapters: each opens on its first
// slide at the moment the narration reaches it, with the product lines inside it as moments of their own.
const toMaster = relations.edges as Record<
  string,
  Record<string, { t?: number }>
>;
const slideAt = (n: number) => toMaster['slide:' + n]?.['film:master']?.t;
const firstSentence = (s: string) =>
  (s.match(/^.*?[.!?](\s|$)/)?.[0] || s).trim();

export function WalkthroughFilm({
  film,
  startAt = 0,
}: {
  film: Film;
  startAt?: number;
}) {
  const seek = useRef<((t: number) => void) | null>(null);
  const [now, setNow] = useState(-1);
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
      .filter((p): p is { id: string; name: string; t: number } => p.t != null);
    return {
      start,
      title,
      t: slideAt(n) ?? 0,
      text: firstSentence(slideNotes[start - 1].script),
      lines,
    };
  });
  const active = chapters.reduce((a, c, i) => (now >= c.t ? i : a), -1);
  const play = (t: number) => seek.current?.(t);
  return (
    <div className="story-film is-walkthrough">
      <Player film={film} startAt={startAt} seek={seek} onTime={setNow} />
      <ol
        className="storyboard has-thumbs is-chapters"
        aria-label="The walkthrough, chapter by chapter"
      >
        {chapters.map((c, i) => (
          <li key={c.start} aria-current={i === active ? 'step' : undefined}>
            <button
              type="button"
              onClick={() => play(c.t)}
              aria-label={`Play from ${clock(c.t)}: ${c.title}`}
            >
              <img
                src={`./slides/thumbs/slide_${String(c.start).padStart(2, '0')}.webp`}
                width={240}
                height={134}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span className="sb-time num">{clock(c.t)}</span>
              <strong>{c.title}</strong>
            </button>
            <p>{c.text}</p>
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
