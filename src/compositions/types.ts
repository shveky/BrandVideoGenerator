// Single typed props object that drives every scene.
// Keep all editable inputs here — no scene should have its own private state.

export interface Caption {
  /** Frame within the showcase scene (0 = scene start). */
  fromFrame: number;
  durationInFrames: number;
  text: string;
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
}
