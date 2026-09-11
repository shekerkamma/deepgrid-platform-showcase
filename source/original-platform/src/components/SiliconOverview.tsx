import React from 'react';

const siliconSpecs = [
  { param: 'Process Technology', spec: 'TSMC 28 nm · Single Die, ~57 mm²', why: 'Monolithic, not chiplet — less packaging cost and qualification risk.' },
  { param: 'Compute Architecture', spec: '32,768 MACs @ 600 MHz · 39.3 TOPS', why: '64 compute cubes of 512 MACs. Derived, not rounded up.' },
  { param: 'Memory Subsystem', spec: '102.4 GB/s Dual-Channel LPDDR5', why: 'Bandwidth, not theoretical TOPS, binds multi-camera transformer fusion.' },
  { param: 'Transformer Acceleration', spec: 'Hardware Softmax · Weight-Stationary Attention', why: 'The critical operation an FPGA cannot execute at frame rate.' },
  { param: 'Automotive Safety Path', spec: 'Dual Lockstep Cores + Hardware Root of Trust', why: 'Deterministic path to ASIL-B / ASIL-D certification.' },
  { param: 'Perception Throughput', spec: '11 Sensor Channels Fused in 8.6 ms', why: 'Of a 33.3 ms (30 FPS) frame budget — 74% left unused.' },
];

export const SiliconOverview: React.FC = () => {
  return (
    <div className="content-section">
      <span className="eyebrow-tag">SILICON FOUNDATION</span>
      <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>SoC2 28nm ASIC Specification</h2>
      <p style={{ color: 'var(--ink-mid)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '68ch' }}>
        What the part actually is: a monolithic 28nm device designed for legislated automotive perception. Configuration changes; the compute core does not.
      </p>

      {/* Frame Budget Bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '22px 24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <span className="mono-stamp">FRAME BUDGET (30 FPS · 33.3 MS BUDGET)</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--copper)' }}>
            8.6 ms used · 24.7 ms (74%) available headroom
          </span>
        </div>

        <div style={{ height: '40px', background: 'var(--surface-sunk)', border: '1px solid var(--rule)', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '25.8%', background: 'var(--copper-fill)', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 500, color: '#FFF' }}>
            8.6 ms Fused
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '14px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-muted)', backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 7px, var(--rule) 7px 8px)' }}>
            24.7 ms Headroom (74.2% Frame Margin)
          </div>
        </div>
      </div>

      {/* Specification Table */}
      <div className="institutional-table-wrap">
        <table className="institutional-table">
          <thead>
            <tr>
              <th>PARAMETER</th>
              <th>SPECIFICATION</th>
              <th>INVESTOR RATIONALE</th>
            </tr>
          </thead>
          <tbody>
            {siliconSpecs.map((s, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'var(--mono)', color: 'var(--copper)', fontWeight: 500 }}>{s.param}</td>
                <td style={{ color: 'var(--ink)' }}>{s.spec}</td>
                <td style={{ color: 'var(--ink-mid)' }}>{s.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Embedded Silicon Architecture Video & Audio Simulations */}
      <div style={{ marginTop: '36px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: 'var(--ink)', fontFamily: 'var(--serif)' }}>
          Silicon & Data Movement Video Simulations
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '16px', borderRadius: '8px' }}>
            <span className="mono-stamp" style={{ color: 'var(--copper)', display: 'block', marginBottom: '8px' }}>
              8×8×8 SYSTOLIC ARRAY SIMULATION
            </span>
            <div className="case-video-box" style={{ marginBottom: '10px' }}>
              <video 
                src="./media/cube.mp4" 
                poster="./media/cube-poster.png" 
                controls 
                preload="metadata" 
                playsInline 
                style={{ width: '100%', borderRadius: '6px', background: '#000', display: 'block' }}
              />
              <div className="case-video-overlay">
                <div className="play-btn-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
                <span className="play-btn-label">Play 3D Systolic Cube Simulation</span>
              </div>
              <span className="video-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Video & Audio</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-mid)', margin: 0, lineHeight: 1.5 }}>
              <b>Hardware K-Depth:</b> Flat 8×8 array consumes K in 8 cycles; 8×8×8 cube retires one K-slice every single cycle (512 MACs/cycle).
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '16px', borderRadius: '8px' }}>
            <span className="mono-stamp" style={{ color: 'var(--teal)', display: 'block', marginBottom: '8px' }}>
              11-CHANNEL COMPUTE BOX PIPELINE
            </span>
            <div className="case-video-box" style={{ marginBottom: '10px' }}>
              <video 
                src="./media/computebox.mp4" 
                poster="./media/computebox-poster.png" 
                controls 
                preload="metadata" 
                playsInline 
                style={{ width: '100%', borderRadius: '6px', background: '#000', display: 'block' }}
              />
              <div className="case-video-overlay">
                <div className="play-btn-circle"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
                <span className="play-btn-label">Play 11-Channel In-Cab Compute Hub</span>
              </div>
              <span className="video-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Video & Audio</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-mid)', margin: 0, lineHeight: 1.5 }}>
              <b>Perception Ingestion:</b> 7 RGB + 2 thermal + front/rear 4D 77 GHz radar fused in 8.6 ms, leaving 74% frame headroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
