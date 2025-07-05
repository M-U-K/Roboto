"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = startCronJobs;
// lib/service/private/cron.ts
const updateWallet_1 = require("@/lib/service/private/updateWallet");
let hasStarted = false;
async function startCronJobs() {
    if (hasStarted) {
        console.log("⏩ Cron déjà démarré, skip.");
        return;
    }
    hasStarted = true;
    console.log("🔁 Cron enregistré au démarrage");
    // Premier run immédiat
    console.log("⏱️ Lancement du premier cron immédiatement...");
    runAllCrons();
    // Lancer ensuite toutes les 5 minutes
    setInterval(() => {
        console.log("🔁 Interval déclenché : lancement d'un nouveau cron.");
        runAllCrons();
    }, 1 * 10 * 1000);
}
async function runAllCrons() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`⏰ Cron exécuté à ${timestamp}`);
    try {
        console.log("📦 Appel à updateWallet()");
        await (0, updateWallet_1.updateWallet)();
        console.log("✅ updateWallet() terminé avec succès.");
    }
    catch (err) {
        console.error("❌ Erreur lors du cron :", err);
    }
    console.log("✅ Cron terminé.\n");
}
