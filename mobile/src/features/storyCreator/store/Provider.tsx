import { StoryCreatorManager, useStoryCreatorManager } from "./manager";
import { createContext, useContext } from "react";
import useStoryCreatorStore, { StoryCreatorStore } from "./store";

export interface StoryCreatorContextProps {
  store: StoryCreatorStore;
  manager: StoryCreatorManager;
}

export interface StoryCreatorContextProviderProps {
  children: React.ReactNode;
}

const StoryCreatorContext = createContext<StoryCreatorContextProps | undefined>(
  undefined
);

export const useStoryCreatorContext = () => {
  const context = useContext(StoryCreatorContext);
  if (!context) {
    throw new Error(
      "useStoryCreatorContext must be used within an StoryCreatorContextProvider"
    );
  }
  return context;
};

export const StoryCreatorContextProvider = (
  params: StoryCreatorContextProviderProps
) => {
  const store = useStoryCreatorStore();
  const manager = useStoryCreatorManager(store);

  return (
    <StoryCreatorContext.Provider value={{ store, manager }}>
      {params.children}
    </StoryCreatorContext.Provider>
  );
};
