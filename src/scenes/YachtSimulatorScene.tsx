import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps, RouteWaypoint } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 14-19s: stylized Ionian-coast SVG, boat icon animates from Preveza to Nidri
// along a hardcoded waypoint array. Deterministic — no DOM dependency.
export const YachtSimulatorScene: React.FC<Props> = ({ simulatorRoute, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOut = interpolate(frame, [135, 150], [1, 0], { extrapolateLeft: 'clamp' });

  // Boat travels from waypoint[0] to waypoint[N-1] over frames 25-130
  const TRAVEL_START = 25;
  const TRAVEL_END = 130;
  const segCount = simulatorRoute.length - 1;
  const t = interpolate(frame, [TRAVEL_START, TRAVEL_END], [0, segCount], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const segIdx = Math.min(Math.floor(t), segCount - 1);
  const segFrac = t - segIdx;
  const p1 = simulatorRoute[segIdx];
  const p2 = simulatorRoute[segIdx + 1] || p1;
  const boatX = p1.x + (p2.x - p1.x) * segFrac;
  const boatY = p1.y + (p2.y - p1.y) * segFrac;
  const boatAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

  // Route path stroke draw-in
  const ROUTE_LEN = 110;
  const routeDraw = interpolate(frame, [10, 30], [ROUTE_LEN, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Map fade in
  const mapIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

  // Title
  const titleIn = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wake trail — 3 fixed dots at decreasing distance behind boat
  const trailDots = [0.06, 0.12, 0.18].map((delta, i) => {
    const trailT = Math.max(0, t - delta * segCount);
    const ti = Math.min(Math.floor(trailT), segCount - 1);
    const tf = trailT - ti;
    const tp1 = simulatorRoute[ti];
    const tp2 = simulatorRoute[ti + 1] || tp1;
    return {
      x: tp1.x + (tp2.x - tp1.x) * tf,
      y: tp1.y + (tp2.y - tp1.y) * tf,
      opacity: (0.6 - i * 0.18) * mapIn,
    };
  });

  // Compute path-d for the dotted route line (Catmull-Rom approximation
  // via simple lineTo segments — sufficient at this scale)
  const routePath = simulatorRoute
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  // Convert SVG normalized coords (viewBox 100x60) to HTML label positions
  const labelPos = (x: number, y: number) => ({
    left: `${x}%`,
    top: `${(y / 60) * 100}%`,
  });

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: isPortrait ? '0 4%' : '0 6%',
      opacity: sceneOut,
    }}>
      <div style={{
        opacity: titleIn,
        fontSize: isPortrait ? 36 : 44, fontWeight: 700,
        color: 'rgba(255,255,255,0.85)',
      }}>
        ⛵ הפלגה: פרבזה → נידרי
      </div>

      <div style={{
        position: 'relative',
        width: '100%', maxWidth: isPortrait ? 720 : 1200,
        aspectRatio: '100 / 60',
        borderRadius: 18,
        overflow: 'hidden',
        opacity: mapIn,
        background: 'linear-gradient(180deg, #1a5a8a 0%, #0a3d62 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <svg viewBox="0 0 100 60" width="100%" height="100%" style={{ display: 'block' }} preserveAspectRatio="none">
          {/* Stylized landmass shapes (Greece mainland east + Lefkada island) */}
          <path d="M 78 0 L 100 0 L 100 60 L 86 60 Q 80 55 82 45 Q 85 35 80 25 Q 76 15 78 0 Z" fill="#2a7a4a" opacity="0.55" />
          <path d="M 28 30 Q 24 36 27 44 Q 30 52 26 56 Q 22 58 22 50 Q 22 42 25 36 Q 26 32 28 30 Z" fill="#2a7a4a" opacity="0.55" />

          {/* Route dotted line */}
          <path d={routePath} stroke={brandAccent} strokeWidth="0.8" fill="none"
                strokeDasharray="2 2" strokeDashoffset={routeDraw} pathLength={ROUTE_LEN} strokeLinecap="round" />

          {/* Wake trail */}
          {trailDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="0.7" fill="white" opacity={d.opacity} />
          ))}

          {/* Boat — small triangle, rotated to heading */}
          <g transform={`translate(${boatX} ${boatY}) rotate(${boatAngle})`}>
            <polygon points="-1.6,-1 1.6,0 -1.6,1" fill="white" stroke={brandAccent} strokeWidth="0.3" />
            <line x1="-0.5" y1="-0.4" x2="-0.5" y2="-2" stroke="white" strokeWidth="0.25" />
          </g>

          {/* Stop pins */}
          {simulatorRoute.filter(p => p.label).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.1" fill={brandAccent} stroke="white" strokeWidth="0.3" opacity={mapIn} />
          ))}
        </svg>

        {/* Stop labels (HTML overlay — SVG <text> doesn't honor RTL/font well) */}
        {simulatorRoute.filter(p => p.label).map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            ...labelPos(p.x, p.y),
            transform: 'translate(-50%, -180%)',
            background: brandAccent,
            color: '#0a3d62',
            padding: '3px 12px',
            borderRadius: 999,
            fontSize: isPortrait ? 18 : 20,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            opacity: mapIn,
            pointerEvents: 'none',
          }}>
            {p.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
