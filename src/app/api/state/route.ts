import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const state = await prisma.state.findUnique({ where: { id: 1 } });

    if (!state) {
      return NextResponse.json(
        { error: "Aucun état trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("Erreur lecture état global :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
