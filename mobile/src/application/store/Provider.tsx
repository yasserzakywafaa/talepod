import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";

import type { ApplicationManager } from "./manager";
import { useApplicationManager } from "./manager";
import useApplicationStore, { type ApplicationStore } from "./store";

type ApplicationContextProps = {
  store: ApplicationStore;
  manager: ApplicationManager;
};

const ApplicationContext = createContext<ApplicationContextProps | undefined>(
  undefined,
);

export const useApplicationContext = (): ApplicationContextProps => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within ApplicationContextProvider",
    );
  }
  return context;
};

export const ApplicationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useApplicationStore();
  const manager = useApplicationManager(store);
  const didRunInitialAuth = useRef(false);

  useEffect(() => {
    if (didRunInitialAuth.current) {
      return;
    }
    didRunInitialAuth.current = true;
    void manager.handleInitialAuthentication();
  }, [manager]);

  const value = useMemo(() => ({ store, manager }), [store, manager]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
