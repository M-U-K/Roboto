import { NextResponse } from "next/server";
import { getTriggerInfo } from "@/lib/service/public/getTriggerInfo";

export async function GET() {
  try {
    const data = await getTriggerInfo();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur /api/trigger", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
