"use client";
import { createContext, useContext, useEffect, useState } from "react";

type SyncContextType = {
  lastSync: number;
  syncing: boolean;
  triggerSync: () => Promise<void>;
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

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
    } catch (err) {
      console.error("Erreur lors de la synchronisation :", err);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    triggerSync();
    const interval = setInterval(() => {
      triggerSync();
    }, 300_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SyncContext.Provider value={{ lastSync, syncing, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) throw new Error("useSync doit être utilisé dans SyncProvider");
  return context;
}
