"use client";

import { motion } from "framer-motion";

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

const label = "text-[11px] uppercase tracking-editorial text-white/55";

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
            className="text-right"
          >
            <div className="text-[11px] font-medium uppercase tracking-editorial text-white/80">
              update 2026
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-editorial text-white/45">
              designer + comp&nbsp;sci student
            </div>
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
            <span className="text-white/35">est.</span> new&nbsp;delhi
          </motion.div>

          <motion.div
            custom={4}
            variants={reveal}
            initial="hidden"
            animate="show"
            className={`${label} flex items-center gap-2`}
          >
            scroll
            <span className="inline-block h-[1px] w-8 bg-white/30" />
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
        <span className="block h-[1px] w-24 bg-white/25 mx-auto mb-5" />
        <p className="font-serif text-[15px] italic leading-snug text-white/80">
          <span className="not-italic align-super text-[10px] text-white/45">
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
