import type { Metadata } from "next";
import { Ballet, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme/ThemeProvider";

/**
 * Ballet — the script that becomes the artwork.
 * We expose its resolved family name as a CSS variable so the
 * <canvas> particle layer can render the exact same typeface.
 */
const ballet = Ballet({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ballet",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mrinali Bhardwaj — Portfolio",
  description:
    "Mrinali Bhardwaj. Designer + Creative Technologist. UI/UX portfolio, update 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`theme-pink ${ballet.variable} ${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
