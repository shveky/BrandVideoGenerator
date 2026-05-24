import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps, FlightLeg } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 6-10s: two flight cards (outbound + return) springing in, total-cost pill
// scales up at frame 90. Layout: side-by-side landscape, stacked portrait.
export const FlightInfoScene: React.FC<Props> = ({ flightInfo, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOut = interpolate(frame, [108, 120], [1, 0], { extrapolateLeft: 'clamp' });

  const outboundIn = spring({ frame, fps, config: { damping: 16 } });
  const returnIn = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const pillIn = spring({ frame: frame - 75, fps, config: { damping: 14 } });
  const pillFade = interpolate(frame, [75, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isPortrait ? '0 6%' : '0 8%', gap: 32,
      opacity: sceneOut,
    }}>
      <div style={{
        fontSize: isPortrait ? 36 : 42, fontWeight: 700,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 8,
      }}>
        ✈️ הטיסות שלכם
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isPortrait ? 'column' : 'row',
        gap: isPortrait ? 28 : 40,
        alignItems: 'stretch', justifyContent: 'center',
        width: '100%', maxWidth: isPortrait ? 600 : 1400,
      }}>
        <div style={{ transform: `scale(${outboundIn})`, opacity: outboundIn }}>
          <FlightCard leg={flightInfo.outbound} label="הלוך" accent={brandAccent} isPortrait={isPortrait} />
        </div>
        <div style={{ transform: `scale(${returnIn})`, opacity: returnIn }}>
          <FlightCard leg={flightInfo.return} label="חזור" accent={brandAccent} isPortrait={isPortrait} />
        </div>
      </div>

      <div style={{
        marginTop: 8,
        padding: isPortrait ? '12px 32px' : '14px 44px',
        background: brandAccent, color: '#0a3d62',
        borderRadius: 999,
        fontSize: isPortrait ? 28 : 34, fontWeight: 800,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        transform: `scale(${pillIn})`, opacity: pillFade,
        direction: 'ltr', // money sign + number reads LTR
      }}>
        ${flightInfo.totalUsd.toLocaleString()} <span style={{ fontSize: '0.55em', fontWeight: 600, opacity: 0.8 }}>· ל-{flightInfo.pax} נוסעים</span>
      </div>
    </AbsoluteFill>
  );
};

const FlightCard: React.FC<{ leg: FlightLeg; label: string; accent: string; isPortrait: boolean }> = ({ leg, label, accent, isPortrait }) => {
  const cardWidth = isPortrait ? '100%' : 480;
  const fontMd = isPortrait ? 26 : 28;
  const fontLg = isPortrait ? 56 : 64;
  const fontSm = isPortrait ? 18 : 20;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 18,
      padding: '22px 28px',
      width: cardWidth,
      display: 'flex', flexDirection: 'column', gap: 12,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: fontSm, fontWeight: 700, color: accent, letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: fontSm, color: 'rgba(255,255,255,0.7)', direction: 'ltr' }}>
          {leg.airline} · {leg.flightNo}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, direction: 'ltr' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: fontLg, fontWeight: 800, lineHeight: 1, letterSpacing: 1 }}>{leg.from}</div>
          <div style={{ fontSize: fontMd, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{leg.depart}</div>
        </div>
        <div style={{ fontSize: fontMd, color: accent }}>
          <span>✈</span>
          <div style={{ fontSize: fontSm * 0.7, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{leg.durationHM}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: fontLg, fontWeight: 800, lineHeight: 1, letterSpacing: 1 }}>{leg.to}</div>
          <div style={{ fontSize: fontMd, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>{leg.arrive}</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: fontSm, color: 'rgba(255,255,255,0.6)', direction: 'ltr' }}>
        {leg.date}
      </div>
    </div>
  );
};
