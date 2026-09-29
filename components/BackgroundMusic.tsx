"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

/**
 * Backsound otomatis. Browser memblokir audio autoplay BERSUARA tanpa
 * interaksi pengguna, jadi trik yang dipakai di sini: begitu pengunjung
 * klik/sentuh apa saja pertama kali di halaman, musik langsung mulai —
 * sedekat mungkin dengan "otomatis" tanpa melanggar kebijakan browser.
 *
 * WAJIB: taruh file audio kamu sendiri di /public/bgm.mp3
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startOnFirstInteraction = () => {
      if (started) return;
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.4;
        audio.play().catch(() => {
          /* diabaikan — kalau tetap diblokir, pengunjung masih bisa pakai tombol manual */
        });
        setStarted(true);
      }
    };

    window.addEventListener("click", startOnFirstInteraction, { once: true });
    window.addEventListener("touchstart", startOnFirstInteraction, { once: true });
    window.addEventListener("scroll", startOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", startOnFirstInteraction);
      window.removeEventListener("touchstart", startOnFirstInteraction);
      window.removeEventListener("scroll", startOnFirstInteraction);
    };
  }, [started]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!started) {
      audio.play().catch(() => {});
      setStarted(true);
      return;
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />

      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="fixed bottom-[5.75rem] right-[4.5rem] z-50 flex items-center gap-2 rounded-pill bg-ink px-4 py-2 text-xs font-medium text-paper shadow-lifted md:bottom-[3.25rem]"
          >
            <Music className="h-3.5 w-3.5 shrink-0 text-gold" />
            <span className="whitespace-nowrap">Klik di sini untuk nyalakan musik 🎵</span>
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-ink" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMute}
        aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
        animate={!started ? { scale: [1, 1.1, 1] } : {}}
        transition={!started ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : {}}
        className="fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-pine text-paper shadow-lifted transition-transform duration-200 hover:scale-105 md:bottom-6"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </motion.button>
    </>
  );
}
