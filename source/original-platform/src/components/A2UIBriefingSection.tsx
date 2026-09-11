import React, { useEffect, useRef, useState } from 'react';
import { MessageProcessor, type A2uiMessage } from '@a2ui/web_core/v0_9';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { deepgridCatalog } from '../a2ui/catalog';
import { buildAnswer } from '../a2ui/engine';

interface Turn {
  q: string;
  surfaceId: string;
  raw: A2uiMessage[];
}

const SUGGESTIONS = [
  'What is the verdict on the portfolio?',
  'Smart Truck (AD2 kit) Signal Chain & Build',
  'AD0 Smart Mirror Unit Economics',
  'AD1 Indoor L4 Forklift Simulator',
  'Show the 15-SKU Portfolio Map',
  'SoC2 28nm Monolithic Silicon Spec',
  'MoRTH GSR 184(E) Mandate Timeline',
  'Chipset OEM Bare Die (₹18k)',
  'Autonomous TaaS (₹66L / unit)',
  'Seaport AGV & Vizag Order',
  'A100 Compute Box (3 SKUs)',
  'Defence D-HUMR Sentinel Kit',
  '4D Radar Pod & Thermal Camera',
  'Show Slide 19',
];

export const A2UIBriefingSection: React.FC = () => {
  const [processor] = useState(() => new MessageProcessor([deepgridCatalog]));
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [activeChip, setActiveChip] = useState('Smart Truck (AD2 kit) Signal Chain & Build');
  const counter = useRef(0);
  const seeded = useRef(false);

  // Synchronously execute query into A2UI processor and state
  const executeQuery = async (q: string) => {
    if (!q.trim()) return;
    const surfaceId = `s-${counter.current++}`;
    
    // Generate declarative A2UI JSON payload
    const raw = await buildAnswer(q, surfaceId);
    
    // Process messages through A2UI message processor
    processor.processMessages(raw);
    
    // Add turn to conversation history
    setTurns((prev) => [{ q, surfaceId, raw }, ...prev]);
    setActiveChip(q);
    setInput('');
  };

  // Seed on mount
  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      executeQuery('Smart Truck (AD2 kit) Signal Chain & Build');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeQuery(input.trim());
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 0 30px' }}>
      {/* Editorial Header Panel */}
      <div style={{ border: '1px solid var(--rule)', background: 'var(--surface)', padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
          <div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--copper)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              INTERACTIVE AGENT DOSSIER
            </span>
            <h3 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--ink)', fontWeight: 500 }}>
              104-Slide Master Walkthrough & Dynamic Component Engine
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--green)', background: 'var(--green-subtle)', border: '1px solid var(--green)', padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>
              ● RETRIEVAL · CITED · NO MODEL CALLED
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--ink-mid)', fontSize: '13.5px', margin: '0 0 20px', maxWidth: '82ch', lineHeight: 1.55 }}>
          Select a verified query chip for a structured component surface (signal chains, unit economics, frame budgets, statutory demand schedules), or ask anything else. Open questions are answered by deterministic retrieval across the investor memorandum, all 104 master-deck slides, the authored video narration and the competitive dossier. Every answer cites its source, and the agent says so when the corpus does not cover the question rather than composing one.
        </p>

        {/* Suggested Query Buttons Grid */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '8px' }}>
            Verified Query Shortcuts:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTIONS.map((s) => {
              const isSelected = activeChip === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => executeQuery(s)}
                  style={{
                    background: isSelected ? 'var(--copper-fill)' : 'var(--surface-sunk)',
                    color: isSelected ? '#FFF7F0' : 'var(--ink-mid)',
                    border: isSelected ? '1px solid var(--copper)' : '1px solid var(--rule)',
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--mono)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all .12s ease',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = 'var(--ink)';
                      e.currentTarget.style.borderColor = 'var(--rule-strong)';
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = 'var(--ink-mid)';
                      e.currentTarget.style.borderColor = 'var(--rule)';
                      e.currentTarget.style.background = 'var(--surface-sunk)';
                    }
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Query Form Composer */}
        <form onSubmit={handleSubmit} className="ask-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            aria-label="Ask the DeepGrid briefing agent"
            placeholder="Ask about a slide, a SKU, the silicon, the mandate — or a diligence question: risks, competitors, what happens if the tapeout slips…"
            className="ask-input"
            style={{
              background: 'var(--surface-sunk)',
              border: '1px solid var(--rule)',
              color: 'var(--ink)',
              padding: '11px 14px',
              fontSize: '13.5px',
              fontFamily: 'var(--sans)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            className="ask-btn"
            style={{
              background: 'var(--copper-fill)',
              color: '#FFF7F0',
              fontFamily: 'var(--mono)',
              fontWeight: 500,
              border: '1px solid var(--copper)',
              padding: '0 20px',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Ask Dossier
          </button>
        </form>
      </div>

      {/* Multi-turn Conversation Thread */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {turns.map((t) => {
          const surface = processor.model.surfacesMap.get(t.surfaceId);
          return (
            <div key={t.surfaceId} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* User Question Header Box */}
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--surface-sunk)',
                  borderLeft: '3px solid var(--copper)',
                  border: '1px solid var(--rule)',
                  borderLeftWidth: '3px',
                  color: 'var(--ink)',
                  fontFamily: 'var(--mono)',
                  fontWeight: 500,
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--copper)', fontSize: '11px', textTransform: 'uppercase' }}>QUERY:</span>
                <span>{t.q}</span>
              </div>

              {/* Dynamic A2UI Rendered Surface */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {surface ? (
                  <A2uiSurface surface={surface} />
                ) : (
                  <div style={{ color: 'var(--ink-muted)', fontStyle: 'italic', padding: '6px 2px', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                    Preparing the answer…
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
