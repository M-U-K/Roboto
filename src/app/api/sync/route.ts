import { NextResponse } from "next/server";
import { performFullSync } from "@/lib/service/private/sync/performFullSync";

export async function GET() {
  try {
    const allCryptos = await performFullSync();
    return NextResponse.json(allCryptos);
  } catch (error) {
    console.error("Erreur dans /api/sync", error);
    return NextResponse.json([]);
  }
}
