import { createContext, useContext } from "react";

type SyncContextType = {
  lastSync: number | null;
  syncing: boolean;
  triggerSync: () => Promise<void>;
};

export const SyncContext = createContext<SyncContextType>({
  lastSync: null,
  syncing: false,
  triggerSync: async () => {},
});

export const useSync = () => useContext(SyncContext);
