import { NextResponse } from "next/server";
import { sellCrypto } from "@/lib/service/private/crypto/sellCrypto";

export async function POST(_req: Request, context: any) {
  const symbol = context.params?.symbol?.toUpperCase();

  if (!symbol || symbol === "USDC") {
    return NextResponse.json(
      { error: "Symbol manquant ou invalide" },
      { status: 400 }
    );
  }

  try {
    const result = await sellCrypto(symbol);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Erreur vente crypto :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
