// lib/getSyncCron.ts
import { prisma } from "@/lib/service/private/core/prisma";

export async function getSyncCron() {
  const CRON_NAME = "syncCrypto";

  return await prisma.syncCron.findUnique({
    where: { name: CRON_NAME },
  });
}
