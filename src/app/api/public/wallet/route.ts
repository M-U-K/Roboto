// app/api/public/wallet/route.ts
import { NextResponse } from "next/server";
import { getWallet } from "@/lib/service/public/getter/getWallet";

export async function GET() {
  try {
    const wallet = await getWallet();
    return NextResponse.json(wallet);
  } catch (err) {
    console.error("Erreur dans /api/public/wallet :", err);
    return NextResponse.json(
      { error: "Impossible de charger le portefeuille." },
      { status: 500 }
    );
  }
}
