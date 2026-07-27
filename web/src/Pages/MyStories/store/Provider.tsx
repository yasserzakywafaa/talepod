import { MyStoriesManager, useMyStoriesManager } from "./manager";
import { createContext, useContext } from "react";
import useMyStoriesStore, { MyStoriesStore } from "./store";

export interface MyStoriesContextProps {
  store: MyStoriesStore;
  manager: MyStoriesManager;
}

export interface MyStoriesContextProviderProps {
  children: React.ReactNode;
}

const MyStoriesContext = createContext<MyStoriesContextProps | undefined>(
  undefined
);

export const useMyStoriesContext = () => {
  const context = useContext(MyStoriesContext);
  if (!context) {
    throw new Error(
      "useMyStoriesContext must be used within an MyStoriesContextProvider"
    );
  }
  return context;
};

export const MyStoriesContextProvider = (
  params: MyStoriesContextProviderProps
) => {
  const store = useMyStoriesStore();
  const manager = useMyStoriesManager(store);

  return (
    <MyStoriesContext.Provider value={{ store, manager }}>
      {params.children}
    </MyStoriesContext.Provider>
  );
};
