import { createContext, useContext } from "react";

import type { MyStoriesManager } from "./manager";
import { useMyStoriesManager } from "./manager";
import { useMyStoriesStore, type MyStoriesStore } from "./store";

const MyStoriesContext = createContext<
  { store: MyStoriesStore; manager: MyStoriesManager } | undefined
>(undefined);

export const useMyStoriesContext = () => {
  const context = useContext(MyStoriesContext);
  if (!context) {
    throw new Error(
      "useMyStoriesContext must be used within MyStoriesContextProvider",
    );
  }
  return context;
};

export const MyStoriesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useMyStoriesStore();
  const manager = useMyStoriesManager(store);

  return (
    <MyStoriesContext.Provider value={{ store, manager }}>
      {children}
    </MyStoriesContext.Provider>
  );
};
