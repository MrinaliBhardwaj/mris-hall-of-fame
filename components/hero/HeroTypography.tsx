"use client";

import { useAnimationFrame, useMotionValue, motion } from "framer-motion";
import type { RefObject } from "react";
import { COMPOSITION, PARALLAX, WORD, wordFontPx } from "./constants";
import type { PointerTarget } from "./hooks/usePointer";
import type { Size } from "./hooks/useElementSize";

type Props = {
  pointer: RefObject<PointerTarget>;
  size: Size;
  reducedMotion: boolean;
};

/**
 * Layer 3 — the hero wordmark.
 *
 * A single oversized Ballet word rendered as a luxury rose gradient,
 * tilted on the composition diagonal and cropped by the viewport.
 * A soft, low-opacity bloom copy sits behind it for print-like depth
 * (no neon, no glow — just tonal richness).
 */
export default function HeroTypography({ pointer, size, reducedMotion }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Identical sizing rule to the particle layer. Fall back to a CSS clamp
  // for the first paint, before the section has been measured.
  const fontSize = size.width
    ? `${wordFontPx(size.width, size.height)}px`
    : `clamp(${COMPOSITION.fontMin}px, 42vw, ${COMPOSITION.fontMax}px)`;

  // Independent parallax depth, smoothed per-frame from the shared pointer.
  useAnimationFrame(() => {
    if (reducedMotion || !pointer.current) return;
    const tx = pointer.current.x * PARALLAX.headline;
    const ty = pointer.current.y * PARALLAX.headline;
    x.set(x.get() + (tx - x.get()) * 0.05);
    y.set(y.get() + (ty - y.get()) * 0.05);
  });

  const gradient =
    "linear-gradient(105deg, var(--wordmark-from) 0%, var(--wordmark-via) 46%, var(--wordmark-to) 100%)";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ x, y }}
    >
      <div
        className="relative"
        style={{
          transform: `translate(${(COMPOSITION.centerX - 0.5) * 100}vw, ${
            (COMPOSITION.centerY - 0.5) * 100
          }vh) rotate(${COMPOSITION.rotation}deg)`,
        }}
      >
        {/* Bloom copy — soft depth behind the crisp letters. */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-ballet leading-none"
          style={{
            fontSize,
            backgroundImage: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "blur(26px)",
            opacity: 0.4,
          }}
        >
          <span>{WORD.slice(0, 1)}</span>
          <span style={{ marginLeft: COMPOSITION.pKerning }}>{WORD.slice(1)}</span>
        </span>

        {/* Crisp gradient wordmark with an editorial entrance. */}
        <motion.span
          className="relative block select-none whitespace-nowrap font-ballet leading-none"
          style={{
            fontSize,
            backgroundImage: gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            // Faint top sheen for "glossy print" softness, kept very subtle.
            textShadow: "0 1px 0 rgba(255,255,255,0.06)",
          }}
          initial={
            reducedMotion ? false : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
          }
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <span>{WORD.slice(0, 1)}</span>
          <span style={{ marginLeft: COMPOSITION.pKerning }}>{WORD.slice(1)}</span>
        </motion.span>
      </div>
    </motion.div>
  );
}
