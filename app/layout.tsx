import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundMusic from "@/components/BackgroundMusic";
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jejak Langkah Logandeng | Abadi dalam Kenangan",
  description:
    "Digital Memory Vault kegiatan pengabdian masyarakat di Desa Logandeng, Gunungkidul — kumpulan foto, video, dan cerita yang tak lekang oleh waktu.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-paper font-body text-ink antialiased selection:bg-clay/20 selection:text-ink">
        <Navbar />
        <main className="pb-24 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
