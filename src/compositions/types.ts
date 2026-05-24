// Single typed props object that drives every scene.
// Keep all editable inputs here — no scene should have its own private state.

export interface Caption {
  /** Frame within the showcase scene (0 = scene start). */
  fromFrame: number;
  durationInFrames: number;
  text: string;
}

// --- Flight info (one card per leg) ---
export interface FlightLeg {
  airline: string;
  flightNo: string;
  from: string;   // airport code, e.g. "TLV"
  to: string;     // airport code, e.g. "PVK"
  depart: string; // human time, e.g. "06:00"
  arrive: string; // human time, e.g. "08:40"
  date: string;   // human date, e.g. "06.06.2026"
  durationHM: string; // e.g. "2:40"
}
export interface FlightInfo {
  outbound: FlightLeg;
  return: FlightLeg;
  totalUsd: number;
  pax: number;
}

// --- Yacht specs ---
export interface YachtSpecs {
  model: string;       // "Bali 4.2"
  year: number;        // 2021
  lengthM: number;     // 12.85
  beamM: number;       // 7.08
  cabins: number;      // 4
  berths: string;      // "8+1"
  engines: string;     // "2×45 HP"
  charterType: string; // "Bareboat"
}

// --- Yacht simulator waypoint (normalized SVG-viewBox coords) ---
export interface RouteWaypoint {
  x: number;       // 0–100 within SVG viewBox 0 0 100 100
  y: number;       // 0–100
  label?: string;  // optional stop name to render at this point
}

// --- Tavernas overview (grid) + featured (zoom) ---
export interface Taverna {
  name: string;
  rating: number;
  sub?: string;
}
export interface MenuItem {
  dish: string;
  priceEur: number;
}
export interface FeaturedTaverna {
  name: string;
  menu: MenuItem[];
}

// --- Nightlife venues ---
export interface NightlifeVenue {
  name: string;
  imageSrc: string;   // path under public/, e.g. "dancefloor.jpg"
  tagline: string;    // short Hebrew descriptor
}

export interface BrandVideoProps {
  appName: string;
  tagline: string;
  hookLine: string;
  ctaText: string;
  appUrl: string;
  /** Path inside public/ — e.g. "logo.png" or "logo.svg". */
  logoSrc: string;
  /** Showcase image or short video clip inside public/. */
  mediaSrc: string;
  /** Hex color for the brand background. */
  brandBg: string;
  /** Hex color for brand accents (highlights, CTA). */
  brandAccent: string;
  captions: Caption[];
  // New fields (v2 expansion):
  flightInfo: FlightInfo;
  yachtSpecs: YachtSpecs;
  simulatorRoute: RouteWaypoint[];
  tavernas: Taverna[];
  featuredTaverna: FeaturedTaverna;
  nightlifeVenues: NightlifeVenue[];
}
