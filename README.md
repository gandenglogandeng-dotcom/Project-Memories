# Jejak Langkah Logandeng — Digital Memory Vault

Website kenangan digital untuk kegiatan pengabdian masyarakat di Desa Logandeng,
Gunungkidul. Dibangun dengan Next.js 14 (App Router + TypeScript), Tailwind CSS,
Framer Motion, dan disiapkan untuk media tak terbatas lewat Cloudinary + Supabase.

## 1. Struktur Proyek

```
logandeng-memory-vault/
├── app/
│   ├── layout.tsx              # Root layout, font, Navbar
│   ├── page.tsx                # Home: Hero + Gallery + MessageWall
│   ├── globals.css             # Design tokens turunan, base styles
│   ├── admin/
│   │   └── page.tsx            # Gerbang kode akses + trigger UploadModal
│   └── api/
│       ├── admin/verify/route.ts   # Cek kode admin di server
│       └── memories/route.ts       # Insert metadata ke Supabase (service_role)
├── components/
│   ├── Navbar.tsx               # Top nav (desktop) + Bottom tab bar (mobile)
│   ├── Hero.tsx                 # Judul, statistik, polaroid spotlight
│   ├── StatsCounter.tsx         # Angka animasi count-up
│   ├── TimelineFilter.tsx       # Filter kategori & minggu
│   ├── Gallery.tsx              # Masonry grid + infinite scroll + lightbox trigger
│   ├── Lightbox.tsx             # Modal fullscreen: foto/video, caption, unduh, share
│   ├── UploadModal.tsx          # Drag-drop, kompresi, form metadata
│   ├── MessageWall.tsx          # Pojok Cerita & Pesan
│   └── ui/                      # Button, Badge (primitif kecil ala shadcn)
├── lib/
│   ├── types.ts                 # Tipe Memory, GuestMessage, VaultStats
│   ├── supabaseClient.ts        # Client browser & admin + skema SQL di komentar
│   ├── cloudinary.ts            # Upload unsigned + parser YouTube ID
│   └── utils.ts                 # cn(), format tanggal Indonesia
├── data/
│   └── mock-memories.ts         # Data contoh untuk development
└── tailwind.config.ts           # Token warna/tipografi (lihat komentar di file)
```

## 2. Instalasi

```bash
npm install
cp .env.example .env.local   # lalu isi semua variabel
npm run dev
```

## 3. Setup Cloudinary (penyimpanan foto & video, gratis ±25GB/bulan)

1. Buat akun di [cloudinary.com](https://cloudinary.com).
2. Ambil **Cloud Name** dari dashboard → isi `fkw1dpxa`.
3. Masuk ke **Settings → Upload → Upload presets → Add upload preset**:
   - Signing Mode: **Unsigned** (supaya bisa diupload langsung dari browser
     tanpa expose API secret).
   - Folder: `logandeng-memories` (opsional, biar rapi).
   - Copy nama preset ke `mngt3j9y`.
4. Untuk kebutuhan "tanpa batas": Cloudinary free tier cukup besar untuk ribuan
   foto terkompresi. Jika kuota habis, upgrade ke plan berbayar atau pertimbangkan
   **Cloudflare R2** (S3-compatible, storage sangat murah + egress gratis) sebagai
   pengganti — cukup ganti fungsi `uploadToCloudinary` di `lib/cloudinary.ts`
   dengan pemanggilan endpoint upload R2 (lewat presigned URL yang dibuat di
   route handler server).

## 4. Setup Supabase (metadata + pesan tamu)

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan skema yang ada di komentar
   `lib/supabaseClient.ts` (tabel `memories` & `guest_messages`, lengkap
   dengan Row Level Security policy).
3. Ambil **Project URL** & **anon public key** dari **Settings → API** →
   isi `https://ndmutkguffnvvhbqjzfn.supabase.co` & `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbXV0a2d1ZmZudnZoYnFqemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTY0ODksImV4cCI6MjEwNjA5MjQ4OX0.yCRdhvtimWHSYrk--oSP3S9OuQZ9F4A5XSheIBBQnKE`.
4. Ambil **service_role key** (⚠️ rahasia, jangan pernah expose ke client) →
   isi `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbXV0a2d1ZmZudnZoYnFqemZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDUxNjQ4OSwiZXhwIjoyMTA2MDkyNDg5fQ.B2U-G9HDZ-tXRBYQBS5kHuIcRIfhcmdm0YzgHsZJhBg`. Dipakai khusus di
   `app/api/memories/route.ts` untuk insert data upload.
5. Di `app/page.tsx`, uncomment blok fetch Supabase dan hapus data mock
   (`MOCK_MEMORIES`, `MOCK_MESSAGES`) begitu tabel sudah terisi.

## 5. Video via YouTube Unlisted

- Upload video kegiatan ke akun YouTube tim dengan visibility **Unlisted**.
- Tempel link videonya di form Upload (`UploadModal.tsx`) pada field
  "Link video YouTube unlisted" — sistem otomatis mengekstrak video ID
  dan menyimpannya sebagai entri `memories` bertipe `video`.
- Thumbnail otomatis diambil dari `img.youtube.com/vi/{id}/hqdefault.jpg`,
  jadi tidak makan kuota storage sama sekali.

## 6. Halaman Admin

- `/admin` dilindungi kode akses sederhana (`08082026` di `.env.local`,
  dicek di server lewat `/api/admin/verify`). Ini **bukan** autentikasi
  sungguhan — untuk penggunaan jangka panjang oleh banyak anggota tim,
  ganti dengan **Supabase Auth** (email/password atau magic link) dan
  lindungi route `/admin` lewat `middleware.ts`.

## 7. Kenapa Masonry Pakai CSS Columns, Bukan Library?

`Gallery.tsx` memakai `columns-2 sm:columns-3 lg:columns-4` bawaan Tailwind/CSS
alih-alih library masonry pihak ketiga — lebih ringan, tidak perlu re-layout
JS saat resize, dan cukup untuk kebutuhan ribuan item karena dipadukan dengan
**infinite scroll** (`IntersectionObserver` di `Gallery.tsx`) yang hanya
merender 12 item per batch. Ini penting supaya galeri tetap smooth meski
koleksi tumbuh sampai ribuan foto.

## 8. Checklist Sebelum Deploy

- [ ] Semua env var di `.env.example` sudah diisi di dashboard hosting (Vercel dsb).
- [ ] Skema SQL Supabase sudah dijalankan + RLS aktif.
- [ ] Upload preset Cloudinary sudah **unsigned**.
- [ ] `ADMIN_ACCESS_CODE` diganti dari nilai default.
- [ ] Ganti data mock di `app/page.tsx` dengan fetch Supabase asli.
- [ ] Uji coba upload dari HP (kamera langsung) & desktop.
