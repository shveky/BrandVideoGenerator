import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 6-10s: Real screenshot of the skipper's "תכנון הטיול" modal from the
// sailing app. Slow Ken Burns down the modal (pan from top → bottom) to
// reveal the planning sections. Caption overlays brand the moment.
export const TripPlanScene: React.FC<Props> = ({ brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 120;

  const fade = interpolate(frame, [0, 10, DUR - 10, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ken Burns: scale slightly + pan downward to expose more of the long modal
  const scale = interpolate(frame, [0, DUR], [1.02, 1.10], { extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [0, DUR], [0, -260], { extrapolateRight: 'clamp' });

  const titleIn = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleOut = interpolate(frame, [DUR - 18, DUR - 4], [1, 0], { extrapolateLeft: 'clamp' });

  // Highlight chip — "מאת הסקיפר בן" — fades in shortly after title
  const chipIn = interpolate(frame, [28, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#fdf6e3' }}>
      <Img
        src={staticFile('screenshots/10-trip-plan.png')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translate(0, ${panY}px)`,
          transformOrigin: 'center top',
        }}
      />

      {/* Vignette top + bottom so captions read clearly */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Title at top */}
      <div style={{
        position: 'absolute', top: 32, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: titleIn * titleOut,
      }}>
        📋 תכנון הטיול
      </div>

      {/* Byline chip — bottom */}
      <div style={{
        position: 'absolute', bottom: isPortrait ? 28 : 44, left: '50%',
        transform: `translateX(-50%) scale(${chipIn})`,
        padding: isPortrait ? '8px 18px' : '10px 24px',
        background: brandAccent, color: '#0a3d62',
        borderRadius: 999,
        fontSize: isPortrait ? 18 : 22, fontWeight: 800,
        boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
        opacity: chipIn * titleOut,
      }}>
        מאת הסקיפר בן
      </div>
    </AbsoluteFill>
  );
};
