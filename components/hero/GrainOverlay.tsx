"use client";

import type { CSSProperties } from "react";

/**
 * A near-invisible monochromatic film grain.
 *
 * Implemented as an inline SVG fractal-noise data URI so it ships zero
 * assets and stays crisp at any DPR. `mix-blend-mode: soft-light` lets it
 * enrich the black instead of sitting on top as visible noise. A stepped
 * translate animation gives it the faint "alive" shimmer of real film.
 */
const NOISE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
     </filter>
     <rect width='100%' height='100%' filter='url(#n)'/>
   </svg>`
)}`;

export default function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="grain theme-transition pointer-events-none fixed inset-0 z-40"
        style={{
          backgroundImage: `url("${NOISE}")`,
          backgroundRepeat: "repeat",
          opacity: "var(--grain-opacity)",
          mixBlendMode: "var(--grain-blend)" as CSSProperties["mixBlendMode"],
        }}
      />
      <style jsx>{`
        .grain {
          animation: grain-shift 0.7s steps(4) infinite;
          will-change: transform;
        }
        @keyframes grain-shift {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-3%, 2%);
          }
          50% {
            transform: translate(2%, -4%);
          }
          75% {
            transform: translate(-2%, 3%);
          }
          100% {
            transform: translate(3%, -2%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .grain {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
