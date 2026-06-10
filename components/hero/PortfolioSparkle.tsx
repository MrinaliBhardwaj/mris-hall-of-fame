"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import { COMPOSITION, ECHO, SPARKLE, WORD, wordFontPx } from "./constants";
import type { PointerTarget } from "./hooks/usePointer";
import type { Size } from "./hooks/useElementSize";

type Props = {
  pointer: RefObject<PointerTarget>;
  size: Size;
  reducedMotion: boolean;
};

/**
 * Layer — the white dotted "echo" wordmark.
 *
 * Per the Figma source this is a SECOND, separate copy of "Portfolio" —
 * slightly smaller (≈95.6%) and offset down-and-right from the pink
 * wordmark — filled with a sparse dot pattern. It sits beside/behind the
 * pink glyphs as a soft halo, not on top of them, and never moves: no
 * particle displacement, no parallax drift.
 *
 * The only motion is opacity-based "twinkle":
 *  - a slow ambient shimmer across the dot texture (distant stars), and
 *  - a soft cursor-following highlight that brightens nearby dots
 *    (glitter catching light) — masked to a circle, opacity only.
 */
export default function PortfolioSparkle({ pointer, size, reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);

  // Same sizing rule as the pink wordmark, then scaled down for the echo.
  const wordFontPxValue = size.width
    ? wordFontPx(size.width, size.height)
    : Math.max(COMPOSITION.fontMin, Math.min(COMPOSITION.fontMax, COMPOSITION.fontVW * 1440));

  const fontPx = wordFontPxValue * ECHO.scale;
  const offsetX = ECHO.offsetXEm * wordFontPxValue;
  const offsetY = ECHO.offsetYEm * wordFontPxValue;

  const dotR = Math.max(0.5, fontPx * SPARKLE.dotRadius);
  const spacing = Math.max(2, fontPx * SPARKLE.dotSpacing);

  // Drive the cursor highlight via CSS custom properties — opacity/mask
  // position only, no layout writes, no displacement of the wordmark.
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const loop = () => {
      const p = pointer.current;
      if (p?.active) {
        const mx = (p.x * 0.5 + 0.5) * 100;
        const my = (p.y * 0.5 + 0.5) * 100;
        el.style.setProperty("--sparkle-x", `${mx}%`);
        el.style.setProperty("--sparkle-y", `${my}%`);
        el.style.setProperty("--sparkle-opacity", "1");
      } else {
        el.style.setProperty("--sparkle-opacity", "0");
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pointer, reducedMotion]);

  const dotPattern = `radial-gradient(circle, rgba(255,255,255,0.95) ${dotR}px, transparent ${dotR}px)`;

  // Identical base position to the pink wordmark, plus the echo's small
  // center offset (down and slightly right), measured from Figma.
  const wordTransform = `translate(calc(${(COMPOSITION.centerX - 0.5) * 100}vw + ${offsetX}px), calc(${
    (COMPOSITION.centerY - 0.5) * 100
  }vh + ${offsetY}px)) rotate(${COMPOSITION.rotation}deg)`;

  const sharedTextStyle: CSSProperties = {
    fontSize: `${fontPx}px`,
    color: "transparent",
    backgroundImage: dotPattern,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundRepeat: "repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
  };

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[35]"
      style={
        {
          "--sparkle-x": "50%",
          "--sparkle-y": "50%",
          "--sparkle-opacity": 0,
        } as CSSProperties
      }
    >
      {/* Ambient texture — locked in place, gentle shimmer. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ transform: wordTransform }}>
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-ballet leading-none ${
              reducedMotion ? "" : "animate-sparkle-twinkle"
            }`}
            style={{ ...sharedTextStyle, opacity: SPARKLE.baseOpacity }}
          >
            <span>{WORD.slice(0, 1)}</span>
            <span style={{ marginLeft: ECHO.pKerning }}>{WORD.slice(1)}</span>
          </span>
        </div>
      </div>

      {/* Cursor highlight — same texture, brighter, masked to a soft
          radius around the pointer. Opacity only; the echo never moves. */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-out"
          style={{
            opacity: "var(--sparkle-opacity, 0)",
            maskImage: `radial-gradient(circle ${SPARKLE.highlightRadius}px at var(--sparkle-x) var(--sparkle-y), black, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle ${SPARKLE.highlightRadius}px at var(--sparkle-x) var(--sparkle-y), black, transparent 100%)`,
          }}
        >
          <div className="relative" style={{ transform: wordTransform }}>
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-ballet leading-none"
              style={{ ...sharedTextStyle, opacity: SPARKLE.highlightOpacity }}
            >
              <span>{WORD.slice(0, 1)}</span>
              <span style={{ marginLeft: ECHO.pKerning }}>{WORD.slice(1)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
