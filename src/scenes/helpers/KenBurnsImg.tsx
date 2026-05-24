import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

interface KenBurnsImgProps {
  src: string;                 // path under public/, e.g. 'screenshots/01-overview.png'
  durationInFrames: number;    // total frames for this clip
  /** Zoom range: starts at startScale, ends at endScale */
  startScale?: number;
  endScale?: number;
  /** Pan offsets in % of frame (positive = right/down at end) */
  panX?: number;
  panY?: number;
  /** Fade in/out windows */
  fadeIn?: number;
  fadeOut?: number;
  /** Optional vignette overlay opacity at bottom (for caption readability) */
  vignetteAlpha?: number;
}

// Generic Ken-Burns wrapper for a single static image.
// Used by every scene that takes a screenshot as its base visual.
export const KenBurnsImg: React.FC<KenBurnsImgProps> = ({
  src,
  durationInFrames,
  startScale = 1.0,
  endScale = 1.12,
  panX = 0,
  panY = 0,
  fadeIn = 8,
  fadeOut = 10,
  vignetteAlpha = 0,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX], { extrapolateRight: 'clamp' });
  const ty = interpolate(frame, [0, durationInFrames], [0, panY], { extrapolateRight: 'clamp' });
  const fade = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#0a3d62' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: 'center',
        }}
      />
      {vignetteAlpha > 0 && (
        <AbsoluteFill style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,${vignetteAlpha}) 100%)`,
        }} />
      )}
    </AbsoluteFill>
  );
};
