import React from 'react';

const gatedStages = [
  { no: '01', title: 'Block Prototypes', desc: 'Compute and 4D radar DSP blocks verified on shared multi-project wafer.', cost: '$420k' },
  { no: '02', title: 'Full-Die Prototype', desc: '57 mm² monolithic device taped out on shared wafer for full system qualification.', cost: '$850k' },
  { no: '03', title: 'Backend to GDSII', desc: 'Physical design, timing closure, power analysis, and sign-off.', cost: '$650k' },
  { no: '04', title: 'Production Mask Set', desc: 'Committed only once working silicon exists and ARAI homologation is clear.', cost: '$1.25M' },
];

const mandateMilestones = [
  { date: 'MAR 2025', rule: 'Rule Notified', detail: 'MoRTH GSR 184(E) notified setting ADAS obligation for all N2/N3 commercial vehicles.' },
  { date: 'APR 2026', rule: 'New Vehicle Models', detail: 'Driver-drowsiness, blind-spot, and lane-departure warnings mandatory for new vehicle registrations.' },
  { date: 'OCT 2026', rule: 'Existing In-Service Fleet', detail: 'Compliance obligation extends to existing commercial fleet retrofits (~0.5M vehicles/yr).' },
  { date: 'OCT 2027', rule: 'Emergency Braking (AEBS)', detail: 'Advanced emergency braking requirement on independent homologation schedule.' },
];

export const InvestmentThesis: React.FC = () => {
  return (
    <div className="content-section">
      <span className="eyebrow-tag">INVESTMENT THESIS & GATED CAPITAL</span>
      <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>A Mandate-Driven Demand Floor</h2>
      <p style={{ color: 'var(--ink-mid)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '68ch' }}>
        The buying decision is legislated, not discretionary. A mandated purchase removes the hardest question in hardware — whether the fleet operator will pay for safety.
      </p>

      {/* Mandate timeline */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '22px 24px', marginBottom: '32px' }}>
        <span className="mono-stamp" style={{ color: 'var(--copper)', display: 'block', marginBottom: '14px' }}>
          REGULATORY TIMETABLE (GSR 184(E))
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {mandateMilestones.map((m, i) => (
            <div key={i} style={{ borderLeft: '2px solid var(--copper)', paddingLeft: '12px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--copper)', fontWeight: 500 }}>{m.date}</span>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', margin: '2px 0 4px' }}>{m.rule}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.4 }}>{m.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gated execution list */}
      <div style={{ marginBottom: '32px' }}>
        <span className="mono-stamp" style={{ color: 'var(--copper)', display: 'block', marginBottom: '14px' }}>
          GATED PROGRAMME CAPITAL DEPLOYMENT ($3.17M TOTAL)
        </span>
        <div style={{ borderTop: '1px solid var(--rule)' }}>
          {gatedStages.map((g, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--rule)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--copper)', fontWeight: 500 }}>{g.no}</span>
              <div>
                <b style={{ color: 'var(--ink)', fontSize: '15px' }}>{g.title}</b>
                <div style={{ color: 'var(--ink-mid)', fontSize: '13.5px', marginTop: '2px' }}>{g.desc}</div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>{g.cost}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Quote Banner */}
      <div style={{ borderLeft: '3px solid var(--copper)', background: 'var(--surface-sunk)', padding: '20px 24px', margin: '24px 0' }}>
        <blockquote style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', lineHeight: 1.4, color: 'var(--ink)', margin: 0 }}>
          "The production mask — the largest single capital commitment — is only paid for once working silicon exists."
        </blockquote>
      </div>
    </div>
  );
};
