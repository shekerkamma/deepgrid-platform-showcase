import React from 'react';

const keyMetrics = [
  { k: 'Mandate Volume', v: '1.0 M', n: 'N2/N3 commercial trucks / yr in scope' },
  { k: 'FY2032 Revenue', v: '₹1,128.5 Cr', n: '15 products from one 28nm ASIC' },
  { k: 'Gross Margin', v: '89–94%', n: '94% bare die; 89% full systems' },
  { k: 'Sensor Fusion', v: '8.6 ms', n: '11 channels fused (74% frame headroom)' },
  { k: 'Tapeout Cost', v: '$3.17 M', n: '$3.88 / die cost at volume' },
  { k: 'Breakeven', v: '175k dies', n: 'Committed only on working silicon' },
];

export const Hero: React.FC = () => {
  return (
    <div style={{ paddingTop: '50px', borderBottom: '1px solid var(--rule-strong)', paddingBottom: '36px' }}>
      <div className="mono-stamp" style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <span>DEEPGRID SEMI</span>
        <span><b>STRICTLY CONFIDENTIAL</b></span>
        <span>PRE-SERIES A</span>
        <span>AUGUST 2026</span>
      </div>

      <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '18px', maxWidth: '18ch' }}>
        One Die, Fifteen Products
      </h1>

      <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--ink-mid)', lineHeight: 1.5, maxWidth: '64ch', margin: '0 0 24px' }}>
        A single 28 nm ASIC die — SoC2 — powering India's autonomous vehicle ecosystem.
        Every SKU runs the same silicon under different firmware: one tapeout, not fifteen independent product bets.
      </p>

      {/* Figures Grid */}
      <div className="figures-grid">
        {keyMetrics.map((m, i) => (
          <div key={i} className="fig-cell">
            <span className="k">{m.k}</span>
            <span className="v">{m.v}</span>
            <span className="n">{m.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
