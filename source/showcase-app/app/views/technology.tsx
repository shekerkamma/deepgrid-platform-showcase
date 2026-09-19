'use client';
import { useState } from 'react';
import { Layers } from 'lucide-react';
import Silicon from '../silicon';
import { SectionHead, domains, productById, type Go } from '../shared';

// Technology: the die, its six domains, the headline specifications and the frame budget.
// Selecting a domain highlights it on the 3D model. The frame budget replaces a static list of
// arrows: it shows the one timing the materials state (8.6 ms of fusion in a 33.3 ms frame) and
// what the rest of the frame is left for.

const FRAME = 33.3,
  FUSION = 8.6;
const channels = [
  ['7', 'RGB cameras', 'road, sides, dashcam, driver, rear'],
  ['2', 'thermal cameras', 'left and right towers'],
  ['2', '4D radar', '77 GHz, front and rear'],
];

export default function Technology({
  reduced,
  go,
}: {
  reduced: boolean;
  go: Go;
}) {
  const [domain, setDomain] = useState(0),
    [exploded, setExploded] = useState(false),
    [motion, setMotion] = useState(!reduced);
  const d = domains[domain];
  return (
    <section className="page-wrap">
      <SectionHead
        title="Six compute domains on one 57 mm² die"
        copy="SoC2 is a monolithic 28 nm chip. Each domain is a block of the same silicon, and firmware decides which of them a product uses."
      />
      <div className="architecture">
        <div className="architecture-stage">
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
          <Silicon selected={domain} exploded={exploded} reduced={!motion} />
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
        <div className="domain-panel">
          <div
            className="domain-tabs"
            role="tablist"
            aria-label="Compute domains"
          >
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
            <h2>{d.name}</h2>
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
      </div>
      <dl className="spec-grid">
        {[
          ['TSMC 28 nm', 'Process'],
          ['57 mm²', 'Die area'],
          ['39.3 TOPS', 'Derived INT8 compute'],
          ['600 MHz', 'Design frequency'],
          ['11 channels', 'Sensor inputs'],
          ['8.6 ms', 'Fusion target'],
        ].map(([v, k]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd className="num">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="disclaimer">
        Architecture figures are design targets. 39.3 TOPS is derived from the
        stated compute architecture, not measured on fabricated 28 nm silicon.
      </p>

      <section className="frame-budget" aria-labelledby="fb-title">
        <header>
          <h2 id="fb-title">Eleven sensors, fused in a quarter of a frame.</h2>
          <p>
            At 30 frames a second each frame lasts 33.3 ms. The design fuses all
            eleven channels in 8.6 ms, which leaves about three quarters of the
            frame for planning, control and warnings.
          </p>
        </header>
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
          aria-label={`Frame budget: fusion ${FUSION} ms of a ${FRAME} ms frame, ${Math.round(((FRAME - FUSION) / FRAME) * 100)}% left`}
        >
          <div
            className="fb-used"
            style={{ ['--w' as string]: (FUSION / FRAME) * 100 + '%' }}
          >
            <span className="num">{FUSION} ms fusion</span>
          </div>
          <div className="fb-free">
            <span className="num">
              {(FRAME - FUSION).toFixed(1)} ms left ·{' '}
              {Math.round(((FRAME - FUSION) / FRAME) * 100)}%
            </span>
          </div>
        </div>
        <div className="fb-scale num" aria-hidden="true">
          <span>0 ms</span>
          <span>33.3 ms, one frame at 30 fps</span>
        </div>
        <figure className="fb-figure">
          <img
            src="./images/figure-06.webp"
            alt="Diagram of the 8 by 8 by 8 tensor cube: an activation slab streams through the cube, completing 512 multiply-accumulates per cycle"
            width={1300}
            height={856}
            loading="lazy"
          />
          <figcaption>
            The compute behind the budget: an 8×8×8 tensor cube completes 512
            multiply-accumulates per cycle, eight times the flat 8×8 unit.
            Diagram from the June 2026 Information Memorandum.
          </figcaption>
        </figure>
      </section>
    </section>
  );
}
