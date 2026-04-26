import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ taxaJuros: 0 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const current = await getSettings();
    const updated = { ...current, taxaJuros: Number(body.taxaJuros) || 0 };
    await setSettings(updated);
    return NextResponse.json(updated);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("PUT /api/settings error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
