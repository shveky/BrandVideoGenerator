import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// Frames 240-480 (8-16s, 240 frames local).
// Ken Burns: zoom from 1.0 → 1.18 over the full scene, with a slight pan
// toward the focus region (right-center, since Hebrew reads RTL).
// Captions appear at their relative fromFrame within the scene.
export const ShowcaseScene: React.FC<Props> = ({
  mediaSrc,
  brandAccent,
  captions,
  isPortrait,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = 240;

  // Ken Burns
  const zoom = interpolate(frame, [0, sceneDuration], [1.0, 1.18], { extrapolateRight: 'clamp' });
  const panX = interpolate(frame, [0, sceneDuration], [0, -40], { extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [0, sceneDuration], [0, -20], { extrapolateRight: 'clamp' });

  // Enter fade
  const sceneIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const sceneOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: sceneIn * sceneOut }}>
      {/* Media with Ken Burns */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile(mediaSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: 'center',
          }}
        />
        {/* Vignette so captions are readable */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </AbsoluteFill>

      {/* Captions — bottom band, RTL, 20% from bottom */}
      <AbsoluteFill style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ width: '90%', marginBottom: '15%', textAlign: 'center' }}>
          {captions.map((c, i) => {
            // c.fromFrame is local to the showcase scene
            const startFade = c.fromFrame;
            const fullIn = c.fromFrame + 12;
            const startOut = c.fromFrame + c.durationInFrames - 12;
            const endOut = c.fromFrame + c.durationInFrames;
            const opacity = interpolate(
              frame,
              [startFade, fullIn, startOut, endOut],
              [0, 1, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const rise = interpolate(frame, [startFade, fullIn], [18, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            return (
              <div
                key={`${c.text}-${i}`}
                style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: '15%',
                  opacity,
                  transform: `translateY(${rise}px)`,
                  fontSize: isPortrait ? 56 : 64,
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 4px 18px rgba(0,0,0,0.55)',
                }}
              >
                <span
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${brandAccent}33 50%, transparent 100%)`,
                    padding: '8px 24px',
                    borderRadius: 999,
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {c.text}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
