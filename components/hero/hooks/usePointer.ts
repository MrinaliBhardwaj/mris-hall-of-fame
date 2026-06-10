"use client";

import { useEffect, useRef } from "react";

export type PointerTarget = {
  /** Normalized pointer position, -1..1, relative to viewport center. */
  x: number;
  y: number;
  /** Whether a fine pointer is currently present / active. */
  active: boolean;
};

/**
 * Returns a stable ref holding the *raw* normalized pointer target.
 *
 * Crucially this never triggers React re-renders — animation layers read
 * the ref inside their own rAF loop and apply their own smoothing, so a
 * single pointer source can drive independent parallax depths.
 */
export function usePointer() {
  const target = useRef<PointerTarget>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      target.current.x = x;
      target.current.y = y;
      target.current.active = true;
    };

    const onLeave = () => {
      // Ease everything back to rest when the pointer leaves the window.
      target.current.x = 0;
      target.current.y = 0;
      target.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return target;
}
