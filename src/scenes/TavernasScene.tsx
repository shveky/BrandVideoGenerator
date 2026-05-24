import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 19-26s (210 frames). Two real app screenshots cross-fading:
// A: 0-110   — tavernas grid (3-col, all 6 with ratings)
// B: 110-210 — single taverna detail (Google photos panel, menu link, etc.)
// Each gets its own Ken Burns + caption overlay.
export const TavernasScene: React.FC<Props> = ({ brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 210;

  const sceneFade = interpolate(frame, [0, 10, DUR - 10, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Crossfade between two screenshots
  const aOpacity = interpolate(frame, [0, 10, 100, 130], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bOpacity = interpolate(frame, [100, 130, DUR - 10, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ken Burns for A (grid view) — slow zoom in to center
  const aScale = interpolate(frame, [0, 130], [1.0, 1.1], { extrapolateRight: 'clamp' });

  // Ken Burns for B (detail view) — pan downward to reveal the menu link card
  const bScale = interpolate(frame, [100, DUR], [1.0, 1.08], { extrapolateRight: 'clamp' });
  const bPanY = interpolate(frame, [100, DUR], [0, -80], { extrapolateRight: 'clamp' });

  // Captions
  const captionAIn = interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const captionAOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp' });
  const captionBIn = interpolate(frame, [125, 145], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const captionBOut = interpolate(frame, [DUR - 20, DUR - 5], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: sceneFade, overflow: 'hidden', background: '#fdf6e3' }}>
      {/* Layer A: tavernas grid screenshot */}
      <AbsoluteFill style={{ opacity: aOpacity }}>
        <Img
          src={staticFile('screenshots/03-tavernas-grid.png')}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${aScale})`,
            transformOrigin: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Layer B: single taverna detail screenshot */}
      <AbsoluteFill style={{ opacity: bOpacity }}>
        <Img
          src={staticFile('screenshots/04-taverna-detail.png')}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${bScale}) translate(0, ${bPanY}px)`,
            transformOrigin: 'center top',
          }}
        />
      </AbsoluteFill>

      {/* Vignette so captions stay readable */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Caption A: top */}
      <div style={{
        position: 'absolute', top: 28, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: captionAIn * captionAOut,
      }}>
        🍽️ 6 טברנות בנידרי — בחרו אחת
      </div>

      {/* Caption B: top */}
      <div style={{
        position: 'absolute', top: 28, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: captionBIn * captionBOut,
      }}>
        📷 תמונות אמיתיות + תפריט במפות
      </div>

      {/* Bottom accent bar (visual continuity with brand) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 4, background: brandAccent,
      }} />
    </AbsoluteFill>
  );
};
