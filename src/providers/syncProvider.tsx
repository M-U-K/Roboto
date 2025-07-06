"use client";
import React, { useState } from "react";
import { SyncContext } from "@/contexts/syncContext";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [syncCount, setSyncCount] = useState(0);

  const activateSync = async () => {
    await fetch("/api/public/cron");
    await fetch("/api/public/crypto");
    await fetch("/api/public/state");
    await fetch("/api/public/trigger");
    await fetch("/api/public/wallet");
    setSyncCount((prev) => prev + 1);
  };

  return (
    <SyncContext.Provider value={{ activateSync, syncCount }}>
      {children}
    </SyncContext.Provider>
  );
}
