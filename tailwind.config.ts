import type { Config } from "tailwindcss";

/**
 * DESIGN TOKENS — "Jejak Langkah Logandeng"
 * Konsep: buku catatan lapangan (field journal) pengabdian desa —
 * kertas hangat, tinta hijau teh/padi, dan warna senja karst Gunungkidul.
 *
 * Warna dasar:
 *  - ink       #23291E  teks utama, hampir hitam tapi hangat (bukan hitam pekat)
 *  - paper     #F4EBDA  latar kertas tua, condong ke emas — bukan cream generik
 *  - pine      #2E4433  hijau padi/teak tua — warna primer
 *  - pine-soft #4C6B52  hijau sekunder untuk aksen & hover
 *  - clay      #BC6B3A  sienna bakar — warna "senja karst", aksen utama
 *  - gold      #DE9F4E  emas senja — aksen kedua, dipakai tipis-tipis
 *  - stone     #DCD0B4  krem batu kapur — border, divider, kartu netral
 */
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
          DEFAULT: "#2E4433",
          soft: "#4C6B52",
          dim: "#7C927F",
          50: "#EEF2ED",
        },
        clay: {
          DEFAULT: "#BC6B3A",
          soft: "#D89364",
          deep: "#914E27",
        },
        gold: {
          DEFAULT: "#DE9F4E",
          soft: "#EFC488",
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
