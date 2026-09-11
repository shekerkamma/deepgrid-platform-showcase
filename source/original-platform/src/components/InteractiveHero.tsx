import React, { useState } from 'react';
import { Cpu, Eye, ShieldCheck, Zap, Layers, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const InteractiveHero: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'die' | 'fusion' | 'mandate' | 'tam'>('die');

  const layers = [
    {
      id: 'die' as const,
      tag: 'LAYER 01 · BARE SILICON',
      title: 'Monolithic 28nm ASIC (SoC2)',
      desc: 'One 57 mm² die manufactured at TSMC. 64 Systolic compute cubes with 32,768 MACs at 600 MHz for a derived 39.3 TOPS, architecture arithmetic rather than a silicon measurement, without multi-chiplet packaging risk.',
      stat: '57 mm²',
      statLabel: 'Die Footprint',
      accent: 'var(--copper)'
    },
    {
      id: 'fusion' as const,
      tag: 'LAYER 02 · PERCEPTION ENGINE',
      title: '11-Channel Sensor Fusion in 8.6ms',
      desc: '7 RGB cameras, 2 thermal pods, and 4D imaging radars fused concurrently within an 8.6 ms deterministic hardware latency budget (74.2% headroom for planning).',
      stat: '8.6 ms',
      statLabel: 'Pipeline Latency',
      accent: 'var(--copper)'
    },
    {
      id: 'mandate' as const,
      tag: 'LAYER 03 · REGULATORY WEDGE',
      title: 'AIS-162 / AIS-188 Mandated Market',
      desc: 'Targeting 1.0M N2/N3 commercial trucks required by Indian safety mandates. Fleet payback under 24 months through insurance discounts & collision mitigation.',
      stat: '1.0 M',
      statLabel: 'Mandated Vehicles/Yr',
      accent: 'var(--copper)'
    },
    {
      id: 'tam' as const,
      tag: 'LAYER 04 · UNIT ECONOMICS',
      title: '₹1,128.5 Cr Top-Line at 87.4% Blended GM',
      desc: '15 distinct revenue lines reaching market across commercial trucking, warehouse AMRs, defense robotics, and seaport AGVs — with no line exceeding 2% of its pool.',
      stat: '₹1,128.5 Cr',
      statLabel: 'FY2032 Revenue',
      accent: 'var(--copper)'
    }
  ];

  const current = layers.find(l => l.id === activeLayer) || layers[0];

  return (
    <div className="scrollcraft-hero" style={{ position: 'relative', overflow: 'hidden', padding: '40px 0 60px' }}>
      {/* Background Ambient Glow & Kinetic Grid */}
      <div className="hero-mesh-bg" />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Masthead Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span className="hero-badge pulse">
            <span className="badge-dot" /> DEEPGRID SEMI · PRE-SERIES A
          </span>
          <span className="hero-badge-outline">STRICTLY CONFIDENTIAL · AUGUST 2026</span>
          <span className="hero-badge-outline">TSMC 28NM MONOLITHIC TAPE-OUT</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline">
          One Silicon Die. <br />
          <span className="headline-accent">Fifteen Revenue Streams.</span>
        </h1>

        <p className="hero-subtext">
          A single 28nm ASIC powering India’s commercial autonomous vehicle ecosystem.
          Every SKU runs identical silicon under dedicated firmware: <b>one tapeout, not fifteen independent product bets.</b>
        </p>

        {/* 6 Key Macro Metrics Cards */}
        <div className="hero-metrics-grid">
          <div className="metric-box">
            <span className="mk">MANDATE VOLUME</span>
            <span className="mv">1.0 M</span>
            <span className="mn">N2/N3 trucks/yr in Indian scope</span>
          </div>
          <div className="metric-box">
            <span className="mk">FY2032 REVENUE</span>
            <span className="mv">₹1,128.5 Cr</span>
            <span className="mn">15 products off 1 silicon die</span>
          </div>
          <div className="metric-box">
            <span className="mk">GROSS MARGIN</span>
            <span className="mv">89–94%</span>
            <span className="mn">94% bare die; 89% full systems</span>
          </div>
          <div className="metric-box">
            <span className="mk">SENSOR FUSION</span>
            <span className="mv">8.6 ms</span>
            <span className="mn">11 channels (74% frame headroom)</span>
          </div>
          <div className="metric-box">
            <span className="mk">TAPEOUT CAPEX</span>
            <span className="mv">$3.17 M</span>
            <span className="mn">$3.88 / die cost at volume</span>
          </div>
          <div className="metric-box">
            <span className="mk">BREAKEVEN GATE</span>
            <span className="mv">175k dies</span>
            <span className="mn">Committed only on working silicon</span>
          </div>
        </div>

        {/* Interactive Layer Exploration Control (ScrollCraft Stacking Archetype) */}
        <div className="layer-selector-container">
          <div className="layer-tabs">
            {layers.map((l) => {
              const isActive = l.id === activeLayer;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={`layer-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="tab-indicator" style={{ background: isActive ? l.accent : 'transparent' }} />
                  <span className="tab-title">{l.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic 3D Layer Showcase Card */}
          <div className="glass-interactive-card">
            <div className="glass-card-header">
              <span className="card-tag">{current.tag}</span>
              <div className="card-stat-pill">
                <span className="stat-v">{current.stat}</span>
                <span className="stat-l">{current.statLabel}</span>
              </div>
            </div>

            <div className="glass-card-body">
              <div style={{ flex: '1 1 340px' }}>
                <h3 className="card-title">{current.title}</h3>
                <p className="card-desc">{current.desc}</p>

                <div className="card-features-list">
                  <div className="feature-item">
                    <CheckCircle2 size={16} color="var(--copper)" />
                    <span>Deterministic execution with zero runtime throttling</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={16} color="var(--copper)" />
                    <span>Sovereign Indian silicon stack with lockstep safety IP</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <a href="#portfolio-sec" className="cta-primary-btn">
                    Explore 15-SKU Portfolio <ArrowRight size={16} />
                  </a>
                  <a href="#silicon-sec" className="cta-secondary-btn">
                    View Silicon Architecture
                  </a>
                </div>
              </div>

              {/* Interactive Visual / 3D Simulation Panel */}
              <div className="glass-card-visual">
                <div className="visual-preview-box">
                  {activeLayer === 'die' && (
                    <div className="silicon-die-visual">
                      <div className="chiplet-grid">
                        <div className="chip-cell core">A100 NPU</div>
                        <div className="chip-cell core">R100 DSP</div>
                        <div className="chip-cell core">T100 AI</div>
                        <div className="chip-cell core">D100 SEC</div>
                        <div className="chip-cell core">S100 VCU</div>
                        <div className="chip-cell core">H100 HLT</div>
                      </div>
                      <span className="visual-caption">57 mm² Monolithic Die Layout · TSMC 28nm</span>
                    </div>
                  )}

                  {activeLayer === 'fusion' && (
                    <div className="fusion-visual">
                      <div className="pipeline-bar">
                        <div className="bar-used" style={{ width: '25.8%' }}>8.6ms Active</div>
                        <div className="bar-free">24.7ms Headroom (74%)</div>
                      </div>
                      <div className="sensor-chips">
                        <span className="schip">7x RGB Cameras</span>
                        <span className="schip">2x Thermal Pods</span>
                        <span className="schip">4D Imaging Radar</span>
                      </div>
                    </div>
                  )}

                  {activeLayer === 'mandate' && (
                    <div className="mandate-visual">
                      <div className="truck-schematic">
                        <div className="schematic-badge">AIS-162 & AIS-188 Certified</div>
                        <div className="schematic-stats">
                          <div><b>₹2.5L</b> ASP</div>
                          <div><b>18,000</b> Units FY32</div>
                          <div><b>₹450 Cr</b> Top Line</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLayer === 'tam' && (
                    <div className="tam-visual">
                      <div className="tam-growth-chart">
                        <div className="chart-bar b1"><span className="cval">₹1.7 Cr</span><span className="cyr">FY27</span></div>
                        <div className="chart-bar b2"><span className="cval">₹115 Cr</span><span className="cyr">FY29</span></div>
                        <div className="chart-bar b3"><span className="cval">₹1,128 Cr</span><span className="cyr">FY32</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
