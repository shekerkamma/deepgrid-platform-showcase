import React, { useState, useEffect } from 'react';
import { narration } from '../data/narration';

export const NarrationPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Stop speaking when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (index: number) => {
    window.speechSynthesis.cancel();
    const text = narration[index].text;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: pick a specific voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      if (index < narration.length - 1 && isPlaying) {
        setCurrentIndex(index + 1);
        speak(index + 1);
      } else {
        setIsPlaying(false);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speak(currentIndex);
    }
  };

  const next = () => {
    if (currentIndex < narration.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (isPlaying) speak(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      if (isPlaying) speak(currentIndex - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '600px',
      background: 'rgba(14, 21, 37, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 200, 240, 0.2)',
      borderRadius: '12px',
      padding: '1rem',
      zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      transition: 'all 0.3s'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '1rem' : '0' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          NARRATION ({currentIndex + 1}/{narration.length})
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-headings)' }}>
            {narration[currentIndex].title}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', minHeight: '60px', lineHeight: 1.6 }}>
            "{narration[currentIndex].text}"
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={prev} disabled={currentIndex === 0} style={controlBtnStyle}>⏮</button>
        <button onClick={togglePlay} style={{ ...controlBtnStyle, background: 'var(--color-primary)', color: '#000', width: '40px', height: '40px' }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={next} disabled={currentIndex === narration.length - 1} style={controlBtnStyle}>⏭</button>
        
        <div style={{ flex: 1, height: '4px', background: 'var(--bg-highlighted)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${((currentIndex + 1) / narration.length) * 100}%`,
            background: 'var(--color-primary)',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

    </div>
  );
};

const controlBtnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: 'var(--text-primary)',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem'
};
