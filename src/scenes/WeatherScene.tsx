import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 34-38s — Showcases the per-stop weather forecast (Open-Meteo).
// Uses the captured 11-weather.png screenshot with Ken Burns and an overlay title.
export const WeatherScene: React.FC<Props> = ({ brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 120;
  const fade = interpolate(frame, [0, 12, DUR - 12, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Ken Burns: subtle zoom-in on the weather cards
  const scale = interpolate(frame, [0, DUR], [1.0, 1.15], { extrapolateRight: 'clamp' });
  const titleIn = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subIn = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#0a3d62' }}>
      <Img
        src={staticFile('screenshots/11-weather.png')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale})`,
          transformOrigin: 'center 60%',
        }}
      />
      {/* Dark overlay for text contrast */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Title */}
      <div style={{
        position: 'absolute', top: isPortrait ? 60 : 40, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 40 : 52, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 16px rgba(0,0,0,0.8)',
        opacity: titleIn,
        direction: 'rtl',
      }}>
        🌤️ תחזית מזג אוויר לכל יום
      </div>
      <div style={{
        position: 'absolute', top: isPortrait ? 120 : 100, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 22 : 28, fontWeight: 600,
        color: brandAccent, textShadow: '0 2px 10px rgba(0,0,0,0.7)',
        opacity: subIn,
        direction: 'rtl',
      }}>
        רוח · גלים · טמפ׳ — לכל עצירה במסלול
      </div>
      {/* Bottom caption */}
      <div style={{
        position: 'absolute', bottom: isPortrait ? 80 : 50, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 18 : 22, fontWeight: 600,
        color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        opacity: subIn,
        direction: 'rtl',
      }}>
        Open-Meteo · ללא API · עדכון אוטומטי
      </div>
    </AbsoluteFill>
  );
};
