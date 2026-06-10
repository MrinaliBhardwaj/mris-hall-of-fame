"use client";

import { PALETTE, WORD } from "./constants";
import BackgroundParticles from "./BackgroundParticles";
import EditorialLabels from "./EditorialLabels";
import GrainOverlay from "./GrainOverlay";
import HeroTypography from "./HeroTypography";
import PortfolioSparkle from "./PortfolioSparkle";
import { useElementSize } from "./hooks/useElementSize";
import { usePointer } from "./hooks/usePointer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

/**
 * The hero, as an art-directed editorial cover.
 *
 * Stacking order (back → front):
 *   1. Background dust            (z-10)  — atmosphere
 *   2. Gradient wordmark          (z-30)  — the hero artwork
 *   3. Dot-grid sparkle texture   (z-35)  — locked to the wordmark
 *   4. Grain                      (z-40)  — film texture
 *   5. Editorial labels           (z-50)  — masthead furniture
 *
 * One pointer source drives the background parallax and headline depth;
 * the sparkle texture is locked to the wordmark and only twinkles in place.
 */
export default function Hero() {
  const { ref, size } = useElementSize<HTMLElement>();
  const pointer = usePointer();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      aria-label={`${WORD} — Mrinali Bhardwaj, designer and creative technologist`}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{
        backgroundColor: PALETTE.ink,
        // Faint off-center vignette warms the black toward rose.
        backgroundImage:
          "radial-gradient(120% 120% at 38% 42%, rgba(196,91,146,0.10), rgba(8,5,6,0) 55%)",
      }}
    >
      {/* Accessible heading for screen readers / SEO — the visible word is decorative. */}
      <h1 className="sr-only">
        Mrinali Bhardwaj — Designer and Creative Technologist. Portfolio, 2026.
      </h1>

      <BackgroundParticles
        pointer={pointer}
        size={size}
        reducedMotion={reducedMotion}
      />
      <HeroTypography
        pointer={pointer}
        size={size}
        reducedMotion={reducedMotion}
      />
      <PortfolioSparkle
        pointer={pointer}
        size={size}
        reducedMotion={reducedMotion}
      />

      <GrainOverlay />
      <EditorialLabels />
    </section>
  );
}
