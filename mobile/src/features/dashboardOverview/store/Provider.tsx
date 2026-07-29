import React, { createContext, useContext, useMemo } from "react";

import type { DashboardOverviewManager } from "./manager";
import { useDashboardOverviewManager } from "./manager";
import {
  useDashboardOverviewStore,
  type DashboardOverviewStore,
} from "./store";

type DashboardOverviewContextProps = {
  store: DashboardOverviewStore;
  manager: DashboardOverviewManager;
};

const DashboardOverviewContext = createContext<
  DashboardOverviewContextProps | undefined
>(undefined);

export const useDashboardOverviewContext = (): DashboardOverviewContextProps => {
  const context = useContext(DashboardOverviewContext);
  if (!context) {
    throw new Error(
      "useDashboardOverviewContext must be used within DashboardOverviewContextProvider",
    );
  }
  return context;
};

export const DashboardOverviewContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useDashboardOverviewStore();
  const manager = useDashboardOverviewManager(store);

  const value = useMemo(() => ({ store, manager }), [store, manager]);

  return (
    <DashboardOverviewContext.Provider value={value}>
      {children}
    </DashboardOverviewContext.Provider>
  );
};
