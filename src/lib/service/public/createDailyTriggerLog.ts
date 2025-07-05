import { prisma } from "@/lib/service/private/core/prisma";

export async function hasDailyTriggerRun(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const start = new Date(`${today}T00:00:00.000Z`);
  const end = new Date(`${today}T23:59:59.999Z`);

  const log = await prisma.dailyTriggerUpdateLog.findFirst({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  return !!log;
}

export async function logDailyTriggerExecution(): Promise<void> {
  await prisma.dailyTriggerUpdateLog.create({
    data: {
      date: new Date(),
    },
  });
}
