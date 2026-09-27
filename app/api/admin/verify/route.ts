import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json(
      { error: "ADMIN_ACCESS_CODE belum diset di server." },
      { status: 500 }
    );
  }

  if (code === process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Kode salah." }, { status: 401 });
}
