import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const start = new Date(`${today}T00:00:00.000Z`);
  const end = new Date(`${today}T23:59:59.999Z`);

  const alreadyRun = await prisma.dailyTriggerUpdateLog.findFirst({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  return NextResponse.json({ alreadyRun: !!alreadyRun });
}

export async function POST(_req: NextRequest) {
  await prisma.dailyTriggerUpdateLog.create({
    data: { date: new Date() },
  });

  return NextResponse.json({ success: true });
}
