import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#23291E",
          soft: "#4A4F3F",
        },
        paper: {
          DEFAULT: "#F4EBDA",
          dim: "#ECE0C8",
          deep: "#E4D5B0",
        },
        pine: {
          DEFAULT: "#6E1420",
          soft: "#8C2A38",
          dim: "#B98A90",
          50: "#F3E7E8",
        },
        clay: {
          DEFAULT: "#C98A2B",
          soft: "#E0B667",
          deep: "#9C6A1D",
        },
        gold: {
          DEFAULT: "#D4A017",
          soft: "#E8C766",
        },
        stone: {
          DEFAULT: "#DCD0B4",
          dark: "#B7A97F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        card: "0.375rem",
        pill: "999px",
      },
      boxShadow: {
        journal: "0 1px 2px rgba(35,41,30,0.06), 0 8px 24px -12px rgba(35,41,30,0.18)",
        lifted: "0 4px 8px rgba(35,41,30,0.08), 0 16px 40px -16px rgba(35,41,30,0.28)",
      },
      backgroundImage: {
        "paper-grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
