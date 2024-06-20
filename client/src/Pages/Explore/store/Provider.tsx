import { ExploreManager, useExploreManager } from "./manager";
import { createContext, useContext } from "react";
import useExploreStore, { ExploreStore } from "./store";

export interface ExploreContextProps {
  store: ExploreStore;
  manager: ExploreManager;
}

export interface ExploreContextProviderProps {
  children: React.ReactNode;
}

const ExploreContext = createContext<ExploreContextProps | undefined>(
  undefined
);

export const useExploreContext = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error(
      "useExploreContext must be used within an ExploreContextProvider"
    );
  }
  return context;
};

export const ExploreContextProvider = (params: ExploreContextProviderProps) => {
  const store = useExploreStore();
  const manager = useExploreManager(store);

  return (
    <ExploreContext.Provider value={{ store, manager }}>
      {params.children}
    </ExploreContext.Provider>
  );
};
