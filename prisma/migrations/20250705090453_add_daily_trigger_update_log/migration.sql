-- CreateTable
CREATE TABLE "DailyTriggerUpdateLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyTriggerUpdateLog_date_key" ON "DailyTriggerUpdateLog"("date");
