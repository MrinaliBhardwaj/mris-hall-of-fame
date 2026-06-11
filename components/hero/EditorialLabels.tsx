"use client";

import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";

/**
 * The editorial "furniture" — masthead metadata framing the artwork.
 * Treated like the cover lines of a magazine: small, quiet, deliberate.
 */

const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.12 },
  }),
};

const label =
  "text-[11px] uppercase tracking-editorial text-[rgba(var(--fg-rgb),0.55)] theme-transition";

export default function EditorialLabels() {
  return (
    <header className="pointer-events-none absolute inset-0 z-50">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-between px-8 py-7 md:px-12 md:py-9">
        {/* Top row — masthead. */}
        <div className="flex items-start justify-between">
          <motion.div
            custom={0}
            variants={reveal}
            initial="hidden"
            animate="show"
            className={label}
          >
            ui/ux portfolio
          </motion.div>

          <motion.div
            custom={1}
            variants={reveal}
            initial="hidden"
            animate="show"
            className="pointer-events-auto flex flex-col items-end gap-2"
          >
            <span className="text-[11px] uppercase tracking-editorial text-[rgba(var(--fg-rgb),0.45)] theme-transition">
              appearance
            </span>
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Bottom row — credit + scroll cue, balancing the diagonal. */}
        <div className="flex items-end justify-between">
          <motion.div
            custom={3}
            variants={reveal}
            initial="hidden"
            animate="show"
            className={label}
          >
            <span className="text-[rgba(var(--fg-rgb),0.35)] theme-transition">est.</span> new&nbsp;delhi
          </motion.div>

          <motion.div
            custom={4}
            variants={reveal}
            initial="hidden"
            animate="show"
            className={`${label} flex items-center gap-2`}
          >
            scroll
            <span className="inline-block h-[1px] w-8 bg-[rgba(var(--fg-rgb),0.3)] theme-transition" />
          </motion.div>
        </div>
      </div>

      {/* Center credit — set into the composition, on the tie-bar. */}
      <motion.div
        custom={2}
        variants={reveal}
        initial="hidden"
        animate="show"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <span className="block h-[1px] w-24 bg-[rgba(var(--fg-rgb),0.25)] theme-transition mx-auto mb-5" />
        <p
          className="font-serif not-italic leading-[0.95] text-[rgba(var(--fg-rgb),0.85)] theme-transition"
          style={{ fontSize: "clamp(26px, 3.4vw, 50px)" }}
        >
          <span
            className="align-super text-[rgba(var(--fg-rgb),0.55)] theme-transition"
            style={{ fontSize: "0.5em" }}
          >
            ©
          </span>{" "}
          mrinali
          <br />
          bhardwaj
        </p>
      </motion.div>
    </header>
  );
}
