import React, { useState, useRef } from 'react';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [useEmbedMode, setUseEmbedMode] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const driveLink = "https://drive.google.com/file/d/1pVlhAll8U9Y2N2pW-WG-Lm6N9R3CRm10/view?usp=drive_link";
  const driveEmbedUrl = "https://drive.google.com/file/d/1pVlhAll8U9Y2N2pW-WG-Lm6N9R3CRm10/preview";
  const localVideoSrc = "./deck_assets/DeepGrid-Semi-Product-Portfolio-104-Slide-Explainer.mp4";

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Play error:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="videos" style={{ padding: '0 0 30px' }}>
      {/* Editorial Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--rule)', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            MULTIMODAL PRESENTATION · 104 SLIDES NARRATED
          </span>
          <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--ink)', fontWeight: 600, fontFamily: 'var(--serif)' }}>
            Master Video Presentation & Synchronous Audio Track
          </h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: '4px 0 0' }}>
            Complete 32-minute walkthrough across all 15 SKUs with high-fidelity visual diagrams and verified narration.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setUseEmbedMode(!useEmbedMode)}
            style={{
              background: 'var(--surface-sunk)',
              border: '1px solid var(--rule-strong)',
              color: 'var(--ink)',
              padding: '8px 14px',
              fontFamily: 'var(--mono)',
              fontSize: '11.5px',
              cursor: 'pointer',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
            }}
          >
            {useEmbedMode ? 'Switch to Direct MP4 Player' : 'Switch to Google Drive Stream'}
          </button>

          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--surface-sunk)',
              border: '1px solid var(--rule-strong)',
              color: 'var(--copper)',
              padding: '8px 14px',
              fontFamily: 'var(--mono)',
              fontSize: '11.5px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '.06em',
              fontWeight: 600,
            }}
          >
            <span>Open in Google Drive ↗</span>
          </a>
        </div>
      </div>

      {/* Video Container Stage */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--rule-strong)',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--surface-sunk)',
          border: '1px solid var(--rule)',
          overflow: 'hidden',
        }}>
          {useEmbedMode ? (
            <iframe
              src={driveEmbedUrl}
              width="100%"
              height="100%"
              title="Master Deck Video Presentation"
              style={{ border: 0 }}
              allow="autoplay"
            />
          ) : (
            <video
              ref={videoRef}
              src={localVideoSrc}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              poster="./deck_assets/sims_image.png"
            />
          )}
        </div>

        {/* Video Metadata Footnote */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'var(--rule)', border: '1px solid var(--rule)', marginTop: '16px' }}>
          <div style={{ background: 'var(--surface-sunk)', padding: '12px 16px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>RUNTIME</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>32:15.6 · 104 SLIDES</span>
          </div>
        </div>
      </div>
    </section>
  );
};
