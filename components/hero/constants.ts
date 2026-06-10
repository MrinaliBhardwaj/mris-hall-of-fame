/**
 * Single source of truth for the hero composition.
 *
 * The gradient typography (DOM) and the particle typography (canvas)
 * both read from this file so the two layers stay genuinely
 * "synchronized" — same word, same diagonal, same optical center.
 */

export const WORD = "Portfolio";

/** Luxury-print rose palette. No neon, no chrome — print tonality. */
export const PALETTE = {
  ink: "#080506",
  light: "#FF83B5",
  mid: "#F56AA8",
  deep: "#DC6AA8",
} as const;

/**
 * Composition geometry. Values are intentionally "off-center" so the
 * word reads as a cropped fashion-campaign image rather than centered text.
 */
export const COMPOSITION = {
  /** Diagonal tilt of the whole wordmark, in degrees. */
  rotation: -11,
  /**
   * Capital P advance is wider (+525px) than lowercase p.
   * Use the same optical offset that worked for lowercase — the advance
   * bleeds off both edges and the viewport crops to a campaign image.
   */
  centerX: 0.46,
  centerY: 0.56,
  /**
   * Font size as a fraction of viewport width.
   * Capital "Portfolio" advance is 1877px vs lowercase 1352px (+38.8%).
   * We scale down by that same ratio so the word fills the viewport the
   * same way the reference does: 0.42 × (1352/1877) ≈ 0.302 → 0.32.
   */
  fontVW: 0.32,
  /** Portrait: scale off height so the word stays dramatic on tall screens. */
  fontVH: 0.46,
  /** Clamp so the wordmark stays dramatic but never absurd. */
  fontMin: 180,
  fontMax: 880,
} as const;

/**
 * Single sizing rule shared by BOTH typography layers so they stay aligned.
 *
 * The word scales off whichever viewport axis is more constraining, so it
 * stays oversized and cropped on wide desktops AND tall phones — never
 * "shrunk to fit". Returns device-independent CSS pixels.
 */
export function wordFontPx(width: number, height: number): number {
  const byWidth = COMPOSITION.fontVW * width;
  const byHeight = COMPOSITION.fontVH * height;
  const raw = Math.max(byWidth, byHeight);
  return Math.max(COMPOSITION.fontMin, Math.min(COMPOSITION.fontMax, raw));
}

/** Parallax magnitudes (px of max travel) — "expensive restraint". */
export const PARALLAX = {
  background: 5,
  particles: 11,
  headline: 6,
} as const;

/** Per-layer easing toward the smoothed pointer target. */
export const LERP = {
  pointer: 0.06,
  particle: 0.12,
} as const;
