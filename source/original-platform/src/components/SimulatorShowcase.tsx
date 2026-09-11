import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const simulators = [
  { id: 'adas', name: 'ADAS Highway', url: './deck_assets/ddrive-adas-sim-v2.html', desc: 'Highway autonomy simulation.' },
  { id: 'forklift', name: 'Warehouse Forklift', url: './deck_assets/forklift-sim.html', desc: 'Indoor self-driving retrofit simulation.' },
  { id: 'yard', name: 'Seaport Yard', url: './deck_assets/yard-sim.html', desc: 'Autonomous container yard vehicle simulation.' },
  { id: 'sentinel', name: 'Sentinel Defense', url: './deck_assets/sentinel-sim.html', desc: 'Defense robotics simulation.' }
];

export const SimulatorShowcase: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal();
  const [activeSim, setActiveSim] = useState(simulators[0]);

  return (
    <section id="simulators" className="section-container">
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>Proven, Not Promised</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Interactive simulators verify each autonomy claim.
      </p>

      <div ref={ref} className={`reveal reveal-up ${isRevealed ? 'revealed' : ''}`}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {simulators.map(sim => (
            <button
              key={sim.id}
              onClick={() => setActiveSim(sim)}
              style={{
                background: activeSim.id === sim.id ? 'var(--color-primary)' : 'transparent',
                color: activeSim.id === sim.id ? '#000' : 'var(--text-primary)',
                border: '1px solid var(--color-primary)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {sim.name}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '500px', background: '#000' }}>
            <iframe
              src={activeSim.url}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={activeSim.name}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0, flex: 1, minWidth: '250px' }}>
              {activeSim.desc}
            </p>
            <button style={{
              background: 'transparent',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }} onClick={() => window.open(activeSim.url, '_blank')}>
              Launch Full Screen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
