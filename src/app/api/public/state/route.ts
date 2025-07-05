// app/api/public/state/route.ts
import { NextResponse } from "next/server";
import { getState } from "@/lib/service/public/getter/getState";

export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json(state);
  } catch (err) {
    console.error("Erreur dans /api/public/state :", err);
    return NextResponse.json(
      { error: "Impossible de charger l'état du système" },
      { status: 500 }
    );
  }
}
