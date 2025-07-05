import { createContext, useContext } from "react";

type SyncContextType = {
  lastSync: number | null;
  syncing: boolean;
  activateSync: () => Promise<void>;
};

export const SyncContext = createContext<SyncContextType>({
  lastSync: null,
  syncing: false,
  activateSync: async () => {},
});

export const useSync = () => useContext(SyncContext);
