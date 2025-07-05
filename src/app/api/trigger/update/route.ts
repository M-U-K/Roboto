import { NextResponse } from "next/server";
import { updateTriggers } from "@/lib/updateTriggers";

export async function POST() {
  try {
    await updateTriggers();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] ❌ Erreur dans updateTriggers :", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
