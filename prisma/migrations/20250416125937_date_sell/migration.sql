-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TradeEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cryptoId" TEXT NOT NULL,
    "dateBuy" DATETIME NOT NULL,
    "dateSell" DATETIME,
    "buyPrice" REAL NOT NULL,
    "sellPrice" REAL NOT NULL,
    "gainLossPct" REAL NOT NULL,
    "gainLoss" REAL NOT NULL,
    "reinvested" REAL NOT NULL,
    "secured" REAL NOT NULL,
    "extracted" REAL NOT NULL,
    CONSTRAINT "TradeEntry_cryptoId_fkey" FOREIGN KEY ("cryptoId") REFERENCES "Crypto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TradeEntry" ("buyPrice", "cryptoId", "dateBuy", "dateSell", "extracted", "gainLoss", "gainLossPct", "id", "reinvested", "secured", "sellPrice") SELECT "buyPrice", "cryptoId", "dateBuy", "dateSell", "extracted", "gainLoss", "gainLossPct", "id", "reinvested", "secured", "sellPrice" FROM "TradeEntry";
DROP TABLE "TradeEntry";
ALTER TABLE "new_TradeEntry" RENAME TO "TradeEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
