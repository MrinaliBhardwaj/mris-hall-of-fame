"use client";

import { useTheme, type Theme } from "./ThemeProvider";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light mode" },
  { value: "pink", label: "Pink mode" },
  { value: "dark", label: "Dark mode" },
];

/**
 * A three-position dial — light / pink / dark — styled after a hardware
 * selector switch (audio gear, camera dials) rather than a generic toggle.
 * A capsule slides between three detents; each carries a small line icon
 * that brightens when selected.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Site theme">
      <span className="theme-toggle__thumb" data-pos={theme} aria-hidden="true" />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          title={option.label}
          data-active={theme === option.value}
          className="theme-toggle__option"
          onClick={() => setTheme(option.value)}
        >
          <ThemeIcon variant={option.value} />
        </button>
      ))}
    </div>
  );
}

function ThemeIcon({ variant }: { variant: Theme }) {
  switch (variant) {
    case "light":
      return (
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
          <circle
            cx="8"
            cy="8"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            <line x1="8" y1="0.75" x2="8" y2="2.35" />
            <line x1="8" y1="13.65" x2="8" y2="15.25" />
            <line x1="0.75" y1="8" x2="2.35" y2="8" />
            <line x1="13.65" y1="8" x2="15.25" y2="8" />
            <line x1="2.64" y1="2.64" x2="3.76" y2="3.76" />
            <line x1="12.24" y1="12.24" x2="13.36" y2="13.36" />
            <line x1="2.64" y1="13.36" x2="3.76" y2="12.24" />
            <line x1="12.24" y1="3.76" x2="13.36" y2="2.64" />
          </g>
        </svg>
      );
    case "dark":
      return (
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
          <path
            d="M14.1 9.4A6.1 6.1 0 0 1 6.6 1.9a6.5 6.5 0 1 0 7.5 7.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
          <path
            d="M8 1.3c2.5 2.8 4.1 5.1 4.1 7.3a4.1 4.1 0 1 1-8.2 0c0-2.2 1.6-4.5 4.1-7.3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
