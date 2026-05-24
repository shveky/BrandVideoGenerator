import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// Frames 480-600 (16-20s, 120 frames local).
// End card: logo, app name, URL, big accented CTA button.
export const CtaScene: React.FC<Props> = ({
  appName,
  ctaText,
  appUrl,
  logoSrc,
  brandAccent,
  isPortrait,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 16, mass: 0.6 } });
  const logoOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });

  const nameOpacity = interpolate(frame, [16, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nameRise = interpolate(frame, [16, 36], [22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const urlOpacity = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const ctaScale = spring({ frame: frame - 56, fps, config: { damping: 12 } });
  const ctaOpacity = interpolate(frame, [56, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Gentle pulse on the CTA from frame 80 onward
  const pulse = 1 + 0.04 * Math.sin(((frame - 80) / 30) * Math.PI * 2);

  const logoSize = isPortrait ? 220 : 260;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 24,
      }}
    >
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <Img src={staticFile(logoSrc)} style={{ width: logoSize, height: logoSize, objectFit: 'contain' }} />
      </div>

      <div
        style={{
          fontSize: isPortrait ? 80 : 96,
          fontWeight: 800,
          opacity: nameOpacity,
          transform: `translateY(${nameRise}px)`,
          letterSpacing: -1,
        }}
      >
        {appName}
      </div>

      <div
        style={{
          fontSize: isPortrait ? 36 : 42,
          opacity: urlOpacity,
          color: 'rgba(255,255,255,0.78)',
          direction: 'ltr',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {appUrl.replace(/^https?:\/\//, '')}
      </div>

      <div
        style={{
          marginTop: 28,
          padding: '20px 56px',
          fontSize: isPortrait ? 44 : 52,
          fontWeight: 800,
          color: '#0B0B0B',
          background: brandAccent,
          borderRadius: 999,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale * (frame > 80 ? pulse : 1)})`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
        }}
      >
        {ctaText}
      </div>
    </AbsoluteFill>
  );
};
