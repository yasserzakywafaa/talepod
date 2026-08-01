import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { onSessionExpired } from "src/application/shared/authEvents";
import { setMonitoringUser } from "src/shared/monitoring";

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
  // `store` is a fresh object each render, so the ref keeps one subscription
  // pointed at the latest one instead of re-adding it on every change.
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    if (didRunInitialAuth.current) {
      return;
    }
    didRunInitialAuth.current = true;
    void manager.handleInitialAuthentication();
  }, [manager]);

  // A failed refresh clears storage in the axios layer; mirror it here or
  // the UI sits in a broken authenticated shell.
  useEffect(
    () =>
      onSessionExpired(() => {
        storeRef.current.updateAuthInfo({
          isAuthenticated: false,
          user: null,
        });
        storeRef.current.handleIsFetchingUserInfo(false);
        setMonitoringUser(null);
      }),
    [],
  );

  /** Ties crash reports to an account without sending email or phone. */
  const userId = store.state.auth.user?._id ?? null;
  useEffect(() => {
    setMonitoringUser(userId);
  }, [userId]);

  const value = useMemo(() => ({ store, manager }), [store, manager]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
