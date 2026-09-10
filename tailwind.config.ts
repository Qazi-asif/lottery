import type { Config } from "tailwindcss";

/**
 * Tailwind v4 uses @theme in globals.css as the primary token source.
 * This config documents the design system seed from instructions/06_DESIGN_SYSTEM.md.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        "bg-secondary": "#F7F6F3",
        ink: "#0B0B0C",
        "ink-soft": "#3A3A3C",
        gold: "#B8912F",
        "gold-soft": "#D9C48B",
        border: "#E5E3DD",
        success: "#2F6B4F",
        error: "#8C2F2F",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: "2.5rem",
        h2: "2rem",
        h3: "1.5rem",
        body: "1rem",
        small: "0.875rem",
      },
      maxWidth: {
        marketing: "1200px",
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        modal: "0 4px 24px rgba(0, 0, 0, 0.08)",
      },
    },
  },
};

export default config;
