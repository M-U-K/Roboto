"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDailyTriggerRun = hasDailyTriggerRun;
exports.logDailyTriggerExecution = logDailyTriggerExecution;
const prisma_1 = require("@/lib/service/private/prisma");
async function hasDailyTriggerRun() {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const start = new Date(`${today}T00:00:00.000Z`);
    const end = new Date(`${today}T23:59:59.999Z`);
    const log = await prisma_1.prisma.dailyTriggerUpdateLog.findFirst({
        where: {
            date: {
                gte: start,
                lte: end,
            },
        },
    });
    return !!log;
}
async function logDailyTriggerExecution() {
    await prisma_1.prisma.dailyTriggerUpdateLog.create({
        data: {
            date: new Date(),
        },
    });
}
