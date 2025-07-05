import { calculateAndUpdateState } from "@/lib/service/private/calculateState";

export async function updateState() {
  console.log("📈 Mise à jour de l'état global en cours...");

  try {
    await calculateAndUpdateState();
    console.log("✅ updateState() terminé avec succès.\n");
  } catch (error) {
    console.error("❌ Erreur dans updateState() :", error);
  }
}
