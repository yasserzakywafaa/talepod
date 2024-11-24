import {
  ApplicationInitialState,
  Authentication,
  TrackingInfo,
  getApplicationInitialState,
} from "./state";

import APP_CONSTANTS from "../shared/app_constants";
import { useState } from "react";

export interface ApplicationStore {
  state: ApplicationInitialState;
  updateState: (newState: ApplicationInitialState) => void;
  handleIsFetching: (handleIsFetching: boolean) => void;
  setPreviousUrl: (previousUrl: string) => void;
  setTrackingInfo: (trackingInfo: TrackingInfo) => void;
  handleIsFetchingUserInfo: (isFetchingUserInfo: boolean) => void;
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

  const setPreviousUrl = (previousUrl: string) => {
    setState((prev) => ({
      ...prev,
      previousUrl,
    }));
  };

  const setTrackingInfo = (trackingInfo: TrackingInfo) => {
    setState((prev) => ({
      ...prev,
      trackingInfo,
    }));
  };

  const handleIsFetchingUserInfo = (isFetchingUserInfo: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetchingUserInfo,
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
    setPreviousUrl,
    setTrackingInfo,
    handleIsFetchingUserInfo,
    toggleThemeMode,
    updateAuthInfo,
  };
};

export default useApplicationStore;
