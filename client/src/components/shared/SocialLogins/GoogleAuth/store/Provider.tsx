import { GoogleAuthManager, useGoogleAuthManager } from "./manager";
import React, { PropsWithChildren, createContext, useContext } from "react";
import useGoogleAuthStore, { GoogleAuthStore } from "./store";

export interface GoogleAuthContextProps {
  store: GoogleAuthStore;
  manager: GoogleAuthManager;
}

export interface GoogleAuthContextProviderProps {
  children: React.ReactNode;
}

const GoogleAuthContext = createContext<GoogleAuthContextProps | undefined>(
  undefined
);

export const useGoogleAuthContext = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error(
      "useGoogleAuthContext must be used within an GoogleAuthAuthProvider"
    );
  }
  return context;
};

export const GoogleAuthContextProvider = (
  params: GoogleAuthContextProviderProps
) => {
  const store = useGoogleAuthStore();
  const manager = useGoogleAuthManager(store);

  return (
    <GoogleAuthContext.Provider value={{ store, manager }}>
      {params.children}
    </GoogleAuthContext.Provider>
  );
};

export const AppWithGoogleAuthContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => <GoogleAuthContextProvider>{children}</GoogleAuthContextProvider>;
