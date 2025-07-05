"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWallet = updateWallet;
const prisma_1 = require("@/lib/service/private/prisma");
async function updateWallet() {
    var _a;
    const cryptos = await prisma_1.prisma.crypto.findMany();
    const totalValue = cryptos.reduce((acc, c) => acc + c.totalHoldings, 0);
    const potOn = cryptos
        .filter((c) => c.status === "pending-sell" && c.symbol !== "USDC")
        .reduce((acc, c) => acc + c.pot, 0);
    const potOff = cryptos
        .filter((c) => c.status === "pending-buy" && c.symbol !== "USDC")
        .reduce((acc, c) => acc + c.pot, 0);
    const usdc = ((_a = cryptos.find((c) => c.symbol === "USDC")) === null || _a === void 0 ? void 0 : _a.totalHoldings) || 0;
    const wallet = await prisma_1.prisma.wallet.findFirst();
    if (wallet) {
        const { cash } = wallet;
        const security = usdc - (potOff + cash);
        const updated = await prisma_1.prisma.wallet.update({
            where: { id: wallet.id },
            data: {
                totalValue,
                potOn,
                potOff,
                USDC: usdc,
                security,
            },
        });
        return updated;
    }
    else {
        const cash = 0;
        const security = usdc - potOff;
        const created = await prisma_1.prisma.wallet.create({
            data: {
                totalValue,
                potOn,
                potOff,
                cash,
                security,
                USDC: usdc,
            },
        });
        return created;
    }
}
