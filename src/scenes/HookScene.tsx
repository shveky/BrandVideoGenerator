import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// Frames 120-240 (4-8s): one bold value sentence slides in word-by-word.
// Local frame counter — sequence starts at 0 inside the Sequence wrapper.
export const HookScene: React.FC<Props> = ({ hookLine, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split into words for a staggered reveal
  const words = hookLine.split(/\s+/).filter(Boolean);

  const fontSize = isPortrait ? 88 : 110;
  // Accent bar slides in from the right (RTL natural)
  const barScale = spring({ frame: frame - 6, fps, config: { damping: 18 } });

  // Whole-scene fade out at the end
  const sceneFade = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sceneFade,
        padding: '0 8%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 120,
          height: 6,
          background: brandAccent,
          marginBottom: 36,
          transform: `scaleX(${barScale})`,
          transformOrigin: 'right center',
          borderRadius: 3,
        }}
      />
      <div
        style={{
          fontSize,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: -1,
          maxWidth: '90%',
        }}
      >
        {words.map((w, i) => {
          const startFrame = 12 + i * 7;
          const o = interpolate(frame, [startFrame, startFrame + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [startFrame, startFrame + 14], [22, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={`${w}-${i}`}
              style={{
                display: 'inline-block',
                marginInline: 8,
                opacity: o,
                transform: `translateY(${y}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
