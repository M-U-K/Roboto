import { createContext, useContext } from "react";

export type SyncContextType = {
  lastSync: number;
  syncing: boolean;
  triggerSync: () => Promise<void>;
};

export const SyncContext = createContext<SyncContextType | undefined>(
  undefined
);

export function useSync() {
  const context = useContext(SyncContext);
  if (!context)
    throw new Error("useSync doit être utilisé dans un SyncProvider");
  return context;
}
