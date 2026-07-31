import { createContext, useContext, type ReactNode } from "react";

import {
  useDashboardStoriesManager,
  type DashboardStoriesManager,
} from "./manager";
import { useDashboardStoriesStore, type DashboardStoriesStore } from "./store";

const DashboardStoriesContext = createContext<
  { store: DashboardStoriesStore; manager: DashboardStoriesManager } | undefined
>(undefined);

export const useDashboardStoriesContext = () => {
  const context = useContext(DashboardStoriesContext);
  if (!context) {
    throw new Error(
      "useDashboardStoriesContext must be used within DashboardStoriesContextProvider",
    );
  }
  return context;
};

export const DashboardStoriesContextProvider = ({
  userId,
  children,
}: {
  /** Scopes the list to one author; omit for every story on the platform. */
  userId?: string;
  children: ReactNode;
}) => {
  const store = useDashboardStoriesStore();
  const manager = useDashboardStoriesManager(store, { userId });

  return (
    <DashboardStoriesContext.Provider value={{ store, manager }}>
      {children}
    </DashboardStoriesContext.Provider>
  );
};
