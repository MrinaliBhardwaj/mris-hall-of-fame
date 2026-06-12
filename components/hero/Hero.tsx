"use client";

import dynamic from "next/dynamic";
import { WORD } from "./constants";
import BackgroundParticles from "./BackgroundParticles";
import EditorialLabels from "./EditorialLabels";
import GrainOverlay from "./GrainOverlay";
import HeroTypography from "./HeroTypography";
import PortfolioSparkle from "./PortfolioSparkle";
import { useElementSize } from "./hooks/useElementSize";
import { usePointer } from "./hooks/usePointer";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useTheme } from "@/components/theme/ThemeProvider";

const Dither = dynamic(() => import("./Dither"), { ssr: false });

/** Dark-mode wave color — drawn from the dark theme's wordmark accent. */
const DARK_DITHER_WAVE_COLOR: [number, number, number] = [1, 0.4353, 0.6824];

/** Light-mode wave color — drawn from the light theme's accent. */
const LIGHT_DITHER_WAVE_COLOR: [number, number, number] = [0.9098, 0.3373, 0.5608];
const LIGHT_DITHER_BASE_COLOR: [number, number, number] = [1, 1, 1];

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
  const { theme } = useTheme();

  return (
    <section
      ref={ref}
      aria-label={`${WORD} — Mrinali Bhardwaj, designer and creative technologist`}
      className="theme-transition relative h-[100svh] w-full overflow-hidden"
      style={{
        backgroundColor: "var(--bg)",
        // Faint off-center vignette, tinted per theme, warms the surface toward rose.
        backgroundImage:
          "radial-gradient(120% 120% at 38% 42%, var(--bg-vignette), rgba(var(--bg-rgb),0) 55%)",
      }}
    >
      {/* Accessible heading for screen readers / SEO — the visible word is decorative. */}
      <h1 className="sr-only">
        Mrinali Bhardwaj — Designer and Creative Technologist. Portfolio, 2026.
      </h1>

      {(theme === "dark" || theme === "light") && !reducedMotion && (
        <div className="absolute inset-0 z-0">
          <Dither
            waveColor={
              theme === "dark" ? DARK_DITHER_WAVE_COLOR : LIGHT_DITHER_WAVE_COLOR
            }
            baseColor={
              theme === "dark" ? [0, 0, 0] : LIGHT_DITHER_BASE_COLOR
            }
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={7.1}
            waveAmplitude={0.36}
            waveFrequency={3}
            waveSpeed={0.02}
          />
        </div>
      )}

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
