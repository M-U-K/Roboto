-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Crypto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "totalHoldings" REAL NOT NULL,
    "lastBuyPrice" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "pot" REAL NOT NULL DEFAULT 0,
    "sellAt" REAL NOT NULL DEFAULT 0,
    "gainLossPct" REAL NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "lastSellDate" DATETIME,
    "lastSellPrice" REAL,
    "buyTrigger" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending-buy'
);
INSERT INTO "new_Crypto" ("buyTrigger", "currentPrice", "gainLossPct", "id", "lastBuyPrice", "lastSellDate", "lastSellPrice", "lastUpdated", "pot", "sellAt", "status", "symbol", "totalHoldings") SELECT "buyTrigger", "currentPrice", "gainLossPct", "id", "lastBuyPrice", "lastSellDate", "lastSellPrice", "lastUpdated", "pot", coalesce("sellAt", 0) AS "sellAt", "status", "symbol", "totalHoldings" FROM "Crypto";
DROP TABLE "Crypto";
ALTER TABLE "new_Crypto" RENAME TO "Crypto";
CREATE UNIQUE INDEX "Crypto_symbol_key" ON "Crypto"("symbol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
