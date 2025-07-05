// app/api/public/crypto/route.ts
import { NextResponse } from "next/server";
import { getCryptoList } from "@/lib/service/public/getter/getCrypto";

export async function GET() {
  try {
    const cryptos = await getCryptoList();
    return NextResponse.json(cryptos);
  } catch (err) {
    console.error("Erreur dans /api/public/crypto :", err);
    return NextResponse.json(
      { error: "Impossible de charger les cryptos." },
      { status: 500 }
    );
  }
}
