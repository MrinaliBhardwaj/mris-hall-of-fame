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
 * Composition geometry — measured directly from the Figma frame
 * "Desktop 3" (landing frame, node 42:262), text node 40:110 ("Portfolio",
 * the pink wordmark) against its 1440x1035 frame:
 *
 *   font-size: 819.392px
 *   bbox:      x -251.5..1817.5 (w 2069), y 101.89..1084.89 (h 983)
 *   (landing frame itself sits at x:-343, y:44 within the 1440-wide viewport)
 *
 * Converted to viewport-relative fractions (1440x1035 reference):
 *   bbox width / viewport width   = 1.4368
 *   bbox left  / viewport width   = -0.4128
 *   bbox center                   = (0.3056, 0.6159) of the viewport
 *
 * Figma's "Ballet" renders ~2.53px of glyph width per 1px of font-size
 * (2069 / 819.392). Our browser's Ballet build renders noticeably wider
 * (~3.10px per 1px of font-size) — same font-size would over-crop "lio".
 * fontVW/fontVH are therefore solved so OUR rendered bbox matches Figma's
 * bbox-width-to-viewport ratio (1.4368), not Figma's literal font-size:
 *   fontVW = 1.4368 / 3.105 ≈ 0.463 (and fontVH scaled by the same factor)
 *
 * At this scale "Portfolio" reads in full — "lio" is cropped only ~2.4% off
 * the right edge, "P" bleeds well off the left — matching the reference.
 * Do not enlarge further; a larger scale pushes "lio" entirely off-frame.
 */
export const COMPOSITION = {
  /** No rotation — the diagonal comes from the script italic + cropping. */
  rotation: 0,
  /** Optical center of the wordmark bbox, per the Figma frame. */
  centerX: 0.306,
  centerY: 0.616,
  /** Font size as a fraction of viewport width — solved for our font's metrics. */
  fontVW: 0.463,
  /** Font size as a fraction of viewport height — solved for our font's metrics. */
  fontVH: 0.644,
  /** Clamp so the wordmark stays dramatic but never absurd. */
  fontMin: 140,
  fontMax: 900,
  /**
   * Tighten the gap after the capital "P" so "ortfolio" sits close behind
   * it. Figma's literal -1.76px tracking (≈ -0.00215em at its font-size)
   * left a visible gap on our font; pulled in further so "P" sits close
   * against the "o", per the reference composition. Applied as a negative
   * margin on the "ortfolio" span — NOT as letter-spacing across the whole
   * word, which would collapse every inter-letter gap.
   */
  pKerning: "-0.06em",
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

/**
 * The white dotted "echo" wordmark — a SEPARATE second copy of "Portfolio",
 * smaller and offset from the pink layer, filled with a sparse dot pattern.
 *
 * Measured from Figma node 40:111 against the pink layer (40:110):
 *   font-size ratio: 783.496 / 819.392 = 0.9562
 *   bbox top-left offset: +30.22px / +55.12px (at the pink font-size)
 *   bbox center offset:   +4.72px / +33.62px  (at the pink font-size)
 *     -> as a fraction of the pink font-size: +0.0058 / +0.0410
 *
 * Our layout centers each copy independently (-translate-1/2), so the
 * CENTER offset is what reproduces the Figma composition: the dotted echo
 * sits very slightly right and noticeably below the pink wordmark's center,
 * at ~95.6% of its size — a soft halo, not an overlay on the same glyphs.
 */
export const ECHO = {
  /** Dotted-layer font size as a fraction of the pink wordmark's font size. */
  scale: 0.9562,
  /** Center offset (x, y) as a fraction of the PINK font size. */
  offsetXEm: 0.0058,
  offsetYEm: 0.041,
  /**
   * The dotted layer's own "P" tracking — kept proportional to the pink
   * layer's tightened pKerning (ratio matches Figma's -0.96px / -1.76px
   * tracking ratio between the two layers, ≈0.545).
   */
  pKerning: "-0.0327em",
} as const;

/**
 * The dot-grid fill of the white "echo" wordmark.
 *
 * Per the Figma source this is a sparse dot pattern clipped to the echo's
 * letterforms — small, low-density dots that read as "stars trapped inside
 * the typography shape," mostly negative space. It is a static texture: the
 * shape never moves, drifts, or displaces.
 *
 * Motion is restrained to opacity-only twinkles: a slow ambient shimmer
 * plus a soft cursor-following highlight that brightens nearby dots.
 */
export const SPARKLE = {
  /** Dot radius as a fraction of the echo layer's font size. */
  dotRadius: 0.0026,
  /** Dot grid spacing as a fraction of the echo layer's font size — sparse. */
  dotSpacing: 0.04,
  /** Resting opacity of the ambient dot texture. */
  baseOpacity: 0.5,
  /** Peak opacity of the brighter cursor-highlight dots. */
  highlightOpacity: 0.85,
  /** Radius (px) of the soft cursor-following highlight. */
  highlightRadius: 160,
} as const;

/** Parallax magnitudes (px of max travel) — "expensive restraint". */
export const PARALLAX = {
  background: 5,
  headline: 6,
} as const;
