import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'var(--surface-sunk)',
      borderTop: '1px solid var(--rule-strong)',
      padding: '48px 0 32px',
      marginTop: '64px',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '32px',
        marginBottom: '32px',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
            DEEPGRID <span style={{ color: 'var(--copper)' }}>SEMI</span>
          </div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
            TSMC 28nm Monolithic SoC2 Platform · 15 SKUs Across 4 Platform Surfaces · Mandatory Compliance Grounded
          </p>
        </div>

        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '.12em', display: 'block', marginBottom: '12px' }}>
            Primary Platform Surfaces
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', fontFamily: 'var(--mono)' }}>
            <span style={{ color: 'var(--ink-mid)' }}>01 · Road Autonomy (67.5% · ₹762 Cr)</span>
            <span style={{ color: 'var(--ink-mid)' }}>02 · Silicon & Compute (17.2% · ₹194 Cr)</span>
            <span style={{ color: 'var(--ink-mid)' }}>03 · Fleet & Mobility (7.9% · ₹89 Cr)</span>
            <span style={{ color: 'var(--ink-mid)' }}>04 · Sensors & Robotics (7.4% · ₹84 Cr)</span>
          </div>
        </div>

        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '.12em', display: 'block', marginBottom: '12px' }}>
            Diligence & Verification
          </span>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <a
                href="https://docs.google.com/presentation/d/1qpq13INORqRjcYna1MQa_NMeorkAW_gk/edit?usp=drive_link&ouid=115548929596003673495&rtpof=true&sd=true"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--copper)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--mono)' }}
              >
                104-Slide Master Google Presentation ↗
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/1pVlhAll8U9Y2N2pW-WG-Lm6N9R3CRm10/view?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--copper)', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--mono)' }}
              >
                32-Minute Video Walkthrough (Drive) ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '24px 24px 0',
        borderTop: '1px solid var(--rule)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        color: 'var(--ink-muted)',
        fontSize: '11px',
        fontFamily: 'var(--mono)',
      }}>
        <span>&copy; {new Date().getFullYear()} DeepGrid Semi. All figures are management projections prepared for fundraising.</span>
      </div>
    </footer>
  );
};
