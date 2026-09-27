"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircleHeart } from "lucide-react";
import { GuestMessage } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/Button";

interface MessageWallProps {
  initialMessages: GuestMessage[];
}

const ROTATIONS = [-2, 1.5, -1, 2, -1.5, 1];

export default function MessageWall({ initialMessages }: MessageWallProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);

    const optimistic: GuestMessage = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [optimistic, ...prev]);
    setName("");
    setMessage("");

    // Kirim ke Supabase — lihat skema tabel `guest_messages` di lib/supabaseClient.ts
    const { error } = await supabase.from("guest_messages").insert({
      name: optimistic.name,
      message: optimistic.message,
    });
    if (error) console.error("Gagal mengirim pesan:", error.message);
    setSubmitting(false);
  };

  return (
    <section id="cerita" className="bg-pine px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center gap-3">
          <MessageCircleHeart className="h-6 w-6 text-gold" />
          <div>
            <p className="text-sm font-semibold text-gold">Pojok Cerita & Pesan</p>
            <h2 className="font-display text-display-md text-paper">Tinggalkan Kesanmu</h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-card border border-paper/15 bg-paper/[0.06] p-6 backdrop-blur-sm"
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-paper/70">
                Nama kamu
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="h-11 w-full rounded-card border border-paper/20 bg-paper/[0.08] px-4 text-sm text-paper placeholder:text-paper/40 outline-none transition-colors focus:border-gold"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-paper/70">
                Pesan & kesan
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Tuliskan kesan kamu tentang kegiatan ini..."
                className="w-full resize-none rounded-card border border-paper/20 bg-paper/[0.08] px-4 py-3 text-sm text-paper placeholder:text-paper/40 outline-none transition-colors focus:border-gold"
                required
              />
            </div>
            <Button type="submit" variant="clay" disabled={submitting} className="mt-1">
              <Send className="h-4 w-4" />
              {submitting ? "Mengirim..." : "Kirim Pesan"}
            </Button>
          </form>

          <div className="relative max-h-[480px] overflow-y-auto pr-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotate: ROTATIONS[i % ROTATIONS.length] }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-fit rounded-card bg-paper p-5 shadow-lifted"
                  >
                    <p className="text-[0.95rem] leading-relaxed text-ink">&ldquo;{msg.message}&rdquo;</p>
                    <p className="mt-3 font-display text-sm font-medium text-clay">— {msg.name}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
