// /app/api/crypto/add/route.ts
import { NextResponse } from "next/server";
import { addNewCrypto } from "@/lib/service/private/crypto/addNewCrypto";

export async function GET() {
  try {
    const added = await addNewCrypto();

    if (added) {
      return NextResponse.json({
        success: true,
        message: `Crypto ajoutée : ${added.symbol}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message:
          "Aucune crypto ajoutée (sécurité insuffisante ou plus de candidates).",
      });
    }
  } catch (error) {
    console.error("Erreur ajout crypto :", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
