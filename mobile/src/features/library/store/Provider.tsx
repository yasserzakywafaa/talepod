import { createContext, useContext } from "react";

import type { LibraryManager } from "./manager";
import { useLibraryManager } from "./manager";
import { useLibraryStore, type LibraryStore } from "./store";

export interface LibraryContextProps {
  store: LibraryStore;
  manager: LibraryManager;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

export const useLibraryContext = (): LibraryContextProps => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error(
      "useLibraryContext must be used within LibraryContextProvider",
    );
  }
  return context;
};

export const LibraryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useLibraryStore();
  const manager = useLibraryManager(store);

  return (
    <LibraryContext.Provider value={{ store, manager }}>
      {children}
    </LibraryContext.Provider>
  );
};
