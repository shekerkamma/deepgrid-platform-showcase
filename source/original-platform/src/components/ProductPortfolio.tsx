import React, { useState } from 'react';
import { products, Product } from '../data/products';

export const ProductPortfolio: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ ad2: true, ad0: true });

  const toggleOpen = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { title: 'Road Autonomy', share: '67.5% · ₹762 Cr', count: '3 SKUs' },
    { title: 'Silicon & Compute', share: '17.2% · ₹194 Cr', count: '5 SKUs' },
    { title: 'Fleet & Mobility', share: '7.9% · ₹89 Cr', count: '2 SKUs' },
    { title: 'Sensors & Robotics', share: '7.4% · ₹84 Cr', count: '5 SKUs' },
  ];

  return (
    <div className="content-section">
      <span className="eyebrow-tag">PORTFOLIO ARCHITECTURE</span>
      <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>Fifteen SKUs Across Four Platform Surfaces</h2>
      <p style={{ color: 'var(--ink-mid)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '68ch' }}>
        Every SKU runs the same SoC2 silicon under different firmware. Prices are held flat across six years — growth comes from volume, not price.
      </p>

      {/* Surface summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--rule)', border: '1px solid var(--rule)', marginBottom: '32px' }}>
        {categories.map((c, i) => (
          <div key={i} style={{ background: 'var(--surface)', padding: '16px 18px' }}>
            <span className="mono-stamp" style={{ color: 'var(--copper)', display: 'block', marginBottom: '4px' }}>{c.title}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem', color: 'var(--ink)', fontWeight: 500, display: 'block' }}>{c.share}</span>
            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{c.count}</span>
          </div>
        ))}
      </div>

      {/* Accordion Product List */}
      <div>
        {products.map(p => {
          const isOpen = !!openIds[p.id];
          return (
            <div key={p.id} className="uc-accordion">
              <div className="uc-accordion-summary" onClick={() => toggleOpen(p.id)}>
                <span className="sid">{p.slideTitle.split(' ')[0]}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '12px' }}>
                  <span className="stitle">{p.name}</span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--copper)', fontWeight: 500 }}>{p.price}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-muted)' }}>{p.revenue}</span>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', color: 'var(--ink-muted)' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </div>

              {isOpen && (
                <div className="uc-accordion-body">
                  <p style={{ color: 'var(--ink)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {p.description}
                  </p>

                  {/* Product Simulation Video Preview if available */}
                  {(p.id === 'ad2' || p.id === 'ad0' || p.id === 'ad1' || p.id === 'dhumr' || p.id === 'agv' || p.id === 'chipset') && (
                    <div style={{ marginBottom: '18px', maxWidth: '640px' }}>
                      <div className="case-video-box" style={{ marginBottom: '8px' }}>
                        <video 
                          src={p.id === 'ad2' ? './media/truck.mp4' : p.id === 'ad0' ? './media/ddrive.mp4' : p.id === 'ad1' ? './media/forklift.mp4' : p.id === 'agv' ? './media/yard.mp4' : p.id === 'dhumr' ? './media/sentinel.mp4' : './media/cube.mp4'} 
                          poster={p.id === 'ad2' ? './media/truck-poster.png' : p.id === 'ad0' ? './media/ddrive-poster.png' : p.id === 'ad1' ? './media/forklift-poster.png' : p.id === 'agv' ? './media/yard-poster.png' : p.id === 'dhumr' ? './media/sentinel-poster.png' : './media/cube-poster.png'} 
                          controls 
                          preload="metadata" 
                          playsInline 
                          style={{ width: '100%', borderRadius: '6px', background: '#000', display: 'block' }}
                        />
                        <div className="case-video-overlay">
                          <div className="play-btn-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
                          <span className="play-btn-label">Play {p.name} Simulation Video</span>
                        </div>
                        <span className="video-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Video & Audio</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                    <div>
                      <span className="mono-stamp" style={{ color: 'var(--teal)', display: 'block', marginBottom: '8px' }}>
                        SIGNAL CHAIN (SENSE → COMPUTE → DECIDE → ACT)
                      </span>
                      <ol style={{ paddingLeft: '18px', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.6 }}>
                        {p.signalChain.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <span className="mono-stamp" style={{ color: 'var(--copper)', display: 'block', marginBottom: '8px' }}>
                        PORTFOLIO ROLE & PRICING CONTEXT
                      </span>
                      <p style={{ fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.6, margin: 0 }}>
                        {p.role}
                      </p>
                      <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--ink-muted)' }}>
                        <b>First Revenue:</b> {p.firstRevenue} · <b>Units @ FY32:</b> {p.units} · <b>Gross Margin:</b> {p.margin}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
