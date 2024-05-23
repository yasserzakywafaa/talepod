import { GoogleAuthManager, useGoogleAuthManager } from "./manager";
import React, { PropsWithChildren, createContext, useContext } from "react";
import useGoogleAuthStore, { GoogleAuthStore } from "./store";

import APP_CONSTANTS from "src/lib/app_constants";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

export const AppWithGoogleAuth: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <GoogleOAuthProvider clientId={APP_CONSTANTS.GOOGLE_AUTH_CLIENT_ID || ""}>
    <GoogleAuthContextProvider>{children}</GoogleAuthContextProvider>
  </GoogleOAuthProvider>
);
