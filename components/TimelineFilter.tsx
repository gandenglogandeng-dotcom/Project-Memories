"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Memory } from "@/lib/types";

interface TimelineFilterProps {
  categories: Memory["category"][];
  activeCategory: string | "Semua";
  onCategoryChange: (category: string | "Semua") => void;
  weeks: string[];
  activeWeek: string | "Semua";
  onWeekChange: (week: string) => void;
}

export default function TimelineFilter({
  categories,
  activeCategory,
  onCategoryChange,
  weeks,
  activeWeek,
  onWeekChange,
}: TimelineFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Filter kategori */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {["Semua", ...categories].map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "relative shrink-0 rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200",
                active ? "text-paper" : "text-ink-soft hover:bg-ink/[0.05]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-pill bg-pine"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Filter minggu/tanggal */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-soft/60">
          Minggu
        </span>
        <div className="path-dotted h-px w-6 shrink-0" />
        {["Semua", ...weeks].map((week) => (
          <button
            key={week}
            onClick={() => onWeekChange(week)}
            className={cn(
              "shrink-0 rounded-card border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
              activeWeek === week
                ? "border-clay bg-clay/10 text-clay"
                : "border-ink/10 text-ink-soft hover:border-ink/25"
            )}
          >
            {week}
          </button>
        ))}
      </div>
    </div>
  );
}
