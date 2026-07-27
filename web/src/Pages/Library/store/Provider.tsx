import { LibraryManager, useLibraryManager } from "./manager";
import { createContext, useContext } from "react";
import useLibraryStore, { LibraryStore } from "./store";

export interface LibraryContextProps {
  store: LibraryStore;
  manager: LibraryManager;
}

export interface LibraryContextProviderProps {
  children: React.ReactNode;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

export const useLibraryContext = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error(
      "useLibraryContext must be used within a LibraryContextProvider",
    );
  }
  return context;
};

export const LibraryContextProvider = (params: LibraryContextProviderProps) => {
  const store = useLibraryStore();
  const manager = useLibraryManager(store);

  return (
    <LibraryContext.Provider value={{ store, manager }}>
      {params.children}
    </LibraryContext.Provider>
  );
};
