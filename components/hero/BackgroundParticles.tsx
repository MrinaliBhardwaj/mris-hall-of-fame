"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { PARALLAX } from "./constants";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { PointerTarget } from "./hooks/usePointer";
import type { Size } from "./hooks/useElementSize";

type Props = {
  pointer: RefObject<PointerTarget>;
  size: Size;
  reducedMotion: boolean;
};

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
};

const MAX_DPR = 1.5;

/**
 * Layer 1 — atmospheric dust.
 *
 * A very sparse field of tiny, slow-drifting motes that twinkle like
 * distant stars. It exists to give the black depth, never to decorate.
 */
export default function BackgroundParticles({
  pointer,
  size,
  reducedMotion,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dustRef = useRef<Dust[]>([]);
  const rafRef = useRef<number>(0);
  const smooth = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    // Read the active theme's dust color from CSS so the particle field
    // stays in sync with the rest of the palette.
    const particleRgb =
      getComputedStyle(canvas).getPropertyValue("--particle-rgb").trim() ||
      "255,221,235";

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const W = size.width;
    const H = size.height;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    // Density scaled to area, kept deliberately sparse.
    const count = Math.min(90, Math.round((W * H) / 26000));
    const dust: Dust[] = [];
    for (let i = 0; i < count; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.06 * dpr,
        vy: (Math.random() - 0.5) * 0.06 * dpr,
        r: (Math.random() * 0.9 + 0.3) * dpr,
        base: 0.06 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.7,
      });
    }
    dustRef.current = dust;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dust) {
        ctx.fillStyle = `rgba(${particleRgb},${d.base})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reducedMotion) {
      drawStatic();
      return () => cancelAnimationFrame(rafRef.current);
    }

    const draw = (now: number) => {
      const t = now / 1000;
      const p = pointer.current ?? { x: 0, y: 0, active: false };
      smooth.current.x += (p.x - smooth.current.x) * 0.04;
      smooth.current.y += (p.y - smooth.current.y) * 0.04;
      const offX = smooth.current.x * PARALLAX.background * dpr;
      const offY = smooth.current.y * PARALLAX.background * dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offX, offY);

      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;

        // Wrap softly around the edges.
        if (d.x < -4) d.x = canvas.width + 4;
        if (d.x > canvas.width + 4) d.x = -4;
        if (d.y < -4) d.y = canvas.height + 4;
        if (d.y > canvas.height + 4) d.y = -4;

        const twinkle = 0.6 + 0.4 * Math.sin(t * d.speed + d.phase);
        ctx.fillStyle = `rgba(${particleRgb},${d.base * twinkle})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size.width, size.height, pointer, reducedMotion, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
