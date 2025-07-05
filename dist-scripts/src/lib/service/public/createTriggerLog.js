"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTriggerChange = logTriggerChange;
const prisma_1 = require("@/lib/service/private/prisma");
/**
 * Enregistre un changement de score trigger pour une crypto.
 * @param symbol Le symbole de la crypto (ex: BTC)
 * @param change Le changement appliqué (+1, -2, etc.)
 * @param newScore Le score final après application
 */
async function logTriggerChange(symbol, change, newScore) {
    try {
        await prisma_1.prisma.triggerLog.create({
            data: {
                symbol,
                change,
                newScore,
            },
        });
    }
    catch (error) {
        console.error(`Erreur lors du log de trigger pour ${symbol} :`, error);
    }
}
