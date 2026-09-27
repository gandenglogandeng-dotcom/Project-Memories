"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle, MapPin } from "lucide-react";
import { Memory } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { formatMonthID } from "@/lib/utils";
import TimelineFilter from "./TimelineFilter";
import Lightbox from "./Lightbox";

interface GalleryProps {
  memories: Memory[];
  categories: Memory["category"][];
}

const PAGE_SIZE = 12;

/** Kelompokkan tanggal ke label "Minggu" relatif terhadap tanggal termuda di data. */
function getWeekLabel(dateStr: string, earliest: number) {
  const diffDays = Math.floor((new Date(dateStr).getTime() - earliest) / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;
  return `Minggu ${weekNum}`;
}

export default function Gallery({ memories, categories }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [activeWeek, setActiveWeek] = useState<string>("Semua");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const earliest = useMemo(
    () => Math.min(...memories.map((m) => new Date(m.date).getTime())),
    [memories]
  );

  const weeks = useMemo(() => {
    const set = new Set(memories.map((m) => getWeekLabel(m.date, earliest)));
    return Array.from(set).sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]));
  }, [memories, earliest]);

  const filtered = useMemo(() => {
    return memories.filter((m) => {
      const matchCategory = activeCategory === "Semua" || m.category === activeCategory;
      const matchWeek = activeWeek === "Semua" || getWeekLabel(m.date, earliest) === activeWeek;
      return matchCategory && matchWeek;
    });
  }, [memories, activeCategory, activeWeek, earliest]);

  const visible = filtered.slice(0, visibleCount);

  // Reset pagination saat filter berubah
  useEffect(() => setVisibleCount(PAGE_SIZE), [activeCategory, activeWeek]);

  // Infinite scroll: muat batch berikutnya saat sentinel terlihat.
  // Pendekatan ini penting karena koleksi bisa berisi ribuan media —
  // kita tidak pernah merender semuanya sekaligus.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length]);

  return (
    <section id="galeri" className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex flex-col gap-3">
        <p className="text-sm font-semibold text-clay">Core Memories</p>
        <h2 className="font-display text-display-md text-ink">Galeri Kenangan</h2>
        <p className="max-w-xl text-ink-soft">
          Telusuri setiap momen berdasarkan kegiatan atau minggu pengabdian.
        </p>
      </div>

      <div className="mb-8">
        <TimelineFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          weeks={weeks}
          activeWeek={activeWeek}
          onWeekChange={setActiveWeek}
        />
      </div>

      {visible.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink/15 py-20 text-center text-ink-soft">
          Belum ada kenangan untuk filter ini. Coba kategori atau minggu lain.
        </div>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {visible.map((memory, i) => (
            <motion.button
              key={memory.id}
              onClick={() => setActiveIndex(filtered.indexOf(memory))}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-card bg-ink/5 text-left shadow-journal transition-shadow duration-300 hover:shadow-lifted"
            >
              <div className="relative w-full" style={{ aspectRatio: memory.aspectRatio }}>
                <Image
                  src={memory.thumbnailUrl}
                  alt={memory.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {memory.mediaType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-10 w-10 text-paper/90 drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="line-clamp-1 font-display text-sm font-medium text-paper">
                    {memory.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[0.7rem] text-paper/80">
                    <MapPin className="h-3 w-3" /> {memory.location}
                  </div>
                </div>

                <Badge className="absolute left-2 top-2 border-none bg-paper/90 text-ink shadow-sm">
                  {formatMonthID(memory.date)}
                </Badge>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Sentinel untuk infinite scroll */}
      {visibleCount < filtered.length && (
        <div ref={sentinelRef} className="flex justify-center py-10 text-sm text-ink-soft/60">
          Memuat kenangan lainnya…
        </div>
      )}

      <Lightbox
        memory={activeIndex !== null ? filtered[activeIndex] : null}
        onClose={() => setActiveIndex(null)}
        onNext={() => setActiveIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
        onPrev={() =>
          setActiveIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
        }
      />
    </section>
  );
}
