"use client";
import React from "react";
import { SyncContext } from "@/contexts/syncContext";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const dummy = {
    lastSync: null,
    syncing: false,
    activateSync: async () => {},
  };

  return <SyncContext.Provider value={dummy}>{children}</SyncContext.Provider>;
}
