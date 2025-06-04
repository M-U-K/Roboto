import { NextResponse } from "next/server";
import { getBinanceBalance } from "@/lib/binance";

export async function GET() {
  console.log("🔔 API /api/balance appelée");

  try {
    const data = await getBinanceBalance();
    console.log("Balance Binance reçue :", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur Binance :", error);
    return NextResponse.json(
      { error: "Erreur Binance", detail: (error as Error).message },
      { status: 500 }
    );
  }
}
