let hasStarted = false;

export async function startCronJobs() {
  if (hasStarted) {
    console.log("⏩ Cron déjà démarré, skip.");
    return;
  }

  hasStarted = true;
  console.log("🔁 Cron enregistré au démarrage");

  // Premier run immédiat
  console.log("⏱️ Lancement du premier cron immédiatement...");
  runAllCrons();

  // Lancer toutes les 5 minutes
  setInterval(() => {
    console.log("🔁 Interval déclenché : lancement d'un nouveau cron.");
    runAllCrons();
  }, 1 * 30 * 1000);
}

async function runAllCrons() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`⏰ Cron exécuté à ${timestamp}`);

  try {
    // === 🔄 API sync classique
    await fetch("http://localhost:3000/api/sync");
    await fetch("http://localhost:3000/api/wallet");
    await fetch("http://localhost:3000/api/state");

    // === 🕛 Trigger spécial l’après-midi uniquement
    const now = new Date();
    const isAfterNoon = now.getHours() >= 12;

    if (isAfterNoon) {
      const res = await fetch("http://localhost:3000/api/trigger/log");
      const { alreadyRun } = await res.json();

      if (!alreadyRun) {
        console.log(
          `[TRIGGER] 🕛 updateTriggers() lancé à ${now.toLocaleTimeString()}`
        );

        const updateRes = await fetch(
          "http://localhost:3000/api/trigger/update",
          {
            method: "POST",
          }
        );
        const updateData = await updateRes.json();

        if (!updateRes.ok) {
          console.error(
            "[TRIGGER] ❌ Erreur dans /trigger/update :",
            updateData.error
          );
          return;
        }

        const postRes = await fetch("http://localhost:3000/api/trigger/log", {
          method: "POST",
        });
        const postData = await postRes.json();

        if (!postRes.ok) {
          console.error(
            "[TRIGGER] ❌ Erreur dans /trigger/log :",
            postData.error
          );
        } else {
          console.log(
            `[TRIGGER] ✅ updateTriggers() loggé pour ${now
              .toISOString()
              .slice(0, 10)}`
          );
        }
      }
    }

    console.log("✅ Cron terminé avec succès.\n");
  } catch (err) {
    console.error("❌ Erreur dans le cron :", err);
  }
}
