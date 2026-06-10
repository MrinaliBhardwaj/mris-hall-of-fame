"use client";

import { useEffect, useRef, useState } from "react";

export type Size = { width: number; height: number };

/**
 * Observes an element's size with a debounced ResizeObserver.
 * Used to rebuild the particle field only after the user stops resizing.
 */
export function useElementSize<T extends HTMLElement>(debounceMs = 160) {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame: number;
    let timer: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      clearTimeout(timer);
      timer = setTimeout(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          setSize({ width: Math.round(width), height: Math.round(height) })
        );
      }, debounceMs);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [debounceMs]);

  return { ref, size };
}
