import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cryptos = await prisma.crypto.findMany({
      orderBy: { symbol: "asc" },
    });
    return NextResponse.json(cryptos);
  } catch (err) {
    console.error("Erreur GET /crypto :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
