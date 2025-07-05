import { NextResponse } from "next/server";
import { buyCrypto } from "@/lib/service/private/crypto/buyCrypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(_req: Request, context: any) {
  const symbol = context.params.symbol.toUpperCase();

  if (symbol === "USDC") {
    return NextResponse.json(
      { error: "Impossible d'acheter USDC" },
      { status: 400 }
    );
  }

  try {
    const result = await buyCrypto(symbol);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erreur achat crypto :", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    );
  }
}
