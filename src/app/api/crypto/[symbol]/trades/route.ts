import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
  const { symbol } = context.params;

  try {
    const crypto = await prisma.crypto.findUnique({
      where: { symbol },
      include: { trades: true },
    });

    if (!crypto) {
      return NextResponse.json(
        { error: "Crypto non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(crypto.trades);
  } catch (error) {
    console.error("Erreur dans GET /api/crypto/[symbol]/trades :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
