-- CreateTable
CREATE TABLE "TriggerLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "change" INTEGER NOT NULL,
    "newScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TriggerLog_symbol_idx" ON "TriggerLog"("symbol");
