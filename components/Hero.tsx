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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-sm font-semibold text-clay"
          >
            Desa Logandeng, Gunungkidul · Catatan Pengabdian
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-display-xl text-ink"
          >
            Jejak Langkah Logandeng
            <br />
            <span className="text-pine">Abadi dalam Kenangan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft"
          >
            Setiap tawa di posko, setiap perbincangan di meja makan, dan setiap
            lagu yang kita nyanyikan — tersimpan di sini.
          </motion.p>

          {/* Garis jejak titik-titik menuju statistik, sesuai nama brand */}
          <div className="path-dotted mt-10 h-px w-24" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 grid grid-cols-3 gap-6 sm:gap-10"
          >
            <StatsCounter value={stats.totalMoments} label="Momen Tercatat" />
            <StatsCounter value={stats.totalDays} label="Hari Pengabdian" />
            <StatsCounter value={stats.totalStories} label="Cerita Warga" />
          </motion.div>
        </div>

        {/* ── Kolom visual: susunan polaroid miring ───────────────────────── */}
        <div className="relative mx-auto h-[420px] w-full max-w-md lg:h-[480px]">
          {spotlight.slice(0, 3).map((memory, i) => {
            const rotations = [-6, 4, -2];
            const positions = [
              "left-0 top-4 w-[62%]",
              "right-0 top-0 w-[52%]",
              "bottom-0 left-[18%] w-[58%]",
            ];
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 24, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: rotations[i] }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
                className={`absolute ${positions[i]} rounded-card bg-paper p-2 shadow-lifted`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
                  <Image
                    src={memory.thumbnailUrl}
                    alt={memory.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <p className="mt-2 truncate px-1 pb-1 font-display text-xs text-ink-soft">
                  {memory.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
