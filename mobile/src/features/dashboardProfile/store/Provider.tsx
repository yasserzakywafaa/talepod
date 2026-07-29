import React, { createContext, useContext, useMemo } from "react";

import type { DashboardProfileManager } from "./manager";
import { useDashboardProfileManager } from "./manager";
import {
  useDashboardProfileStore,
  type DashboardProfileStore,
} from "./store";

type DashboardProfileContextProps = {
  store: DashboardProfileStore;
  manager: DashboardProfileManager;
};

const DashboardProfileContext = createContext<
  DashboardProfileContextProps | undefined
>(undefined);

export const useDashboardProfileContext = (): DashboardProfileContextProps => {
  const context = useContext(DashboardProfileContext);
  if (!context) {
    throw new Error(
      "useDashboardProfileContext must be used within DashboardProfileContextProvider",
    );
  }
  return context;
};

export const DashboardProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useDashboardProfileStore();
  const manager = useDashboardProfileManager(store);

  const value = useMemo(() => ({ store, manager }), [store, manager]);

  return (
    <DashboardProfileContext.Provider value={value}>
      {children}
    </DashboardProfileContext.Provider>
  );
};
