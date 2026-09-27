import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env.local — " +
      "fitur yang butuh database (pesan tamu, dsb) belum akan tersimpan sampai ini diisi."
  );
}

/**
 * Client untuk dipakai di komponen browser ("use client").
 * Hanya punya hak akses sesuai RLS policy anon di Supabase.
 * Memakai URL placeholder saat .env.local belum diisi supaya app tidak crash
 * saat development — panggilan ke Supabase akan gagal dengan rapi (try/catch)
 * sampai kredensial asli diisi.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/**
 * Client untuk dipakai HANYA di server (route handler / server action),
 * memakai service_role key agar bisa insert/update tanpa terbentur RLS.
 * JANGAN pernah import file ini dari komponen client.
 */
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * SKEMA TABEL SUPABASE YANG DIREKOMENDASIKAN (jalankan di SQL Editor):
 * ─────────────────────────────────────────────────────────────────────────
 *
 * create table memories (
 *   id uuid primary key default gen_random_uuid(),
 *   title text not null,
 *   description text default '',
 *   media_type text not null check (media_type in ('image','video')),
 *   thumbnail_url text not null,
 *   full_url text not null,
 *   youtube_id text,
 *   category text not null,
 *   date date not null,
 *   location text default '',
 *   people text[] default '{}',
 *   aspect_ratio numeric default 1,
 *   featured boolean default false,
 *   created_at timestamptz default now()
 * );
 *
 * create table guest_messages (
 *   id uuid primary key default gen_random_uuid(),
 *   name text not null,
 *   message text not null,
 *   created_at timestamptz default now()
 * );
 *
 * -- Aktifkan Row Level Security lalu izinkan publik membaca:
 * alter table memories enable row level security;
 * create policy "Public read memories" on memories for select using (true);
 *
 * alter table guest_messages enable row level security;
 * create policy "Public read messages" on guest_messages for select using (true);
 * create policy "Public insert messages" on guest_messages for insert with check (true);
 *
 * -- Insert/update/delete ke `memories` HANYA lewat service_role key
 * -- (dipanggil dari route handler app/api/memories/route.ts di server),
 * -- supaya orang luar tidak bisa menulis data lewat anon key.
 */
