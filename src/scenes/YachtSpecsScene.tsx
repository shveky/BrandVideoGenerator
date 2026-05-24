import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 10-14s: yacht silhouette draws in via strokeDashoffset, then 5 spec chips
// fade-slide into place, staggered.
export const YachtSpecsScene: React.FC<Props> = ({ yachtSpecs, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOut = interpolate(frame, [108, 120], [1, 0], { extrapolateLeft: 'clamp' });

  // SVG stroke draw-in (path length ~700 for our silhouette)
  const PATH_LEN = 700;
  const draw = interpolate(frame, [0, 30], [PATH_LEN, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Title fade in
  const titleIn = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtle bob — deterministic, frame-driven
  const bob = Math.sin(frame / 15) * 4;

  const chips = [
    { label: `${yachtSpecs.lengthM}×${yachtSpecs.beamM} מ׳`, icon: '📏' },
    { label: `${yachtSpecs.cabins} תאים`,                    icon: '🛏' },
    { label: `${yachtSpecs.berths} מיטות`,                   icon: '👥' },
    { label: yachtSpecs.engines,                              icon: '⚙' },
    { label: `${yachtSpecs.charterType}`,                     icon: '🛟' },
  ];

  const titleFontSize = isPortrait ? 56 : 64;
  const silhouetteSize = isPortrait ? 360 : 480;

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, opacity: sceneOut,
    }}>
      <div style={{
        opacity: titleIn,
        textAlign: 'center',
        fontFamily: 'inherit',
      }}>
        <div style={{ fontSize: titleFontSize, fontWeight: 800, letterSpacing: -1 }}>
          {yachtSpecs.model}
        </div>
        <div style={{ fontSize: titleFontSize * 0.4, color: brandAccent, fontWeight: 700, marginTop: 4 }}>
          {yachtSpecs.year} · קטמרן
        </div>
      </div>

      <div style={{
        transform: `translateY(${bob}px)`,
        width: silhouetteSize, height: silhouetteSize * 0.55,
      }}>
        <YachtSilhouette accent={brandAccent} drawOffset={draw} pathLen={PATH_LEN} />
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 14,
        justifyContent: 'center', maxWidth: isPortrait ? 600 : 1200,
        padding: '0 24px',
      }}>
        {chips.map((c, i) => {
          const startFrame = 40 + i * 8;
          const o = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const slide = interpolate(frame, [startFrame, startFrame + 18], [16, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{
              padding: '10px 22px',
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${brandAccent}88`,
              borderRadius: 999,
              fontSize: isPortrait ? 22 : 26,
              fontWeight: 700,
              opacity: o,
              transform: `translateY(${slide}px)`,
              display: 'flex', alignItems: 'center', gap: 8,
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

// Simple catamaran silhouette (two hulls + deck + mast + sail)
const YachtSilhouette: React.FC<{ accent: string; drawOffset: number; pathLen: number }> = ({ accent, drawOffset, pathLen }) => (
  <svg viewBox="0 0 400 220" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 30 160
         L 90 160 L 100 175 L 300 175 L 310 160 L 370 160
         M 60 160 L 140 130 L 260 130 L 340 160
         M 200 130 L 200 25
         M 200 25 L 290 100 L 200 100 Z"
      stroke={accent} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={pathLen} strokeDashoffset={drawOffset}
    />
    {/* Waterline waves */}
    <path d="M 20 200 Q 100 192 200 200 T 380 200" stroke={accent} strokeOpacity={0.3} strokeWidth={2} fill="none" />
  </svg>
);
