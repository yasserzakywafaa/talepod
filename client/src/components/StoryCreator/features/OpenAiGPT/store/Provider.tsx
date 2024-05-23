import { OpenAiGPTManager, useOpenAiGPTManager } from "./manager";
import { createContext, useContext } from "react";
import useOpenAiGPTStore, { OpenAiGPTStore } from "./store";

export interface OpenAiGPTContextProps {
  store: OpenAiGPTStore;
  manager: OpenAiGPTManager;
}

export interface OpenAiGPTContextProviderProps {
  children: React.ReactNode;
}

const OpenAiGPTContext = createContext<OpenAiGPTContextProps | undefined>(
  undefined
);

export const useOpenAiGPTContext = () => {
  const context = useContext(OpenAiGPTContext);
  if (!context) {
    throw new Error(
      "useOpenAiGPTContext must be used within an OpenAiGPTContextProvider"
    );
  }
  return context;
};

export const OpenAiGPTContextProvider = (
  params: OpenAiGPTContextProviderProps
) => {
  const store = useOpenAiGPTStore();
  const manager = useOpenAiGPTManager(store);

  return (
    <OpenAiGPTContext.Provider value={{ store, manager }}>
      {params.children}
    </OpenAiGPTContext.Provider>
  );
};
