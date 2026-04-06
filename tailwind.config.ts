import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#22232e",
          "navy-light": "#2d2e3a",
          "navy-dark": "#191a23",
          gold: "#bfb304",
          "gold-light": "#d4c91e",
          "gold-dark": "#a69d03",
          slate: "#3a3b4a",
          muted: "#8b8c9a",
          cream: "#fafaf8",
          "cream-dark": "#f0f0ec",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-in-left": "rcaSlideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "rcaSlideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "rcaScaleIn 0.6s ease-out forwards",
        "fade-in": "rcaFadeIn 0.5s ease-out forwards",
        "fade-in-up": "rcaFadeInUp 0.7s ease-out forwards",
        "pulse-glow": "rcaPulseGlow 2.5s ease-in-out infinite",
        "counter-fill": "rcaCounterFill 1.5s ease-out forwards",
        "marquee": "rcaMarquee 30s linear infinite",
      },
      keyframes: {
        rcaSlideLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        rcaSlideRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        rcaScaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        rcaFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        rcaFadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rcaPulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(191, 179, 4, 0.3)" },
          "50%": { boxShadow: "0 0 0 16px rgba(191, 179, 4, 0)" },
        },
        rcaCounterFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--fill-width)" },
        },
        rcaMarquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
