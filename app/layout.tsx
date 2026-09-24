import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * ColorZilla and similar extensions stamp attributes onto <body> before
 * hydration. Next's overlay still reports that even with
 * suppressHydrationWarning, so strip the known attrs before React runs.
 */
const STRIP_EXTENSION_ATTRS = `(function () {
  var attrs = ["cz-shortcut-listen"];
  function strip(node) {
    if (!node || !node.removeAttribute) return;
    for (var i = 0; i < attrs.length; i++) node.removeAttribute(attrs[i]);
  }
  function sweep() {
    strip(document.documentElement);
    strip(document.body);
  }
  sweep();
  new MutationObserver(sweep).observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: attrs,
  });
})();`;

/**
 * Fraunces is the brand voice — a high-contrast serif whose `WONK` axis swaps in
 * angled, irregular terminals. Those three axes are loaded on purpose: the
 * `.wonk` class in globals.css dials them in on display-size lines, which is
 * what keeps headlines from reading like a default UI font.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
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
        <Script
          id="strip-extension-attrs"
          strategy="beforeInteractive"
        >
          {STRIP_EXTENSION_ATTRS}
        </Script>
        {children}
      </body>
    </html>
  );
}
