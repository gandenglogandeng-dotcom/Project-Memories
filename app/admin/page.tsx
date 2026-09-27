"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, UploadCloud } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import { Button } from "@/components/ui/Button";

/**
 * Gerbang akses sederhana berbasis kode (BUKAN pengganti auth sungguhan).
 * Untuk produksi, ganti dengan Supabase Auth (magic link / email-password)
 * dan lindungi route ini lewat middleware.ts.
 */
export default function AdminPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    // Kode dicocokkan di server (app/api/admin/verify) supaya ADMIN_ACCESS_CODE
    // tidak pernah terkirim ke bundle client.
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col items-center justify-center px-6 text-center">
        <LockKeyhole className="h-8 w-8 text-clay" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Akses Admin</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Masukkan kode akses tim untuk mengunggah kenangan baru.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 flex w-full flex-col gap-3">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Kode akses"
            className="input-field text-center"
          />
          {error && <p className="text-xs text-clay-deep">Kode salah, coba lagi.</p>}
          <Button type="submit">Masuk</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-pine" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          Tambahkan Kenangan Baru
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Unggah foto, video, atau tautan YouTube unlisted lengkap dengan ceritanya.
        </p>
        <Button size="lg" className="mt-6" onClick={() => setModalOpen(true)}>
          Buka Form Unggah
        </Button>
      </motion.div>

      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
