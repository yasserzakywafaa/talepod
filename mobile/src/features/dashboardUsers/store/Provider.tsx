import { createContext, useContext, type ReactNode } from "react";

import {
  useDashboardUsersManager,
  type DashboardUsersManager,
} from "./manager";
import { useDashboardUsersStore, type DashboardUsersStore } from "./store";

const DashboardUsersContext = createContext<
  { store: DashboardUsersStore; manager: DashboardUsersManager } | undefined
>(undefined);

export const useDashboardUsersContext = () => {
  const context = useContext(DashboardUsersContext);
  if (!context) {
    throw new Error(
      "useDashboardUsersContext must be used within DashboardUsersContextProvider",
    );
  }
  return context;
};

export const DashboardUsersContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const store = useDashboardUsersStore();
  const manager = useDashboardUsersManager(store);

  return (
    <DashboardUsersContext.Provider value={{ store, manager }}>
      {children}
    </DashboardUsersContext.Provider>
  );
};
