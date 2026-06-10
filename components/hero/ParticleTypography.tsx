"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { COMPOSITION, PARALLAX, WORD, wordFontPx } from "./constants";
import type { PointerTarget } from "./hooks/usePointer";
import type { Size } from "./hooks/useElementSize";

type Props = {
  pointer: RefObject<PointerTarget>;
  size: Size;
  reducedMotion: boolean;
};

type Particle = {
  hx: number; // home x (device px)
  hy: number; // home y
  x: number;
  y: number;
  r: number; // radius
  base: number; // resting alpha
  phase: number; // twinkle phase
  speed: number; // twinkle speed
  color: [number, number, number];
};

const ROSE: Array<[number, number, number]> = [
  [255, 131, 181], // light
  [245, 106, 168], // mid
  [220, 106, 168], // deep — brightened so right-side particles stay visible
];

const MAX_DPR = 1.5;
const SAMPLE_SCALE = 0.5; // sample the mask at half-res for speed
const INTERACTION_RADIUS = 150; // css px
const TARGET_DESKTOP = 3200;
const TARGET_MOBILE = 1500;

/**
 * Layer 2 — the word, reconstructed entirely from particles.
 *
 * The same Ballet word is rasterized to an offscreen mask, then sampled:
 * every lit pixel becomes a particle anchored to its "home". The shape
 * stays readable on its own. Particles drift, twinkle, and are gently
 * drawn toward the cursor within a soft radius — restrained, not reactive.
 */
export default function ParticleTypography({
  pointer,
  size,
  reducedMotion,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const smooth = useRef({ x: 0, y: 0 });

  // (Re)build the particle field whenever the canvas size changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const W = size.width;
    const H = size.height;

    const family =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-ballet")
        .trim() || "cursive";

    const fontPx = wordFontPx(W, H);

    const build = async () => {
      // Ensure the script face is actually rasterizable before sampling.
      try {
        await document.fonts.load(`${Math.round(fontPx)}px ${family}`);
        await document.fonts.ready;
      } catch {
        /* fall through with whatever is available */
      }
      if (cancelled) return;

      // 1. Rasterize the word to a low-res offscreen mask.
      const sw = Math.max(1, Math.round(W * SAMPLE_SCALE));
      const sh = Math.max(1, Math.round(H * SAMPLE_SCALE));
      const mask = document.createElement("canvas");
      mask.width = sw;
      mask.height = sh;
      const mctx = mask.getContext("2d");
      if (!mctx) return;

      mctx.save();
      mctx.translate(COMPOSITION.centerX * sw, COMPOSITION.centerY * sh);
      mctx.rotate((COMPOSITION.rotation * Math.PI) / 180);
      mctx.fillStyle = "#fff";
      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.font = `${fontPx * SAMPLE_SCALE}px ${family}`;
      mctx.fillText(WORD, 0, 0);
      mctx.restore();

      const data = mctx.getImageData(0, 0, sw, sh).data;

      // 2. Collect candidate points where the mask is lit.
      const candidates: Array<{ x: number; y: number }> = [];
      const step = 2; // in sample px
      for (let y = 0; y < sh; y += step) {
        for (let x = 0; x < sw; x += step) {
          const alpha = data[(y * sw + x) * 4 + 3];
          if (alpha > 90) candidates.push({ x, y });
        }
      }

      // 3. Thin to a target count (denser screens → cap for perf).
      const target = W < 760 ? TARGET_MOBILE : TARGET_DESKTOP;
      const keep =
        candidates.length > target ? target / candidates.length : 1;

      const particles: Particle[] = [];
      for (let i = 0; i < candidates.length; i++) {
        if (keep < 1 && Math.random() > keep) continue;
        const c = candidates[i];
        // Map from sample space → device space, with a touch of jitter.
        const jx = (Math.random() - 0.5) * 1.4;
        const jy = (Math.random() - 0.5) * 1.4;
        const hx = ((c.x + jx) / SAMPLE_SCALE) * dpr;
        const hy = ((c.y + jy) / SAMPLE_SCALE) * dpr;
        particles.push({
          hx,
          hy,
          x: hx,
          y: hy,
          r: (0.7 + Math.random() * 0.8) * dpr,
          base: 0.38 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.1,
          color: ROSE[(Math.random() * ROSE.length) | 0],
        });
      }
      particlesRef.current = particles;

      // 4. Size the visible canvas.
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      startLoop(dpr, W, H);
    };

    const startLoop = (dpr: number, W: number, H: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const draw = (now: number) => {
        const t = now / 1000;
        const particles = particlesRef.current;

        // Smooth the pointer locally for this layer's parallax depth.
        const p = pointer.current ?? { x: 0, y: 0, active: false };
        smooth.current.x += (p.x - smooth.current.x) * 0.06;
        smooth.current.y += (p.y - smooth.current.y) * 0.06;
        const offX = smooth.current.x * PARALLAX.particles * dpr;
        const offY = smooth.current.y * PARALLAX.particles * dpr;

        // Cursor position in device space.
        const mx = (p.x * 0.5 + 0.5) * W * dpr;
        const my = (p.y * 0.5 + 0.5) * H * dpr;
        const radius = INTERACTION_RADIUS * dpr;
        const radiusSq = radius * radius;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(offX, offY);

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];

          // Subtle home drift — keeps the word legible.
          const driftX = Math.sin(t * pt.speed + pt.phase) * 1.3 * dpr;
          const driftY = Math.cos(t * pt.speed * 0.9 + pt.phase) * 1.3 * dpr;
          let tx = pt.hx + driftX;
          let ty = pt.hy + driftY;

          // Gentle, falloff-weighted attraction toward the cursor.
          let glow = 0;
          if (p.active) {
            const dx = mx - offX - pt.x;
            const dy = my - offY - pt.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < radiusSq) {
              const f = 1 - Math.sqrt(dSq) / radius; // 0..1
              tx += dx * 0.06 * f;
              ty += dy * 0.06 * f;
              glow = f * f * 0.5; // soft local brightening
            }
          }

          pt.x += (tx - pt.x) * 0.12;
          pt.y += (ty - pt.y) * 0.12;

          // Twinkle shimmer + local glow, clamped.
          const twinkle = 0.72 + 0.28 * Math.sin(t * pt.speed + pt.phase);
          const alpha = Math.min(1, pt.base * twinkle + glow);

          const [r, g, b] = pt.color;
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r + glow * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        rafRef.current = requestAnimationFrame(draw);
      };

      cancelAnimationFrame(rafRef.current);

      if (reducedMotion) {
        // Static, legible render — no loop.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const pt of particlesRef.current) {
          const [r, g, b] = pt.color;
          ctx.fillStyle = `rgba(${r},${g},${b},${pt.base})`;
          ctx.beginPath();
          ctx.arc(pt.hx, pt.hy, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    void build();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [size.width, size.height, pointer, reducedMotion]);

  // Note: requestAnimationFrame is automatically throttled/paused by the
  // browser in background tabs, so no manual visibility gating is needed.

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
    />
  );
}
