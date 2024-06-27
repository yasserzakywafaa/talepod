import { OpenaiManager, useOpenAiGPTManager } from "./manager";
import { createContext, useContext } from "react";
import useOpenaiStore, { OpenaiStore } from "./store";

export interface OpenAiGPTContextProps {
  store: OpenaiStore;
  manager: OpenaiManager;
}

export interface OpenAiGPTContextProviderProps {
  children: React.ReactNode;
}

const OpenAiGPTContext = createContext<OpenAiGPTContextProps | undefined>(
  undefined
);

export const useOpenaiContext = () => {
  const context = useContext(OpenAiGPTContext);
  if (!context) {
    throw new Error(
      "useOpenAiGPTContext must be used within an OpenAiGPTContextProvider"
    );
  }
  return context;
};

export const OpenaiContextProvider = (
  params: OpenAiGPTContextProviderProps
) => {
  const store = useOpenaiStore();
  const manager = useOpenAiGPTManager(store);

  return (
    <OpenAiGPTContext.Provider value={{ store, manager }}>
      {params.children}
    </OpenAiGPTContext.Provider>
  );
};
