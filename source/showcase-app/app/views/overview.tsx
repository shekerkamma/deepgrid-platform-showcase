'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Play } from 'lucide-react';
import Silicon from '../silicon';
import { domains, productById, type Go } from '../shared';
import {
  lawRows,
  lawEvents,
  siliconEvents,
  gap,
  bridgeFrom,
  clockEnd,
  proof,
} from '../data/overview';

// The Overview reads as a memorandum in six chapters: what DeepGrid is, why the demand is law,
// one die under six businesses, the two clocks (the page's peak), what already runs, and the ask.

export default function Overview({
  navigate,
  go,
  reduced,
}: {
  navigate: (v: string) => void;
  go: Go;
  reduced: boolean;
}) {
  const [domain, setDomain] = useState(0);
  return (
    <>
      <section className="hero ov-hero">
        <img
          className="hero-image"
          src="./images/semiconductor-hero.png"
          alt="Rendering of the DeepGrid SoC2 package with six compute domains"
          width={1536}
          height={1024}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>
            One silicon.
            <br />
            <em>Infinite</em> possibilities.
          </h1>
          <p className="ov-lede">
            DeepGrid designs the chip under its own autonomous systems. One
            28&nbsp;nm die carries fifteen products across trucks, fleets,
            defence and sensing, built in Hyderabad for a market India has
            written into law.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate('investment')}>
              See the investment case <ArrowUpRight size={18} />
            </button>
            <button className="text-button" onClick={() => navigate('film')}>
              <span className="play-circle">
                <Play size={12} fill="currentColor" />
              </span>
              Watch the film
            </button>
          </div>
        </div>
        <p className="image-disclaimer">Architectural rendering</p>
      </section>
      <dl className="ov-figures">
        {[
          ['15', 'products on one die'],
          ['28 nm', 'TSMC process'],
          ['57 mm²', 'die area'],
          ['8.6 ms', 'sensor fusion target'],
        ].map(([v, l]) => (
          <div key={l}>
            <dt>{l}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <section className="ov-chapter ov-law" aria-labelledby="ov-law-title">
        <header className="ov-chapter-head">
          <p className="kicker">Why now</p>
          <h2 id="ov-law-title">The demand is written into law.</h2>
          <p>
            In November 2025 India made five driver-assistance systems
            compulsory on every truck and bus. Each date below is a deadline
            with a rule number behind it. None of them is a forecast.
          </p>
        </header>
        <div
          className="ov-law-table"
          role="table"
          aria-label="Compliance dates for trucks and buses (M2, M3, N2, N3)"
        >
          <div className="ov-law-row ov-law-labels" role="row">
            <span role="columnheader">System</span>
            <span role="columnheader">Standard</span>
            <span role="columnheader">New models</span>
            <span role="columnheader">Every model</span>
          </div>
          {lawRows.map((r) => (
            <div className="ov-law-row" role="row" key={r.short}>
              <span role="cell">
                <strong>{r.system}</strong>
                <small>{r.short}</small>
              </span>
              <span role="cell" className="num">
                {r.standard}
              </span>
              <span role="cell" className="num" data-label="New models">
                {r.newModels}
              </span>
              <span role="cell" className="num" data-label="Every model">
                {r.allModels}
              </span>
            </div>
          ))}
        </div>
        <p className="ov-source">
          Source: G.S.R. 834(E), 11 November 2025, as amended by G.S.R. 862(E).
          Management sizes the pool at about one million units a year: 500,000
          new vehicles and 500,000 retrofits.
        </p>
      </section>

      <section className="ov-chapter ov-die" aria-labelledby="ov-die-title">
        <div className="ov-die-stage">
          <Silicon selected={domain} exploded reduced={reduced} />
          <span className="canvas-caption">
            Drag to rotate. Conceptual layout, not a mask.
          </span>
        </div>
        <div className="ov-die-copy">
          <header className="ov-chapter-head">
            <h2 id="ov-die-title">One die. Six businesses.</h2>
            <p>
              Each compute domain on SoC2 is a product line in its own right.
              Firmware decides which ones a product switches on, so one tapeout
              serves every buyer.
            </p>
          </header>
          <ul className="ov-die-list">
            {domains.map((d, i) => (
              <li key={d.code}>
                <button
                  aria-pressed={domain === i}
                  onClick={() => setDomain(i)}
                  onMouseEnter={() => setDomain(i)}
                  onFocus={() => setDomain(i)}
                >
                  <span className="num">{d.code}</span>
                  <strong>{d.name}</strong>
                </button>
                <div className="ov-die-carries">
                  {d.carries.map((id) => {
                    const p = productById(id);
                    return p ? (
                      <a
                        key={id}
                        href={'#portfolio?product=' + id}
                        onClick={(e) => {
                          e.preventDefault();
                          go('portfolio?product=' + id);
                        }}
                      >
                        {p.name}
                      </a>
                    ) : null;
                  })}
                </div>
              </li>
            ))}
          </ul>
          <p className="ov-die-detail" aria-live="polite">
            {domains[domain].desc}
          </p>
        </div>
      </section>

      <TwoClocks reduced={reduced} />

      <section className="ov-chapter" aria-labelledby="ov-proof-title">
        <header className="ov-chapter-head">
          <h2 id="ov-proof-title">It already runs.</h2>
          <p>
            The perception stack is working on hardware today, the patents are
            filed and the shuttle is contracted. What the round buys is the step
            from a working FPGA to production silicon.
          </p>
        </header>
        <ul className="ov-proof">
          {proof.map((p) => (
            <li key={p.label}>
              <p className="ov-proof-figure">
                <CountUp to={p.figure} reduced={reduced} />
                <span>{p.unit}</span>
              </p>
              <p className="ov-proof-label">{p.label}</p>
              <p className="ov-proof-note">{p.note}</p>
            </li>
          ))}
        </ul>
        <p className="ov-source">
          Source: Information Memorandum, June 2026, section 8. Management
          figures, not independently verified.
        </p>
      </section>

      <section className="ov-close" aria-labelledby="ov-close-title">
        <h2 id="ov-close-title">
          ₹45&nbsp;Cr to take the chip from FPGA to silicon.
        </h2>
        <p>
          Equity at a ₹204&nbsp;Cr pre-money valuation for 18.07%, plus a
          ₹10&nbsp;Cr collateral-free CGTMSE facility for working capital. The
          tapeout money is released in four gates, and each gate is a point
          where the next payment can be withheld.
        </p>
        <nav className="ov-routes" aria-label="Where to go next">
          {[
            [
              'investment',
              'The investment case',
              'Round, use of funds, risks and the full record',
            ],
            [
              'portfolio',
              'The fifteen products',
              'Prices, volumes and FY2032 revenue by line',
            ],
            [
              'briefing',
              'Ask DeepGrid',
              'Questions answered from the source documents',
            ],
          ].map(([id, title, sub]) => (
            <a
              key={id}
              href={'#' + id}
              onClick={(e) => {
                e.preventDefault();
                navigate(id);
              }}
            >
              <strong>{title}</strong>
              <span>{sub}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}

// Counts up once when it first scrolls into view. The final figure is in the markup from the
// start, so a reader without scripts, a screen reader and a print all get the real number.
function CountUp({ to, reduced }: { to: string; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const target = parseFloat(to),
      decimals = to.includes('.') ? to.split('.')[1].length : 0;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 900),
            eased = 1 - Math.pow(1 - k, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduced]);
  return (
    <span ref={ref} className="num">
      {to}
    </span>
  );
}

// The peak. Two timelines on one axis: when the law takes effect and when the chip is qualified.
// Scrolling moves a playhead from November 2025 to July 2028. The gap opens where the law is in
// force and the ASIC is not yet qualified, and the FPGA product fills it. On a phone or under
// reduced motion there is no pin: the chapter shows its final state, laid out vertically.
function TwoClocks({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false),
    [narrow, setNarrow] = useState(false);
  const [p, setP] = useState(1);
  useEffect(() => {
    const q = matchMedia('(min-width: 900px) and (min-height: 620px)'),
      n = matchMedia('(max-width: 899px)');
    const update = () => {
      setPinned(q.matches && !reduced);
      setNarrow(n.matches);
    };
    update();
    q.addEventListener('change', update);
    n.addEventListener('change', update);
    return () => {
      q.removeEventListener('change', update);
      n.removeEventListener('change', update);
    };
  }, [reduced]);
  useEffect(() => {
    if (!pinned) {
      setP(1);
      return;
    }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect(),
        stage = el.firstElementChild as HTMLElement,
        span = r.height - stage.offsetHeight;
      const top =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--nav-h',
          ),
        ) || 0;
      setP(Math.min(1, Math.max(0, (top - r.top) / Math.max(1, span))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  // 0 to 0.8 of the scroll moves the playhead across the axis; the last 0.2 lays the bridge.
  const head = Math.min(1, p / 0.8) * clockEnd,
    bridge = Math.max(0, Math.min(1, (p - 0.8) / 0.18));
  const pct = (m: number) => (m / clockEnd) * 100 + '%';
  const gapTo = Math.min(head, gap.to);
  const phase = bridge > 0 ? 2 : head >= gap.from ? 1 : 0;
  const captions = [
    'The law came first. The rules were notified in November 2025, with the first deadline fourteen months out.',
    'From January 2027 the law is in force. Qualified 28 nm silicon is planned for the first half of 2028.',
    'The FPGA product fills the gap. It ships from Q3 2026, earns while the ASIC is qualified, and runs the same software.',
  ];
  return (
    <section
      ref={ref}
      className={'ov-clocks' + (pinned ? ' is-pinned' : '')}
      aria-labelledby="ov-clocks-title"
    >
      <div className="ov-clocks-stage">
        <header className="ov-clocks-head">
          <h2 id="ov-clocks-title">Two clocks.</h2>
          <p aria-live="polite">{captions[phase]}</p>
        </header>
        {narrow ? (
          <ol className="ov-clocks-list">
            {[
              ...lawEvents.map((e) => ({ ...e, tone: 'law', lane: 'The law' })),
              ...siliconEvents.map((e) => ({
                ...e,
                tone: 'chip',
                lane: 'The silicon',
              })),
            ]
              .sort((x, y) => x.at - y.at)
              .map((e) => (
                <li
                  key={e.lane + e.when}
                  className={
                    'ov-tone-' +
                    e.tone +
                    (e.at >= gap.from && e.at <= gap.to ? ' in-gap' : '')
                  }
                >
                  <span className="ov-clocks-lane">{e.lane}</span>
                  <time className="num">{e.when}</time>
                  <span>{e.what}</span>
                </li>
              ))}
          </ol>
        ) : (
          <div className="ov-clocks-chart">
            <div className="ov-axis" aria-hidden="true">
              {[
                [0, '2026', 2],
                [0, '2027', 14],
                [0, '2028', 26],
              ].map(([, y, m]) => (
                <span key={y} style={{ ['--at' as string]: pct(m as number) }}>
                  {y}
                </span>
              ))}
            </div>
            <div
              className="ov-gap"
              aria-hidden="true"
              style={{
                ['--from' as string]: pct(gap.from),
                ['--to' as string]: pct(Math.max(gap.from, gapTo)),
                opacity: head >= gap.from ? 1 : 0,
              }}
            >
              <span>Law in force. ASIC not yet qualified.</span>
            </div>
            <Lane
              title="The law"
              events={lawEvents}
              head={head}
              pct={pct}
              tone="law"
            />
            <Lane
              title="The silicon"
              events={siliconEvents}
              head={head}
              pct={pct}
              tone="chip"
            >
              <div
                className="ov-bridge"
                style={{
                  ['--from' as string]: pct(bridgeFrom),
                  ['--to' as string]: pct(gap.to),
                  ['--k' as string]: String(bridge),
                }}
              >
                <span>FPGA module carries the mandate</span>
              </div>
            </Lane>
            <div
              className="ov-playhead"
              aria-hidden="true"
              style={{
                ['--at' as string]: pct(head),
                opacity: pinned && p < 1 ? 1 : 0,
              }}
            />
          </div>
        )}
        <p className="ov-source">
          Law: G.S.R. 834(E) and 862(E). Silicon: Information Memorandum, June
          2026, sections 8 and 12. Silicon dates are management plans.
        </p>
      </div>
    </section>
  );
}

function Lane({
  title,
  events,
  head,
  pct,
  tone,
  children,
}: {
  title: string;
  events: { at: number; when: string; what: string }[];
  head: number;
  pct: (m: number) => string;
  tone: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={'ov-lane ov-lane-' + tone}>
      <h3>{title}</h3>
      <ol>
        {events.map((e) => (
          <li
            key={e.when}
            className={
              (head >= e.at ? 'is-on' : '') +
              (e.at / clockEnd > 0.75 ? ' is-end' : '')
            }
            style={{ ['--at' as string]: pct(e.at) }}
          >
            <time className="num">{e.when}</time>
            <span>{e.what}</span>
          </li>
        ))}
      </ol>
      {children}
    </div>
  );
}
