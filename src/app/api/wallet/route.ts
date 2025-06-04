import { updateWallet } from "@/lib/updateWallet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wallet = await updateWallet();
    return NextResponse.json(wallet);
  } catch (err) {
    console.error("Erreur updateWallet :", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du Wallet" },
      { status: 500 }
    );
  }
}
