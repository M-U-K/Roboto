import { NextResponse } from "next/server";
import { getTriggerInfo } from "@/lib/service/public/getter/getTrigger";

export async function GET() {
  try {
    const data = await getTriggerInfo();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur dans /api/public/trigger :", err);
    return NextResponse.json(
      { error: "Impossible de charger les données de trigger." },
      { status: 500 }
    );
  }
}
