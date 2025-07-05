import { updateTriggers } from "@/lib/service/private/update/updateTrigger";
import {
  hasDailyTriggerRun,
  logDailyTriggerExecution,
} from "@/lib/service/public/log/createDailyTriggerLog";

export async function maybeRunDailyTrigger() {
  const now = new Date();
  const isAfterNoon = now.getHours() >= 12;

  if (!isAfterNoon) return;

  const alreadyRun = await hasDailyTriggerRun();

  if (alreadyRun) {
    console.log("📌 updateTriggers() déjà exécuté aujourd’hui, skip.");
    return;
  }

  const time = now.toLocaleTimeString();
  console.log(`🕛 Déclenchement de updateTriggers() à ${time}`);

  await updateTriggers();
  await logDailyTriggerExecution();

  console.log(`✅ updateTriggers() exécuté et loggé.`);
}
