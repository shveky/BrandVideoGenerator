import React from 'react';

export type Aspect = '16x9' | '9x16';

interface Props {
  aspect: Aspect;
  onChange: (a: Aspect) => void;
}

export const AspectToggle: React.FC<Props> = ({ aspect, onChange }) => {
  const btn = (a: Aspect, label: string, hint: string): React.CSSProperties => ({
    background: aspect === a ? '#E8B339' : '#2a323b',
    color: aspect === a ? '#0B0B0B' : '#e6e8eb',
    border: 'none', padding: '8px 16px', borderRadius: 8,
    cursor: 'pointer', fontWeight: 700, fontSize: 13,
    display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2,
  });
  return (
    <div style={{ display: 'flex', gap: 6, background: '#0f1419', padding: 6, borderRadius: 10 }}>
      <button onClick={() => onChange('16x9')} style={btn('16x9', '16:9', 'YouTube · web')} title="1920×1080 — wide">
        <span>16:9</span>
        <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>1920×1080</span>
      </button>
      <button onClick={() => onChange('9x16')} style={btn('9x16', '9:16', 'Reels · stories')} title="1080×1920 — vertical">
        <span>9:16</span>
        <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>1080×1920</span>
      </button>
    </div>
  );
};
