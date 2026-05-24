import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// Frames 0-120 (0-4s): logo springs in, app name rises, tagline fades in,
// soft fade out at the end so the transition into the Hook scene is smooth.
export const IntroScene: React.FC<Props> = ({ appName, tagline, logoSrc, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  // App name rises from below starting at frame 18
  const nameRise = interpolate(frame, [18, 42], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nameOpacity = interpolate(frame, [18, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tagline fades in at frame 48
  const taglineOpacity = interpolate(frame, [48, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Soft fade out across the final 20 frames
  const sceneFade = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp' });

  const logoSize = isPortrait ? 280 : 320;
  const nameFontSize = isPortrait ? 96 : 120;
  const taglineFontSize = isPortrait ? 44 : 52;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sceneFade,
        textAlign: 'center',
      }}
    >
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 32 }}>
        <Img src={staticFile(logoSrc)} style={{ width: logoSize, height: logoSize, objectFit: 'contain' }} />
      </div>
      <div
        style={{
          fontSize: nameFontSize,
          fontWeight: 800,
          opacity: nameOpacity,
          transform: `translateY(${nameRise}px)`,
          marginBottom: 12,
          letterSpacing: -1,
        }}
      >
        {appName}
      </div>
      <div style={{ fontSize: taglineFontSize, fontWeight: 400, opacity: taglineOpacity, color: 'rgba(255,255,255,0.85)' }}>
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
