import { updateCrypto } from "@/lib/service/private/update/updateCrypto";
import { updateWallet } from "@/lib/service/private/update/updateWallet";

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
  const now = new Date().toLocaleTimeString();
  console.log(`⏰ Cron global lancé à ${now}`);

  try {
    await updateCrypto();
    console.log("✅ updateCrypto() terminé avec succès.");

    await updateWallet();
    console.log("✅ updateWallet() terminé avec succès.\n");
  } catch (error) {
    console.error("❌ Erreur dans le cron global :", error);
  }
}
