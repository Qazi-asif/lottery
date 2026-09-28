import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Variable-font `axes` (SOFT / WONK / opsz) are omitted on purpose: Next's
 * Google font loader has been throwing in Vercel production RSC when those
 * extra files are requested. `.wonk` in globals.css still sets
 * font-variation-settings; browsers ignore axes the loaded file does not have.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Every price, count, game number, and jackpot figure renders in this face with
 * tabular figures, so numbers never change width as the board polls.
 */
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScratchCrest — Sell more scratch tickets",
  description:
    "Turn any TV into a live scratch-game display, scan to sell in one second, and see your commission the moment it's earned. Start in minutes — no hardware kit, no sales call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${mono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
