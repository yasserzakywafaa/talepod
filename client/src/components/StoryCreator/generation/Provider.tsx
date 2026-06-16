import { GenerationManager, useGenerationManager } from "./manager";
import { createContext, useContext } from "react";
import useGenerationStore, { GenerationStore } from "./store";

export interface GenerationContextProps {
  store: GenerationStore;
  manager: GenerationManager;
}

export interface GenerationContextProviderProps {
  children: React.ReactNode;
}

const GenerationContext = createContext<GenerationContextProps | undefined>(
  undefined
);

export const useGenerationContext = () => {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error(
      "useGenerationContext must be used within a GenerationContextProvider"
    );
  }
  return context;
};

export const GenerationContextProvider = (
  params: GenerationContextProviderProps
) => {
  const store = useGenerationStore();
  const manager = useGenerationManager(store);

  return (
    <GenerationContext.Provider value={{ store, manager }}>
      {params.children}
    </GenerationContext.Provider>
  );
};
