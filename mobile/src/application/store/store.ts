import type {
  ApplicationInitialState,
  Authentication,
  ThemePreference,
} from "./state";
import { getApplicationInitialState } from "./state";
import { useCallback, useState } from "react";

export interface ApplicationStore {
  state: ApplicationInitialState;
  handleIsFetchingUserInfo: (isFetchingUserInfo: boolean) => void;
  updateAuthInfo: (authInfo: Authentication) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
}

const useApplicationStore = (): ApplicationStore => {
  const [state, setState] = useState<ApplicationInitialState>(
    getApplicationInitialState(),
  );

  const handleIsFetchingUserInfo = useCallback((isFetchingUserInfo: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetchingUserInfo,
    }));
  }, []);

  const updateAuthInfo = useCallback((authInfo: Authentication) => {
    setState((prev) => ({
      ...prev,
      auth: {
        isAuthenticated: authInfo.isAuthenticated,
        user: authInfo.user,
      },
    }));
  }, []);

  const setThemePreference = useCallback((themePreference: ThemePreference) => {
    setState((prev) => ({ ...prev, themePreference }));
  }, []);

  return {
    state,
    handleIsFetchingUserInfo,
    updateAuthInfo,
    setThemePreference,
  };
};

export default useApplicationStore;
