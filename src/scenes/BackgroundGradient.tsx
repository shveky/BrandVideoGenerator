import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { VIDEO_DURATION_FRAMES } from '../compositions/defaults';

/** Darken a hex color by N percent (very simple — no alpha, no clamping past black). */
const darken = (hex: string, pct: number) => {
  const m = /^#?([a-f0-9]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * pct));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * pct));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * pct));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

interface Props {
  brandBg: string;
  brandAccent: string;
}

// Subtle "alive" background — gradient angle rotates slowly across the full
// 20s and the gradient endpoints sit at brandBg ↔ (brandBg darkened 8%).
// Intentionally low-contrast so it doesn't compete with foreground content.
export const BackgroundGradient: React.FC<Props> = ({ brandBg }) => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, VIDEO_DURATION_FRAMES], [0, 30], {
    extrapolateRight: 'clamp',
  });
  const dark = darken(brandBg, 0.08);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${brandBg} 0%, ${dark} 100%)`,
      }}
    />
  );
};
