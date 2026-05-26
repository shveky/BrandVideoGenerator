import type { BrandVideoProps } from './types';

// v4 timeline (1260 frames = 42s @ 30fps). Added WeatherScene before CTA
// to showcase the Open-Meteo per-stop forecast feature.
export const VIDEO_FPS = 30;
export const VIDEO_DURATION_FRAMES = 1260;

export const TIMELINE = {
  intro:     { from: 0,    durationInFrames: 90  }, // 0-3s
  hook:      { from: 90,   durationInFrames: 90  }, // 3-6s
  tripPlan:  { from: 180,  durationInFrames: 120 }, // 6-10s
  flight:    { from: 300,  durationInFrames: 120 }, // 10-14s
  yacht:     { from: 420,  durationInFrames: 120 }, // 14-18s
  simulator: { from: 540,  durationInFrames: 150 }, // 18-23s
  tavernas:  { from: 690,  durationInFrames: 210 }, // 23-30s
  nightlife: { from: 900,  durationInFrames: 120 }, // 30-34s
  weather:   { from: 1020, durationInFrames: 120 }, // 34-38s NEW
  cta:       { from: 1140, durationInFrames: 120 }, // 38-42s
} as const;

// Defaults match props.json so studio and CLI renders show the same content
// out of the box. Edit either file to change the seeded values.
// Sourced from the sailing app: YACHT_DEFAULT, p_pvk airport modal,
// Nidri's taverna_items + nightlife_items.
export const DEFAULT_PROPS: BrandVideoProps = {
  appName: 'שייט ביוון 2026',
  tagline: 'תכנון השייט הקבוצתי שלכם',
  hookLine: 'כל מה שצריך לתכנן שייט מושלם — במקום אחד',
  ctaText: 'צפו במסלול →',
  appUrl: 'https://storage.googleapis.com/sailing-greece-2026-app',
  logoSrc: 'logo.svg',
  mediaSrc: 'showcase.svg',
  brandBg: '#0a3d62',
  brandAccent: '#e9c46a',
  captions: [
    { fromFrame: 20,  durationInFrames: 70, text: '7 עצירות לאורך הים היוני' },
    { fromFrame: 90,  durationInFrames: 70, text: 'תמונות אמיתיות מ-Google Maps' },
    { fromFrame: 160, durationInFrames: 70, text: 'תכנון מסלול גמיש בדפדפן' },
  ],
  flightInfo: {
    outbound: {
      airline: 'Israir',
      flightNo: '6H543',
      from: 'TLV',
      to: 'PVK',
      depart: '06:00',
      arrive: '08:40',
      date: '06.06.2026',
      durationHM: '2:40',
    },
    return: {
      airline: 'TUS Airways',
      flightNo: 'U8243',
      from: 'PVK',
      to: 'TLV',
      depart: '12:30',
      arrive: '14:45',
      date: '13.06.2026',
      durationHM: '2:15',
    },
    totalUsd: 4757,
    pax: 3,
  },
  yachtSpecs: {
    model: 'Bali 4.2',
    year: 2021,
    lengthM: 12.85,
    beamM: 7.08,
    cabins: 4,
    berths: '8+1',
    engines: '2×45 HP',
    charterType: 'Bareboat',
  },
  // Coast: Preveza (top-right) → channel south → Lefkada east coast → Nidri.
  // Coordinates are SVG-normalized to viewBox "0 0 100 60" used inside the scene.
  simulatorRoute: [
    { x: 75, y:  8, label: 'Preveza' },
    { x: 70, y: 18 },
    { x: 62, y: 26 },
    { x: 55, y: 32 },
    { x: 48, y: 38 },
    { x: 42, y: 44 },
    { x: 38, y: 50 },
    { x: 35, y: 55, label: 'Nidri' },
  ],
  tavernas: [
    { name: 'The Barrel',        rating: 4.6, sub: 'דגים טריים' },
    { name: 'Sapore di Piperi',  rating: 4.5, sub: 'אווירה מסורתית' },
    { name: 'Trata',             rating: 4.4, sub: 'מטבח ים תיכוני' },
    { name: 'Maïstráli',         rating: 4.5, sub: 'משפחתי, אותנטי' },
    { name: 'Basilico',          rating: 4.3, sub: 'מנות גדולות' },
    { name: 'Taverna Karantzis', rating: 4.4, sub: 'דגי הבוקר' },
  ],
  featuredTaverna: {
    name: 'Maïstráli',
    menu: [
      { dish: 'אוקטופוס בגריל',    priceEur: 14 },
      { dish: 'חמיצת ים',         priceEur: 9  },
      { dish: 'סלט יווני',         priceEur: 8  },
      { dish: 'מוסקה ביתית',       priceEur: 12 },
      { dish: 'דג ים בשמן זית',   priceEur: 22 },
    ],
  },
  nightlifeVenues: [
    { name: 'Excess Club',  imageSrc: 'dancefloor.jpg', tagline: 'DJים בינלאומיים · חצות עד עלות השחר' },
    { name: 'The Tree Bar', imageSrc: 'mojito.jpg',    tagline: 'קוקטיילים על הטיילת · שקיעות ולאונג׳' },
  ],
};
