import {
  ApplicationInitialState,
  Authentication,
  getApplicationInitialState,
} from "./state";

import APP_CONSTANTS from "../shared/app_constants";
import { useState } from "react";

export interface ApplicationStore {
  state: ApplicationInitialState;
  updateState: (newState: ApplicationInitialState) => void;
  handleIsFetching: (handleIsFetching: boolean) => void;
  toggleThemeMode: () => void;
  updateAuthInfo: (authInfo?: Authentication) => void;
}

const useApplicationStore = (): ApplicationStore => {
  const [state, setState] = useState<ApplicationInitialState>(
    getApplicationInitialState()
  );

  const updateState = (newState: ApplicationInitialState) => {
    setState(newState);
  };

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const toggleThemeMode = () => {
    let appTheme = state.themeMode;
    const themeColorMetaTag = document.getElementById("theme-color");

    setState((prev) => {
      appTheme = prev.themeMode === "dark" ? "light" : "dark";
      return {
        ...prev,
        themeMode: appTheme,
      };
    });

    localStorage.setItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME,
      appTheme
    );

    switch (appTheme) {
      case "light":
        themeColorMetaTag &&
          themeColorMetaTag.setAttribute("content", "#F5F5F5");
        break;

      case "dark":
        themeColorMetaTag &&
          themeColorMetaTag.setAttribute("content", "#2E3B4E");
        break;
    }
  };

  const updateAuthInfo = (authInfo?: Authentication) => {
    if (authInfo) {
      console.log("updateAuthInfo:>>> authInfo", {
        authInfo,
      });

      setState((prev) => ({
        ...prev,
        auth: {
          isAuthenticated: authInfo.isAuthenticated,
          user: authInfo.user,
        },
      }));
    } else {
      const {
        IS_AUTHENTICATED: IS_AUTHENTICATION,
        TOKEN,
        USER,
      } = APP_CONSTANTS.LOCAL_STORAGE;
      const storedToken = localStorage.getItem(TOKEN) || "";
      const storedUser = localStorage.getItem(USER);
      const storedIsAuthenticated = localStorage.getItem(IS_AUTHENTICATION);

      console.log("updateAuthInfo:>>> NO!!authInfo", {
        token: storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
        isAuthenticated: storedIsAuthenticated === "true" ? true : false,
      });

      setState((prev) => ({
        ...prev,
        auth: {
          token: storedToken,
          isAuthenticated: storedIsAuthenticated === "true" ? true : false,
          user: storedUser ? JSON.parse(storedUser) : null,
        },
      }));
    }
  };

  return {
    state,
    updateState,
    handleIsFetching,
    toggleThemeMode,
    updateAuthInfo,
  };
};

export default useApplicationStore;
