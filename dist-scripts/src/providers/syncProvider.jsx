"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncProvider = SyncProvider;
const react_1 = __importStar(require("react"));
const syncContext_1 = require("@/contexts/syncContext");
function SyncProvider({ children }) {
    const [lastSync, setLastSync] = (0, react_1.useState)(Date.now());
    const [syncing, setSyncing] = (0, react_1.useState)(false);
    const triggerSync = async () => {
        try {
            setSyncing(true);
            await fetch("/api/sync");
            await fetch("/api/wallet");
            await fetch("/api/state");
            setLastSync(Date.now());
            const now = new Date();
            const isAfterNoon = now.getHours() >= 12;
            if (isAfterNoon) {
                const res = await fetch("/api/trigger/log");
                const { alreadyRun } = await res.json();
                if (!alreadyRun) {
                    console.log(`[TRIGGER] 🕛 updateTriggers() lancé à ${now.toLocaleTimeString()}`);
                    const updateRes = await fetch("/api/trigger/update", {
                        method: "POST",
                    });
                    const updateData = await updateRes.json();
                    if (!updateRes.ok) {
                        console.error("[TRIGGER] ❌ Erreur dans /api/trigger/update :", updateData.error);
                        return;
                    }
                    const postRes = await fetch("/api/trigger/log", { method: "POST" });
                    const postData = await postRes.json();
                    if (!postRes.ok) {
                        console.error("[TRIGGER] ❌ Erreur dans /api/trigger/log :", postData.error);
                    }
                    else {
                        console.log(`[TRIGGER] ✅ updateTriggers() loggé pour ${now
                            .toISOString()
                            .slice(0, 10)}`);
                    }
                }
            }
        }
        catch (err) {
            console.error("Erreur dans triggerSync :", err);
        }
        finally {
            setSyncing(false);
        }
    };
    (0, react_1.useEffect)(() => {
        triggerSync();
        const interval = setInterval(() => {
            triggerSync();
        }, 300000); // 5 min
        return () => clearInterval(interval);
    }, []);
    return (<syncContext_1.SyncContext.Provider value={{ lastSync, syncing, triggerSync }}>
      {children}
    </syncContext_1.SyncContext.Provider>);
}
