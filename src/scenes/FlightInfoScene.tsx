import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';
import { KenBurnsImg } from './helpers/KenBurnsImg';

type Props = BrandVideoProps & { isPortrait: boolean };

// 6-10s: real screenshot of the airport modal from the sailing app, slow
// Ken Burns zoom, with a Hebrew caption overlay describing the leg.
export const FlightInfoScene: React.FC<Props> = ({ flightInfo, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();

  const captionIn = interpolate(frame, [8, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const captionOut = interpolate(frame, [102, 118], [1, 0], { extrapolateLeft: 'clamp' });

  // Second caption (cost) fades in later
  const costIn = interpolate(frame, [60, 82], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill>
      <KenBurnsImg
        src="screenshots/07-airport-modal.png"
        durationInFrames={120}
        startScale={1.02}
        endScale={1.14}
        panY={-30}
        vignetteAlpha={0.55}
      />
      {/* Title strip at top */}
      <div style={{
        position: 'absolute', top: 32, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: captionIn * captionOut,
      }}>
        ✈️ הטיסות שלכם — מוכן בדף אחד
      </div>
      {/* Cost pill bottom-center */}
      <div style={{
        position: 'absolute', bottom: isPortrait ? 36 : 56, left: '50%',
        transform: `translateX(-50%) scale(${costIn})`,
        padding: isPortrait ? '12px 28px' : '14px 40px',
        background: brandAccent, color: '#0a3d62',
        borderRadius: 999,
        fontSize: isPortrait ? 26 : 32, fontWeight: 800,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        direction: 'ltr',
        opacity: costIn,
      }}>
        ${flightInfo.totalUsd.toLocaleString()} · ל-{flightInfo.pax}
      </div>
    </AbsoluteFill>
  );
};
