import { updateActiveCryptosFromWallet } from "@/lib/service/private/updateActiveCryptosFromWallet";
import { syncCrypto } from "@/lib/service/private/syncCrypto";

export async function updateCrypto() {
  console.log("🔄 Mise à jour des cryptos en cours...");

  const symbols = await updateActiveCryptosFromWallet();
  console.log(`📦 Cryptos actives trouvées : ${symbols.join(", ")}`);

  for (const symbol of symbols) {
    try {
      await syncCrypto(symbol);
    } catch (error) {
      console.error(`❌ Erreur sur ${symbol} :`, error);
    }
  }

  console.log("✅ Mise à jour des cryptos terminée.");
}
