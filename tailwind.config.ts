import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080506",
        rose: {
          light: "#FF83B5",
          mid: "#F56AA8",
          deep: "#C45B92",
        },
      },
      fontFamily: {
        ballet: ["var(--font-ballet)", "cursive"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
