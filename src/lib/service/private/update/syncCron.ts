// lib/syncCron.ts
import { prisma } from "@/lib//service/private/core/prisma";

const CRON_NAME = "syncCrypto"; // ou un param si tu veux le rendre générique

export async function updateSyncCron() {
  const now = new Date();

  await prisma.syncCron.upsert({
    where: { name: CRON_NAME },
    update: { lastExecution: now },
    create: { name: CRON_NAME, lastExecution: now },
  });
}
