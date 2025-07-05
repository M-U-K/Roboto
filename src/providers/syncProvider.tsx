"use client";
import React, { useEffect, useState } from "react";
import { SyncContext } from "@/contexts/syncContext";
import { updateTriggers } from "@/lib/updateTriggers";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [lastSync, setLastSync] = useState<number>(Date.now());
  const [syncing, setSyncing] = useState<boolean>(false);

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
          console.log(
            `[TRIGGER] 🕛 updateTriggers() lancé à ${now.toLocaleTimeString()}`
          );

          const updateRes = await fetch("/api/trigger/update", {
            method: "POST",
          });
          const updateData = await updateRes.json();

          if (!updateRes.ok) {
            console.error(
              "[TRIGGER] ❌ Erreur dans /api/trigger/update :",
              updateData.error
            );
            return;
          }

          const postRes = await fetch("/api/trigger/log", { method: "POST" });
          const postData = await postRes.json();

          if (!postRes.ok) {
            console.error(
              "[TRIGGER] ❌ Erreur dans /api/trigger/log :",
              postData.error
            );
          } else {
            console.log(
              `[TRIGGER] ✅ updateTriggers() loggé pour ${now
                .toISOString()
                .slice(0, 10)}`
            );
          }
        }
      }
    } catch (err) {
      console.error("Erreur dans triggerSync :", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    triggerSync();
    const interval = setInterval(() => {
      triggerSync();
    }, 300_000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <SyncContext.Provider value={{ lastSync, syncing, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}
