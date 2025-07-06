// app/api/cron/route.ts
import { NextResponse } from "next/server";
import { getSyncCron } from "@/lib/service/public/getter/getSyncCron";

const FREQUENCY_MINUTES = 5;

export async function GET() {
  const cron = await getSyncCron();

  if (!cron) {
    return NextResponse.json({ error: "Cron not found" }, { status: 404 });
  }

  const now = new Date();
  const last = new Date(cron.lastExecution);
  const next = new Date(last.getTime() + FREQUENCY_MINUTES * 60000);

  return NextResponse.json({
    lastExecution: last.toISOString(),
    nextExecution: next.toISOString(),
  });
}
