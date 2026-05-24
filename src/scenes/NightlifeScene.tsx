import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps, NightlifeVenue } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 26-30s (120 frames): split screen — cocktail left, dance floor right.
// Diagonal accent sweeps across; subtle Ken Burns on both halves.
// Portrait: stacks top/bottom instead of left/right.
export const NightlifeScene: React.FC<Props> = ({ nightlifeVenues, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
  const sceneOut = interpolate(frame, [104, 120], [1, 0], { extrapolateLeft: 'clamp' });

  // Slide-in: left from left, right from right
  const leftSlide = interpolate(frame, [0, 22], [isPortrait ? 0 : -100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rightSlide = interpolate(frame, [0, 22], [isPortrait ? 0 : 100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const topSlide = interpolate(frame, [0, 22], [isPortrait ? -100 : 0, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const bottomSlide = interpolate(frame, [0, 22], [isPortrait ? 100 : 0, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ken Burns: both halves scale slowly
  const zoom = interpolate(frame, [0, 120], [1.0, 1.08], { extrapolateRight: 'clamp' });

  // Diagonal divider sweep (clip-path animates from 0 to 100% across)
  const sweep = interpolate(frame, [20, 50], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const v1 = nightlifeVenues[0];
  const v2 = nightlifeVenues[1];
  if (!v1 || !v2) return null;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut, background: '#000' }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: isPortrait ? 'column' : 'row',
      }}>
        {/* First half */}
        <div style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          transform: isPortrait ? `translateY(${topSlide}%)` : `translateX(${leftSlide}%)`,
        }}>
          <Img src={staticFile(v1.imageSrc)} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${zoom})`,
          }} />
          <VenueLabel name={v1.name} tagline={v1.tagline} accent={brandAccent} isPortrait={isPortrait} />
          {/* Vignette */}
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }} />
        </div>
        {/* Second half */}
        <div style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          transform: isPortrait ? `translateY(${bottomSlide}%)` : `translateX(${rightSlide}%)`,
        }}>
          <Img src={staticFile(v2.imageSrc)} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${zoom})`,
          }} />
          <VenueLabel name={v2.name} tagline={v2.tagline} accent={brandAccent} isPortrait={isPortrait} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }} />
        </div>
      </div>

      {/* Diagonal accent sweep — separates the two halves */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: brandAccent,
        clipPath: isPortrait
          ? `polygon(0% calc(50% - 6px), 100% calc(50% - 6px), 100% calc(50% + 6px), 0% calc(50% + 6px))`
          : `polygon(calc(50% - 6px) 0%, calc(50% + 6px) 0%, calc(50% + 6px) 100%, calc(50% - 6px) 100%)`,
        opacity: sweep / 100 * 0.85,
        transform: isPortrait
          ? `translateX(${-100 + sweep}%)`
          : `translateY(${-100 + sweep}%)`,
      }} />

      {/* Scene title at top */}
      <div style={{
        position: 'absolute', top: isPortrait ? 24 : 40, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 40 : 52,
        fontWeight: 800,
        color: '#fff',
        textShadow: '0 4px 14px rgba(0,0,0,0.6)',
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        🌙 חיי לילה בנידרי
      </div>
    </AbsoluteFill>
  );
};

const VenueLabel: React.FC<{ name: string; tagline: string; accent: string; isPortrait: boolean }> = ({ name, tagline, accent, isPortrait }) => (
  <div style={{
    position: 'absolute', bottom: isPortrait ? 24 : 40, left: 0, right: 0,
    padding: '0 24px',
    textAlign: 'center',
    color: '#fff',
    direction: 'rtl',
  }}>
    <div style={{
      fontSize: isPortrait ? 32 : 40, fontWeight: 800, color: accent,
      marginBottom: 6, direction: 'ltr',
      textShadow: '0 4px 12px rgba(0,0,0,0.7)',
    }}>
      {name}
    </div>
    <div style={{
      fontSize: isPortrait ? 18 : 22, fontWeight: 500,
      textShadow: '0 2px 8px rgba(0,0,0,0.7)',
    }}>
      {tagline}
    </div>
  </div>
);
