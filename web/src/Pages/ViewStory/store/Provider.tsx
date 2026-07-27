import { ViewStoryManager, useViewStoryManager } from "./manager";
import { createContext, useContext } from "react";
import useViewStoryStore, { ViewStoryStore } from "./store";

export interface ViewStoryContextProps {
  store: ViewStoryStore;
  manager: ViewStoryManager;
}

export interface ViewStoryContextProviderProps {
  children: React.ReactNode;
}

const ViewStoryContext = createContext<ViewStoryContextProps | undefined>(
  undefined
);

export const useViewStoryContext = () => {
  const context = useContext(ViewStoryContext);
  if (!context) {
    throw new Error(
      "useViewStoryContext must be used within an ViewStoryContextProvider"
    );
  }
  return context;
};

export const ViewStoryContextProvider = (
  params: ViewStoryContextProviderProps
) => {
  const store = useViewStoryStore();
  const manager = useViewStoryManager(store);

  return (
    <ViewStoryContext.Provider value={{ store, manager }}>
      {params.children}
    </ViewStoryContext.Provider>
  );
};
