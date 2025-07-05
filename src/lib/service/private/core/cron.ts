import { updateCrypto } from "@/lib/service/private/update/updateCrypto";
import { updateWallet } from "@/lib/service/private/update/updateWallet";
import { updateState } from "@/lib/service/private/update/updateState";
import { updateTriggers } from "@/lib/service/private/update/updateTrigger";
import { checkSell } from "@/lib/service/private/update/checkSell";
import { checkBuy } from "@/lib/service/private/update/checkBuy";
import { maybeRunDailyTrigger } from "@/lib/service/private/maybeRunDailyTrigger";

let hasStarted = false;
let isRunning = false;

export async function startCronJobs() {
  if (hasStarted) {
    console.log("⏩ Cron déjà démarré, skip.");
    return;
  }

  hasStarted = true;
  console.log("🔁 Cron initialisé");

  await runUpdate();

  setInterval(async () => {
    if (isRunning) {
      console.log("⏳ Cron précédent toujours en cours, skip.");
      return;
    }

    isRunning = true;
    await runUpdate();
    isRunning = false;
  }, 5 * 60 * 1000);
}

async function runUpdate() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`⏰ Cron global lancé à ${time}`);

  try {
    await updateCrypto();
    await updateWallet();
    await updateState();
    await maybeRunDailyTrigger();
    await checkSell();
    await checkBuy();

    console.log("✅ Cron global terminé avec succès.\n");
  } catch (error) {
    console.error("❌ Erreur dans le cron global :", error);
  }
}
