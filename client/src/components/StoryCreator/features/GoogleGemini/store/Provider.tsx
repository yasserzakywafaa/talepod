import { GoogleGeminiManager, useGoogleGeminiManager } from "./manager";
import { createContext, useContext } from "react";
import useGoogleGeminiStore, { GoogleGeminiStore } from "./store";

export interface GoogleGeminiContextProps {
  store: GoogleGeminiStore;
  manager: GoogleGeminiManager;
}

export interface GoogleGeminiContextProviderProps {
  children: React.ReactNode;
}

const GoogleGeminiContext = createContext<GoogleGeminiContextProps | undefined>(
  undefined
);

export const useGoogleGeminiContext = () => {
  const context = useContext(GoogleGeminiContext);
  if (!context) {
    throw new Error(
      "useGoogleGeminiContext must be used within an GoogleGeminiContextProvider"
    );
  }
  return context;
};

export const GoogleGeminiContextProvider = (
  params: GoogleGeminiContextProviderProps
) => {
  const store = useGoogleGeminiStore();
  const manager = useGoogleGeminiManager(store);

  return (
    <GoogleGeminiContext.Provider value={{ store, manager }}>
      {params.children}
    </GoogleGeminiContext.Provider>
  );
};
