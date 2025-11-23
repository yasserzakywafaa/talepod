import { DashboardStoriesManager, useDashboardStoriesManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardStoriesStore, { DashboardStoriesStore } from "./store";

export interface DashboardStoriesContextProps {
  store: DashboardStoriesStore;
  manager: DashboardStoriesManager;
}

export interface DashboardStoriesContextProviderProps {
  children: React.ReactNode;
}

const DashboardStoriesContext = createContext<
  DashboardStoriesContextProps | undefined
>(undefined);

export const useDashboardStoriesContext = () => {
  const context = useContext(DashboardStoriesContext);
  if (!context) {
    throw new Error(
      "useDashboardStoriesContext must be used within an DashboardStoriesContextProvider"
    );
  }
  return context;
};

export const DashboardStoriesContextProvider = (
  params: DashboardStoriesContextProviderProps = { children: undefined }
) => {
  const store = useDashboardStoriesStore();
  const manager = useDashboardStoriesManager(store);

  return (
    <DashboardStoriesContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardStoriesContext.Provider>
  );
};
