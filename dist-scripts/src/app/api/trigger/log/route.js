"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = require("@/lib/service/private/prisma");
async function GET() {
    const today = new Date().toISOString().slice(0, 10);
    const start = new Date(`${today}T00:00:00.000Z`);
    const end = new Date(`${today}T23:59:59.999Z`);
    const alreadyRun = await prisma_1.prisma.dailyTriggerUpdateLog.findFirst({
        where: {
            date: {
                gte: start,
                lte: end,
            },
        },
    });
    return server_1.NextResponse.json({ alreadyRun: !!alreadyRun });
}
async function POST(_req) {
    await prisma_1.prisma.dailyTriggerUpdateLog.create({
        data: { date: new Date() },
    });
    return server_1.NextResponse.json({ success: true });
}
