import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 38-42s — Live wind + clouds GIS layer. Uses captured screenshot since
// the animation only renders in a real browser (static frame shows the map
// with cloud tint + route + markers).
export const WindLayerScene: React.FC<Props> = ({ brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 120;
  const fade = interpolate(frame, [0, 12, DUR - 12, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, DUR], [1.0, 1.12], { extrapolateRight: 'clamp' });
  const titleIn = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subIn = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const chipIn = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#0a3d62' }}>
      <Img
        src={staticFile('screenshots/12-wind-layer.png')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale})`,
          transformOrigin: 'center 55%',
        }}
      />
      {/* Top + bottom dark gradients for text contrast */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Title */}
      <div style={{
        position: 'absolute', top: isPortrait ? 60 : 40, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 38 : 50, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 16px rgba(0,0,0,0.85)',
        opacity: titleIn,
        direction: 'rtl',
      }}>
        🌬️ רוח + ☁️ עננים בזמן אמת
      </div>
      <div style={{
        position: 'absolute', top: isPortrait ? 120 : 100, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 22 : 28, fontWeight: 600,
        color: brandAccent, textShadow: '0 2px 10px rgba(0,0,0,0.75)',
        opacity: subIn,
        direction: 'rtl',
      }}>
        שכבת GIS חיה על המפה · חלקיקי רוח זורמים
      </div>
      {/* Bottom chips */}
      <div style={{
        position: 'absolute', bottom: isPortrait ? 100 : 60, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: isPortrait ? 12 : 18,
        opacity: chipIn, direction: 'rtl', flexWrap: 'wrap', padding: '0 30px',
      }}>
        {[
          { icon: '📡', text: 'מודל ECMWF' },
          { icon: '🔄', text: 'עדכון כל 3 שעות' },
          { icon: '⚡', text: '130 נקודות גריד' },
        ].map((c, i) => (
          <div key={i} style={{
            padding: isPortrait ? '8px 16px' : '12px 24px',
            background: 'rgba(255,255,255,0.94)',
            color: '#0a3d62', fontWeight: 700,
            fontSize: isPortrait ? 15 : 20,
            borderRadius: 999,
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>{c.icon}</span>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
