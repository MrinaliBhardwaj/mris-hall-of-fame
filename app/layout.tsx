import type { Metadata } from "next";
import { Ballet, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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
      className={`${ballet.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
