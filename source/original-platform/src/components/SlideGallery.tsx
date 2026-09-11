import React, { useState } from 'react';
import slidesData from '../data/master_deck_indexed.json';

const presentationId = "1qpq13INORqRjcYna1MQa_NMeorkAW_gk";
const masterDeckLink = `https://docs.google.com/presentation/d/${presentationId}/edit?usp=drive_link&ouid=115548929596003673495&rtpof=true&sd=true`;

const sections = [
  { label: 'All 104 Slides', start: 1, end: 104 },
  { label: 'Overview (1-6)', start: 1, end: 6 },
  { label: 'Part 1: Road Autonomy (7-23)', start: 7, end: 23 },
  { label: 'Frame Budget & Sensor-to-Compute (24-30)', start: 24, end: 30 },
  { label: 'Part 2: Silicon & Compute (31-48)', start: 31, end: 48 },
  { label: 'Part 3: Fleet & Mobility (49-65)', start: 49, end: 65 },
  { label: 'Part 4: Sensors & Robotics (66-96)', start: 66, end: 96 },
  { label: 'Part 5: Portfolio Economics (97-104)', start: 97, end: 104 },
];

export const SlideGallery: React.FC = () => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSlideNum, setActiveSlideNum] = useState<number>(1);

  const currentSection = sections[activeSectionIndex];
  const filteredSlides = slidesData.filter(
    s => s.slide >= currentSection.start && s.slide <= currentSection.end
  );

  const currentSlide = slidesData.find(s => s.slide === activeSlideNum) || slidesData[0];

  // Direct embed URL using Google Slides embed player
  const embedUrl = `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=3000#slide=id.p${activeSlideNum}`;

  return (
    <section id="slides" style={{ padding: '0 0 30px' }}>
      {/* Editorial Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--rule)', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--copper)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            OFFICIAL GOOGLE PRESENTATION EMBED · 104 SLIDES
          </span>
          <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--ink)', fontWeight: 600, fontFamily: 'var(--serif)' }}>
            104-Slide Master Deck — Interactive Presentation Player
          </h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: '4px 0 0' }}>
            Full original Google Presentation rendered directly in-place with high-resolution visual plates, layout objects, and synchronized commentary.
          </p>
        </div>
        <a
          href={masterDeckLink}
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
          <span>Open Fullscreen Presentation ↗</span>
        </a>
      </div>

      {/* Section Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {sections.map((sec, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSectionIndex(i);
              setActiveSlideNum(sec.start);
            }}
            style={{
              background: activeSectionIndex === i ? 'var(--copper-fill)' : 'var(--surface)',
              color: activeSectionIndex === i ? '#FFF7F0' : 'var(--ink-muted)',
              border: activeSectionIndex === i ? '1px solid var(--copper)' : '1px solid var(--rule)',
              padding: '8px 14px',
              fontFamily: 'var(--mono)',
              fontSize: '11.5px',
              fontWeight: activeSectionIndex === i ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '.06em',
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Live Master Google Presentation Embed & Commentary Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1.6fr))',
        gap: '20px',
        background: 'var(--surface)',
        border: '1px solid var(--rule-strong)',
        padding: '20px',
        marginBottom: '24px',
      }}>
        {/* Left: Native Google Slides Embed Player */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            border: '1px solid var(--rule)',
            overflow: 'hidden',
          }}>
            <iframe
              key={activeSlideNum}
              src={embedUrl}
              title={`DeepGrid Master Slide ${activeSlideNum}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
            />
          </div>

          {/* Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '10px 14px' }}>
            <button
              disabled={activeSlideNum <= 1}
              onClick={() => setActiveSlideNum(Math.max(1, activeSlideNum - 1))}
              style={{
                background: 'var(--surface)', border: '1px solid var(--rule-strong)', color: 'var(--ink)',
                padding: '8px 16px', fontFamily: 'var(--mono)', fontSize: '11.5px', cursor: activeSlideNum <= 1 ? 'not-allowed' : 'pointer',
                opacity: activeSlideNum <= 1 ? 0.3 : 1, fontWeight: 500
              }}
            >
              ← Previous Slide
            </button>
            <span style={{ fontFamily: 'var(--mono)', color: 'var(--copper)', fontSize: '12px', fontWeight: 600 }}>
              Slide {activeSlideNum} of 104
            </span>
            <button
              disabled={activeSlideNum >= 104}
              onClick={() => setActiveSlideNum(Math.min(104, activeSlideNum + 1))}
              style={{
                background: 'var(--surface)', border: '1px solid var(--rule-strong)', color: 'var(--ink)',
                padding: '8px 16px', fontFamily: 'var(--mono)', fontSize: '11.5px', cursor: activeSlideNum >= 104 ? 'not-allowed' : 'pointer',
                opacity: activeSlideNum >= 104 ? 0.3 : 1, fontWeight: 500
              }}
            >
              Next Slide →
            </button>
          </div>
        </div>

        {/* Right: Verbatim WSL Speaker Commentary & Financial Model Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '20px' }}>
          <div>
            <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              SYNCHRONIZED AUDIT NOTES
            </span>
            <h4 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--ink)', fontWeight: 600, fontFamily: 'var(--serif)' }}>
              Slide {String(currentSlide.slide).padStart(2, '0')}: {currentSlide.title}
            </h4>
          </div>

          {/* Verbatim Speaker Commentary */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '16px', borderLeft: '3px solid var(--copper)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--copper)', letterSpacing: '.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Verbatim Speaker Commentary
            </span>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-mid)', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'var(--sans)' }}>
              "{currentSlide.script}"
            </p>
          </div>

          {/* Model Notes & Sources */}
          {currentSlide.notes && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '14px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Model Cell & Worksheet Provenance:
              </span>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'var(--mono)', lineHeight: 1.5 }}>
                {currentSlide.notes}
              </p>
            </div>
          )}

          {/* Direct Link to Google Slides */}
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', fontFamily: 'var(--mono)' }}>
              Google Presentation Live Sync
            </span>
            <a
              href={`${masterDeckLink}#slide=id.p${currentSlide.slide}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--copper)', fontSize: '12px', fontFamily: 'var(--mono)', textDecoration: 'none', fontWeight: 600 }}
            >
              Open in Google Slides #p{currentSlide.slide} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Grid of Slide Tiles */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
          Direct Jump ({filteredSlides.length} Slides in this Part):
        </span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '10px',
        }}>
          {filteredSlides.map(s => {
            const isCurrent = s.slide === activeSlideNum;
            return (
              <div
                key={s.slide}
                onClick={() => {
                  setActiveSlideNum(s.slide);
                  const el = document.getElementById('slides');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: isCurrent ? 'var(--surface-card)' : 'var(--surface)',
                  border: isCurrent ? '1px solid var(--copper)' : '1px solid var(--rule)',
                  borderLeft: isCurrent ? '3px solid var(--copper)' : '1px solid var(--rule)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
                onMouseOver={e => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--rule-strong)';
                    e.currentTarget.style.background = 'var(--surface-card)';
                  }
                }}
                onMouseOut={e => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = 'var(--rule)';
                    e.currentTarget.style.background = 'var(--surface)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: isCurrent ? 'var(--copper)' : 'var(--ink-muted)', fontWeight: 600 }}>
                    SLIDE {String(s.slide).padStart(2, '0')}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--serif)' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45, fontFamily: 'var(--sans)' }}>
                  {s.body ? s.body.replace(/\n/g, ' · ') : s.script}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
