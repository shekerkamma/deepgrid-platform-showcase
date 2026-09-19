'use client';
import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SectionHead, products } from '../shared';
import slideNotes from '../slide-notes.json';

// Slide deck: the original 104-slide portfolio presentation. Arrow keys and a swipe step through
// it, a filmstrip shows the current chapter, the next slide is preloaded, and the source .pptx
// downloads from this site.

const TOTAL = 104;
export const deckChapters = [
  [1, 'Overview'],
  [7, 'Road autonomy'],
  [24, 'Frame budget & sensors'],
  [31, 'Silicon & compute'],
  [49, 'Fleet & mobility'],
  [66, 'Sensors & robotics'],
  [97, 'Portfolio economics'],
] as const;
const file = (n: number) => 'slide_' + String(n).padStart(2, '0');

export default function Deck({
  slide,
  setSlide,
}: {
  slide: number;
  setSlide: (n: number) => void;
}) {
  const ci = deckChapters.reduce((a, [n], i) => (slide >= n ? i : a), 0),
    [start, chapterTitle] = deckChapters[ci],
    end = ci === deckChapters.length - 1 ? TOTAL : deckChapters[ci + 1][0] - 1;
  const stage = useRef<HTMLDivElement>(null),
    strip = useRef<HTMLOListElement>(null);

  // arrow keys anywhere on the page, unless the reader is typing in a field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest('input, textarea, select, [role=slider], [contenteditable]')
      )
        return;
      if (e.key === 'ArrowRight' && slide < TOTAL) setSlide(slide + 1);
      else if (e.key === 'ArrowLeft' && slide > 1) setSlide(slide - 1);
      else return;
      e.preventDefault();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [slide, setSlide]);

  // a horizontal swipe on the slide
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let x0 = 0,
      y0 = 0;
    const down = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const up = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x0,
        dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
      if (dx < 0 && slide < TOTAL) setSlide(slide + 1);
      if (dx > 0 && slide > 1) setSlide(slide - 1);
    };
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchend', up, { passive: true });
    return () => {
      el.removeEventListener('touchstart', down);
      el.removeEventListener('touchend', up);
    };
  }, [slide, setSlide]);

  // keep the current thumbnail in view inside the strip, without moving the page
  useEffect(() => {
    const s = strip.current,
      cur = s?.querySelector<HTMLElement>('[aria-current="true"]');
    if (s && cur)
      s.scrollTo({
        left: cur.offsetLeft - s.clientWidth / 2 + cur.clientWidth / 2,
        behavior: 'instant',
      });
  }, [slide]);

  // preload the next slide so stepping forward never waits
  useEffect(() => {
    if (slide < TOTAL) new Image().src = './slides/' + file(slide + 1) + '.png';
  }, [slide]);

  const note = slideNotes[slide - 1];
  return (
    <section className="page-wrap">
      <SectionHead
        title="The 104-slide portfolio"
        copy="The original management presentation, slide by slide, with the narration for each. Use the arrow keys or swipe to step through it."
      />
      <div className="mobile-picker deck-picker">
        <Select
          value={String(start)}
          onValueChange={(v) => setSlide(Number(v))}
        >
          <SelectTrigger aria-label="Presentation chapter">
            <SelectValue>{chapterTitle}</SelectValue>
          </SelectTrigger>
          <SelectContent className="ux-select-menu">
            {deckChapters.map(([n, title]) => (
              <SelectItem key={n} value={String(n)}>
                {title} · slide {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav className="deck-chapters" aria-label="Presentation chapters">
        {deckChapters.map(([n, title], i) => (
          <button
            key={n}
            aria-current={i === ci ? 'true' : undefined}
            className={i === ci ? 'active' : ''}
            onClick={() => setSlide(n)}
          >
            {title}
            <small className="num">
              {n}–
              {i === deckChapters.length - 1
                ? TOTAL
                : deckChapters[i + 1][0] - 1}
            </small>
          </button>
        ))}
      </nav>
      <div className="deck-layout">
        <div className="deck-main">
          <div className="deck-stage" ref={stage}>
            <img
              key={slide}
              src={'./slides/' + file(slide) + '.png'}
              alt={'Slide ' + slide + ': ' + note.title}
              width={1136}
              height={635}
            />
          </div>
          <div className="deck-controls">
            <button
              aria-label="Previous slide"
              disabled={slide === 1}
              onClick={() => setSlide(slide - 1)}
            >
              <ArrowLeft size={19} />
            </button>
            <p className="slide-number num" aria-live="polite">
              Slide {slide} of {TOTAL}
            </p>
            <Slider
              value={[slide]}
              min={1}
              max={TOTAL}
              step={1}
              onValueChange={(v) => setSlide(Array.isArray(v) ? v[0] : v)}
              aria-label="Slide number"
            />
            <button
              aria-label="Next slide"
              disabled={slide === TOTAL}
              onClick={() => setSlide(slide + 1)}
            >
              <ArrowRight size={19} />
            </button>
          </div>
          <ol
            className="deck-strip"
            ref={strip}
            aria-label={chapterTitle + ', slides ' + start + ' to ' + end}
          >
            {Array.from({ length: end - start + 1 }, (_, k) => start + k).map(
              (n) => (
                <li key={n}>
                  <button
                    aria-current={n === slide ? 'true' : undefined}
                    aria-label={'Slide ' + n}
                    onClick={() => setSlide(n)}
                  >
                    <img
                      src={'./slides/thumbs/' + file(n) + '.webp'}
                      alt=""
                      width={240}
                      height={134}
                      loading="lazy"
                    />
                    <span className="num">{n}</span>
                  </button>
                </li>
              ),
            )}
          </ol>
        </div>
        <aside className="deck-index" aria-labelledby="deck-index-title">
          <h2 id="deck-index-title">Jump to a product</h2>
          <div className="deck-index-list">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setSlide(p.slideNum)}
                aria-current={slide === p.slideNum ? 'true' : undefined}
              >
                <span className="num">
                  {String(p.slideNum).padStart(2, '0')}
                </span>
                {p.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
      <section className="slide-commentary" aria-live="polite">
        <h2>{note.title}</h2>
        <p>{note.script}</p>
        <details>
          <summary>Source notes and model references</summary>
          <p>{note.notes}</p>
        </details>
      </section>
      <div className="deck-footer">
        <p className="disclaimer">
          Original management presentation. Figures and claims keep their
          original context.
        </p>
        <div className="deck-actions">
          <a
            className="primary"
            href="./downloads/showcase/deepgrid-product-portfolio-104-slides.pptx"
            download
          >
            Download the deck <Download size={17} aria-hidden="true" />
            <small className="num">PPTX · 56 MB</small>
          </a>
          <a
            className="text-link"
            href="https://docs.google.com/presentation/d/1qpq13INORqRjcYna1MQa_NMeorkAW_gk/edit"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Slides <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
