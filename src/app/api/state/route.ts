import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateState } from "@/lib/updateState";

export async function GET() {
  try {
    let state = await prisma.state.findUnique({ where: { id: 1 } });

    if (!state) {
      await updateState();
      state = await prisma.state.findUnique({ where: { id: 1 } });
    }

    if (!state) {
      return NextResponse.json(
        { error: "État introuvable même après tentative de création." },
        { status: 404 }
      );
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("Erreur lecture état global :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
