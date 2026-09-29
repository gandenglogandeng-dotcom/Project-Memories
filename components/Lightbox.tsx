"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Download, Share2, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Memory } from "@/lib/types";
import { formatDateID } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { useEffect, useCallback } from "react";

interface LightboxProps {
  memory: Memory | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ memory, onClose, onNext, onPrev }: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (!memory) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [memory, handleKey]);

  const handleShare = async () => {
    if (!memory) return;
    if (navigator.share) {
      await navigator.share({ title: memory.title, text: memory.description });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 md:right-8 md:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Sebelumnya"
            className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 md:left-6 md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Berikutnya"
            className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 md:right-6 md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-card bg-paper shadow-lifted md:flex-row"
          >
            {/* Media */}
            <div className="relative flex max-h-[50vh] min-h-[240px] flex-1 items-center justify-center bg-ink/95 md:max-h-[90vh]">
                            {memory.mediaType === "video" && memory.youtubeId ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${memory.youtubeId}`}
                  title={memory.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : memory.mediaType === "video" ? (
                <video
                  className="max-h-[50vh] w-full md:max-h-[90vh]"
                  src={memory.fullUrl}
                  controls
                  playsInline
                  poster={memory.thumbnailUrl}
                />
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={memory.fullUrl || memory.thumbnailUrl}
                    alt={memory.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 70vw"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="flex w-full flex-col gap-4 overflow-y-auto p-6 md:w-80 md:shrink-0 md:p-7">
              <Badge className="w-fit border-pine/20 bg-pine/10 text-pine">{memory.category}</Badge>
              <h3 className="font-display text-xl font-semibold text-ink">{memory.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{memory.description}</p>

              <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 text-sm text-ink-soft">
                <span>{formatDateID(memory.date)}</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {memory.location}
                </span>
                {memory.people.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {memory.people.join(", ")}
                  </span>
                )}
              </div>

              <div className="mt-auto flex gap-2 pt-4">
                <a
                  href={memory.fullUrl || memory.thumbnailUrl}
                  download
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-pill bg-pine text-sm font-semibold text-paper transition-colors hover:bg-pine-soft"
                >
                  <Download className="h-4 w-4" /> Unduh
                </a>
                <button
                  onClick={handleShare}
                  className="flex h-11 w-11 items-center justify-center rounded-pill border border-ink/15 text-ink transition-colors hover:border-ink/40"
                  aria-label="Bagikan"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
