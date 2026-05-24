import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 14-19s: Real screenshot of the sailing app map with the full route shown.
// Camera pans/zooms from the wide view toward the Preveza→Nidri area.
// A small boat SVG icon animates along an overlay path on top of the image.
export const YachtSimulatorScene: React.FC<Props> = ({ brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const DUR = 150;
  const fade = interpolate(frame, [0, 12, DUR - 12, DUR], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Ken Burns — start wide, end zoomed to the top-left region (Preveza/Nidri)
  const scale = interpolate(frame, [0, DUR], [1.0, 1.5], { extrapolateRight: 'clamp' });
  // Pan toward right (in CSS terms with origin center, negative translateX shows the left side)
  const panX = interpolate(frame, [0, DUR], [0, 100], { extrapolateRight: 'clamp' });
  const panY = interpolate(frame, [0, DUR], [0, -40], { extrapolateRight: 'clamp' });

  // Boat overlay — compensated for Ken Burns (scale 1→1.5, pan +100/-40 with origin center).
  // Route on the v2 screenshot is at image-x≈22-28%, image-y≈19-42%.
  // After camera transform, that lands at screen ≈ (27,20) → (16,35).
  const waypoints = [
    { x: 27, y: 20 },  // Preveza (start, scale ≈ 1.07)
    { x: 24, y: 24 },  // entering canal
    { x: 22, y: 27 },  // mid canal
    { x: 19, y: 30 },  // exiting canal
    { x: 17, y: 33 },  // approaching Nidri
    { x: 16, y: 35 },  // Nidri (end, scale ≈ 1.43)
  ];
  const TRAVEL_START = 20;
  const TRAVEL_END = 130;
  const t = interpolate(frame, [TRAVEL_START, TRAVEL_END], [0, waypoints.length - 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const i = Math.min(Math.floor(t), waypoints.length - 2);
  const f = t - i;
  const p1 = waypoints[i];
  const p2 = waypoints[i + 1];
  const boatX = p1.x + (p2.x - p1.x) * f;
  const boatY = p1.y + (p2.y - p1.y) * f;
  const boatAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

  // Title
  const titleIn = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Boat opacity — only show while traveling
  const boatVisible = interpolate(frame, [TRAVEL_START - 2, TRAVEL_START + 8, TRAVEL_END, TRAVEL_END + 10], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fade, overflow: 'hidden', background: '#0a3d62' }}>
      <Img
        src={staticFile('screenshots/01-overview.png')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: 'center',
        }}
      />

      {/* Boat overlay — positioned via percent on the rendered frame */}
      <div style={{
        position: 'absolute',
        left: `${boatX}%`, top: `${boatY}%`,
        transform: `translate(-50%, -50%) rotate(${boatAngle}deg)`,
        opacity: boatVisible,
        pointerEvents: 'none',
      }}>
        <svg width={isPortrait ? 40 : 60} height={isPortrait ? 40 : 60} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="22" fill={brandAccent} opacity="0.4" />
          <polygon points="14,30 46,22 46,38" fill="#fff" stroke={brandAccent} strokeWidth="2" />
          <line x1="30" y1="22" x2="30" y2="6" stroke="#fff" strokeWidth="2" />
        </svg>
      </div>

      {/* Vignette + title */}
      <AbsoluteFill style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: 32, left: 0, right: 0,
        textAlign: 'center',
        fontSize: isPortrait ? 36 : 46, fontWeight: 800,
        color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        opacity: titleIn,
      }}>
        ⛵ הפלגה: פרבזה → נידרי
      </div>
    </AbsoluteFill>
  );
};
