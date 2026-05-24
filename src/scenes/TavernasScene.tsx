import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandVideoProps } from '../compositions/types';

type Props = BrandVideoProps & { isPortrait: boolean };

// 19-26s (210 frames). 3-phase compound:
// A: 0-70   — 3×2 grid of all 6 tavernas with star ratings, staggered spring entry
// B: 70-130 — non-featured cards fade out, Maistrali card zooms to center
// C: 130-210 — menu reveals row-by-row (5 dishes)
export const TavernasScene: React.FC<Props> = ({ tavernas, featuredTaverna, brandAccent, isPortrait }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOut = interpolate(frame, [195, 210], [1, 0], { extrapolateLeft: 'clamp' });

  const featuredIdx = tavernas.findIndex(t => t.name === featuredTaverna.name);
  const safeFeaturedIdx = featuredIdx >= 0 ? featuredIdx : 0;

  // Title
  const titleIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase B: zoom-into transition (frames 70-130)
  const phaseB = interpolate(frame, [70, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase C: menu reveal (frames 130-210)
  const menuVisible = frame >= 130;

  const gridCols = isPortrait ? 2 : 3;
  const cardW = isPortrait ? 280 : 320;
  const cardH = isPortrait ? 140 : 160;

  return (
    <AbsoluteFill style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: isPortrait ? '0 4%' : '0 6%',
      opacity: sceneOut,
    }}>
      {/* Title (fades out as menu enters) */}
      <div style={{
        opacity: titleIn * titleOut,
        fontSize: isPortrait ? 36 : 44, fontWeight: 700,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 8,
      }}>
        🍽️ טברנות בנידרי
      </div>

      {!menuVisible && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, ${cardW}px)`,
          gap: 14,
        }}>
          {tavernas.map((t, i) => {
            const isFeatured = i === safeFeaturedIdx;
            const enter = spring({ frame: frame - i * 4, fps, config: { damping: 16 } });
            // Phase B: non-featured cards fade + shrink; featured stays solid
            const phaseBOpacity = isFeatured ? 1 : (1 - phaseB);
            const phaseBScale = isFeatured ? 1 + phaseB * 0.15 : (1 - phaseB * 0.2);
            return (
              <div key={i} style={{
                width: cardW, height: cardH,
                background: isFeatured && phaseB > 0.3
                  ? `linear-gradient(135deg, ${brandAccent}33, ${brandAccent}11)`
                  : 'rgba(255,255,255,0.07)',
                border: `1px solid ${isFeatured && phaseB > 0.3 ? brandAccent : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 14,
                padding: 16,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                opacity: enter * phaseBOpacity,
                transform: `scale(${enter * phaseBScale})`,
                transformOrigin: 'center',
              }}>
                <div style={{ fontSize: isPortrait ? 20 : 22, fontWeight: 800, color: '#fff', direction: 'ltr', textAlign: 'right' }}>
                  {t.name}
                </div>
                {t.sub && (
                  <div style={{ fontSize: isPortrait ? 14 : 15, color: 'rgba(255,255,255,0.7)', direction: 'rtl', textAlign: 'right' }}>
                    {t.sub}
                  </div>
                )}
                <div style={{
                  display: 'inline-flex', alignSelf: 'flex-start', gap: 4,
                  padding: '3px 10px', background: 'rgba(0,0,0,0.35)', borderRadius: 999,
                  fontSize: isPortrait ? 14 : 16, fontWeight: 700, color: brandAccent,
                  direction: 'ltr',
                }}>
                  ⭐ {t.rating}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {menuVisible && (
        <MenuPanel
          featured={featuredTaverna}
          accent={brandAccent}
          frame={frame - 130}
          isPortrait={isPortrait}
        />
      )}
    </AbsoluteFill>
  );
};

const MenuPanel: React.FC<{
  featured: { name: string; menu: { dish: string; priceEur: number }[] };
  accent: string;
  frame: number; // local frame (0 at menu entry)
  isPortrait: boolean;
}> = ({ featured, accent, frame, isPortrait }) => {
  const panelIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headerIn = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      background: 'linear-gradient(145deg, #fdf6e3 0%, #f5ecd6 100%)',
      color: '#0a3d62',
      borderRadius: 18,
      padding: isPortrait ? '24px 28px' : '32px 48px',
      width: isPortrait ? 520 : 720,
      maxWidth: '92%',
      boxShadow: '0 18px 48px rgba(0,0,0,0.4)',
      opacity: panelIn,
      transform: `scale(${0.92 + panelIn * 0.08})`,
      direction: 'rtl',
    }}>
      <div style={{
        textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: 12, marginBottom: 18,
        opacity: headerIn,
      }}>
        <div style={{ fontSize: isPortrait ? 16 : 18, color: '#5a6e60', letterSpacing: 1, marginBottom: 4 }}>
          התפריט של
        </div>
        <div style={{ fontSize: isPortrait ? 32 : 40, fontWeight: 800, direction: 'ltr' }}>{featured.name}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: isPortrait ? 8 : 12 }}>
        {featured.menu.map((m, i) => {
          const rowStart = 20 + i * 8;
          const rowOpacity = interpolate(frame, [rowStart, rowStart + 14], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const rowSlide = interpolate(frame, [rowStart, rowStart + 14], [12, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              fontSize: isPortrait ? 20 : 24, fontWeight: 600,
              opacity: rowOpacity,
              transform: `translateX(${rowSlide}px)`,
            }}>
              <span style={{ flex: 1 }}>{m.dish}</span>
              <span style={{
                flex: 1, borderBottom: '1px dotted #5a6e60', height: 1, margin: '0 8px', transform: 'translateY(-6px)',
              }} />
              <span style={{ color: accent, fontWeight: 800, direction: 'ltr' }}>€{m.priceEur}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
