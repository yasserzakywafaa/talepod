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
  // `useApplicationStore` returns a fresh object each render, so subscribing
  // against `store` directly would tear down and re-add the listener on every
  // state change. The ref keeps one subscription pointed at the latest store.
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    if (didRunInitialAuth.current) {
      return;
    }
    didRunInitialAuth.current = true;
    void manager.handleInitialAuthentication();
  }, [manager]);

  /**
   * A refresh that fails (revoked or expired refresh token) clears storage in
   * the axios layer. Mirror that into React so the UI actually returns to the
   * signed-out state instead of sitting in a broken authenticated shell.
   */
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
