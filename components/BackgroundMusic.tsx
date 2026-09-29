"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

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
      <button
        onClick={toggleMute}
        aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
        className="fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-pine text-paper shadow-lifted transition-transform duration-200 hover:scale-105 md:bottom-6"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  );
}
