/*
  Warnings:

  - Added the required column `USDC` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalValue" REAL NOT NULL,
    "pot" REAL NOT NULL,
    "cash" REAL NOT NULL,
    "security" REAL NOT NULL,
    "USDC" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Wallet" ("cash", "id", "pot", "security", "totalValue", "updatedAt") SELECT "cash", "id", "pot", "security", "totalValue", "updatedAt" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
