import type { BrandVideoProps } from './types';

// Defaults match props.json so studio and CLI renders show the same content
// out of the box. Edit either file to change the seeded values.
export const DEFAULT_PROPS: BrandVideoProps = {
  appName: 'טיול בטבע',
  tagline: 'תכנון טיולים בטוח',
  hookLine: 'כל מה שצריך לתכנון מסלול, במקום אחד',
  ctaText: 'התחילו עכשיו →',
  appUrl: 'https://example.com',
  logoSrc: 'logo.svg',
  mediaSrc: 'showcase.svg',
  brandBg: '#0B3D2E',
  brandAccent: '#E8B339',
  captions: [
    { fromFrame: 30,  durationInFrames: 60, text: 'מסלול בכמה לחיצות' },
    { fromFrame: 90,  durationInFrames: 60, text: 'מזג אוויר ובטיחות בזמן אמת' },
    { fromFrame: 150, durationInFrames: 60, text: 'שיתוף עם החברים — אוטומטי' },
  ],
};

// Single source of truth for video timing.
export const VIDEO_FPS = 30;
export const VIDEO_DURATION_FRAMES = 600; // 20 seconds @ 30fps

// Scene timeline (frames within the full 600-frame composition).
export const TIMELINE = {
  intro:    { from: 0,   durationInFrames: 120 }, // 0-4s
  hook:     { from: 120, durationInFrames: 120 }, // 4-8s
  showcase: { from: 240, durationInFrames: 240 }, // 8-16s
  cta:      { from: 480, durationInFrames: 120 }, // 16-20s
} as const;
