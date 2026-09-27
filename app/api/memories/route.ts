import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseClient";

/**
 * Menerima metadata media yang sudah diunggah ke Cloudinary dari UploadModal,
 * lalu menyimpannya ke tabel `memories` di Supabase memakai service_role key
 * (aman karena hanya dipanggil dari server, tidak pernah lewat browser).
 *
 * Untuk produksi: tambahkan pengecekan sesi admin di sini juga (mis. cookie
 * dari /api/admin/verify) sebelum mengizinkan insert.
 */
export async function POST(req: NextRequest) {
  try {
    const { records } = await req.json();

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "Tidak ada data untuk disimpan." }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from("memories").insert(records).select();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, inserted: data }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }
}
