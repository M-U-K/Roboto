"use client";

import { createContext, useContext } from "react";

type SyncContextType = {
  activateSync: () => Promise<void>;
  syncCount: number;
};

export const SyncContext = createContext<SyncContextType>({
  activateSync: async () => {},
  syncCount: 0,
});

export const useSync = () => useContext(SyncContext);
