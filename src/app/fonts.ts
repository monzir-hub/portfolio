import { Geist, Geist_Mono, Inter_Tight, Newsreader } from "next/font/google";

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

// Italic only: used for single emphasised words, so the regular cut isn't shipped.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: "italic",
  weight: ["400"],
  variable: "--font-newsreader",
  display: "swap",
});

export const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
export const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const latinFonts = `${interTight.variable} ${newsreader.variable} ${geist.variable} ${geistMono.variable}`;
