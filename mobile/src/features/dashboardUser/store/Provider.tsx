import { createContext, useContext, type ReactNode } from "react";

import { useDashboardUserManager, type DashboardUserManager } from "./manager";
import { useDashboardUserStore, type DashboardUserStore } from "./store";

const DashboardUserContext = createContext<
  { store: DashboardUserStore; manager: DashboardUserManager } | undefined
>(undefined);

export const useDashboardUserContext = () => {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error(
      "useDashboardUserContext must be used within DashboardUserContextProvider",
    );
  }
  return context;
};

export const DashboardUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const store = useDashboardUserStore();
  const manager = useDashboardUserManager(store);

  return (
    <DashboardUserContext.Provider value={{ store, manager }}>
      {children}
    </DashboardUserContext.Provider>
  );
};
