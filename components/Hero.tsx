"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import StatsCounter from "./StatsCounter";
import { VaultStats, Memory } from "@/lib/types";

interface HeroProps {
  stats: VaultStats;
  spotlight: Memory[];
}

export default function Hero({ stats, spotlight }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-14 md:px-8 md:pb-28 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Kolom teks ────────────────────────────────────────────────── */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-lg text-pine"
          >
            Logandeng, Gunung Kidul, Daerah Istimewa Yogyakarta
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft"
          >
