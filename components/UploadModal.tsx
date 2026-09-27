"use client";

import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Video,
  Tag,
} from "lucide-react";
import { CATEGORIES } from "@/data/mock-memories";
import { MemoryCategory } from "@/lib/types";
import { uploadToCloudinary, extractYouTubeId } from "@/lib/cloudinary";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface StagedFile {
  file: File;
  previewUrl: string;
  progress: number;
  status: "idle" | "compressing" | "uploading" | "done" | "error";
}

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export default function UploadModal({ open, onClose, onUploaded }: UploadModalProps) {
  const [files, setFiles] = useState<StagedFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<MemoryCategory>(CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [peopleInput, setPeopleInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const staged = accepted.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "idle" as const,
    }));
    setFiles((prev) => [...prev, ...staged]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFiles([]);
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setPeopleInput("");
    setYoutubeUrl("");
    setDone(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const uploadedRecords = [];

      for (let i = 0; i < files.length; i++) {
        const staged = files[i];
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "compressing" } : f))
        );

        let fileToUpload = staged.file;
        // Kompresi hanya untuk gambar; video dibiarkan asli (Cloudinary transcode di server)
        if (staged.file.type.startsWith("image/")) {
          fileToUpload = await imageCompression(staged.file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2400,
            useWebWorker: true,
          });
        }

        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
        );

        const result = await uploadToCloudinary(fileToUpload, (percent) => {
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, progress: percent } : f))
          );
        });

        uploadedRecords.push({
          title: files.length > 1 ? `${title} (${i + 1})` : title,
          description,
          media_type: result.resource_type,
          thumbnail_url: result.secure_url,
          full_url: result.secure_url,
          category,
          date,
          location,
          people: peopleInput.split(",").map((p) => p.trim()).filter(Boolean),
          aspect_ratio: result.width / result.height,
        });

        setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f)));
      }

      // Video YouTube unlisted (opsional, terpisah dari file upload)
      const youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
      if (youtubeId) {
        uploadedRecords.push({
          title,
          description,
          media_type: "video",
          thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
          full_url: "",
          youtube_id: youtubeId,
          category,
          date,
          location,
          people: peopleInput.split(",").map((p) => p.trim()).filter(Boolean),
          aspect_ratio: 1.78,
        });
      }

      // Kirim metadata ke route handler server (memakai service_role key)
      // supaya insert ke Supabase tidak terbentur RLS. Lihat app/api/memories/route.ts
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: uploadedRecords }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan metadata ke database.");

      setDone(true);
      onUploaded?.();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunggah. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 backdrop-blur-sm md:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-paper p-6 shadow-lifted md:rounded-card md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-ink">
                Unggah Kenangan Baru
              </h3>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <CheckCircle2 className="h-14 w-14 text-pine" />
                <p className="font-display text-lg text-ink">Kenangan berhasil disimpan!</p>
                <p className="text-sm text-ink-soft">Terima kasih sudah mengabadikan momen ini.</p>
                <Button onClick={resetForm} className="mt-4">
                  Unggah Lagi
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors",
                    isDragActive ? "border-clay bg-clay/5" : "border-ink/15 hover:border-ink/30"
                  )}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="h-8 w-8 text-ink-soft" />
                  <p className="text-sm font-medium text-ink">
                    Seret & lepas foto/video, atau klik untuk pilih file
                  </p>
                  <p className="text-xs text-ink-soft/70">Bisa banyak file sekaligus — tanpa batas</p>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {files.map((f, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-card bg-ink/5">
                        {f.file.type.startsWith("video") ? (
                          <div className="flex h-full w-full items-center justify-center bg-ink/10">
                            <Video className="h-6 w-6 text-ink-soft" />
                          </div>
                        ) : (
                          <Image src={f.previewUrl} alt="" fill className="object-cover" />
                        )}

                        {f.status !== "idle" && f.status !== "done" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
                            <Loader2 className="h-5 w-5 animate-spin text-paper" />
                          </div>
                        )}
                        {f.status === "done" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-pine/40">
                            <CheckCircle2 className="h-5 w-5 text-paper" />
                          </div>
                        )}
                        {f.status === "idle" && (
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-paper"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Judul momen">
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Belajar membaca bersama"
                      className="input-field"
                    />
                  </Field>
                  <Field label="Tanggal kegiatan">
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Kategori">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                      className="input-field"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Lokasi / Dusun">
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Posko Utama"
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label="Deskripsi">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Ceritakan momen ini secara singkat..."
                    className="input-field resize-none"
                  />
                </Field>

                <Field label="Tag anggota tim (pisahkan koma)">
                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
                    <input
                      value={peopleInput}
                      onChange={(e) => setPeopleInput(e.target.value)}
                      placeholder="Sinta, Bagas, Dian"
                      className="input-field pl-9"
                    />
                  </div>
                </Field>

                <Field label="Link video YouTube unlisted (opsional)">
                  <div className="relative">
                    <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
                    <input
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="input-field pl-9"
                    />
                  </div>
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting || (files.length === 0 && !youtubeUrl)}
                  className="mt-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...
                    </>
                  ) : (
                    "Simpan Kenangan"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
