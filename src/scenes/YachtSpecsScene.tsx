import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 10-14s: Real screenshot of the yacht modal (Esther — Bali 4.2) from the
// sailing app, slow Ken Burns + a row of stat chips floating along the
// bottom for at-a-glance specs.
export const YachtSpecsScene: React.FC<Props> = ({ yachtSpecs, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 120;

  const fade = interpolate(frame, [0, 10, DUR - 10, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, DUR], [1.02, 1.12], { extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [0, DUR], [0, -30], { extrapolateRight: 'clamp' });

  const titleIn = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleOut = interpolate(frame, [DUR - 18, DUR - 4], [1, 0], { extrapolateLeft: 'clamp' });

  const chips = [
    { label: `${yachtSpecs.lengthM}×${yachtSpecs.beamM} מ׳`, icon: '📏' },
    { label: `${yachtSpecs.cabins} תאים`,                    icon: '🛏' },
    { label: `${yachtSpecs.berths} מיטות`,                   icon: '👥' },
    { label: yachtSpecs.engines,                              icon: '⚙' },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#0a3d62' }}>
      <Img
        src={staticFile('screenshots/09-yacht-modal.png')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translate(0, ${panY}px)`,
          transformOrigin: 'center top',
        }}
      />

      {/* Vignette */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Title strip */}
      <div style={{
        position: 'absolute', top: 28, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: titleIn * titleOut,
      }}>
        ⛵ {yachtSpecs.model} · {yachtSpecs.year}
      </div>

      {/* Stat chip row — bottom, staggered fade-in */}
      <div style={{
        position: 'absolute', bottom: isPortrait ? 28 : 44, left: 0, right: 0,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: isPortrait ? 8 : 12,
        padding: '0 24px',
      }}>
        {chips.map((c, i) => {
          const start = 30 + i * 7;
          const o = interpolate(frame, [start, start + 18], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const slide = interpolate(frame, [start, start + 18], [16, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const out = interpolate(frame, [DUR - 18, DUR - 4], [1, 0], { extrapolateLeft: 'clamp' });
          return (
            <div key={i} style={{
              padding: isPortrait ? '8px 16px' : '10px 22px',
              background: 'rgba(10, 61, 98, 0.85)',
              border: `1px solid ${brandAccent}`,
              borderRadius: 999,
              fontSize: isPortrait ? 18 : 22,
              fontWeight: 700,
              color: '#fff',
              opacity: o * out,
              transform: `translateY(${slide}px)`,
              display: 'flex', alignItems: 'center', gap: 6,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            }}>
              <span>{c.icon}</span>
              <span dir="rtl">{c.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
