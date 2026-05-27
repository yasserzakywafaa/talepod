import {
  ApplicationInitialState,
  Authentication,
  TrackingInfo,
  getApplicationInitialState,
  getThemePreference,
} from "./state";

import APP_CONSTANTS from "../shared/app_constants";
import { SubscriptionPlanEnum } from "src/shared/types/user";
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

  const applyThemeToDOM = (theme: "light" | "dark") => {
    const themeColorMetaTag = document.getElementById("theme-color");

    // Drive the design-system CSS tokens (assets/scss/design-system.css) which
    // key off [data-theme] on <html> (and body.dark as a fallback).
    document.documentElement.setAttribute("data-theme", theme);

    switch (theme) {
      case "light":
        themeColorMetaTag &&
          themeColorMetaTag.setAttribute("content", "#FAF4EA");
        document.body.classList.remove(APP_CONSTANTS.APP_THEME_CLASS.DARK);
        document.body.classList.add(APP_CONSTANTS.APP_THEME_CLASS.LIGHT);
        break;

      case "dark":
        themeColorMetaTag &&
          themeColorMetaTag.setAttribute("content", "#14133E");
        document.body.classList.remove(APP_CONSTANTS.APP_THEME_CLASS.LIGHT);
        document.body.classList.add(APP_CONSTANTS.APP_THEME_CLASS.DARK);
        break;
    }
  };

  const toggleThemeMode = () => {
    let appTheme = state.themeMode;

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

    applyThemeToDOM(appTheme);
  };

  const updateAuthInfo = (authInfo?: Authentication) => {
    if (authInfo) {
      const userTheme = getThemePreference(authInfo.user);

      setState((prev) => ({
        ...prev,
        themeMode: userTheme,
        auth: {
          isAuthenticated: authInfo.isAuthenticated,
          user: authInfo.user,
        },
      }));

      applyThemeToDOM(userTheme);
    } else {
      const {
        AUTHENTICATED: IS_AUTHENTICATION,
        TOKEN,
        USER,
      } = APP_CONSTANTS.LOCAL_STORAGE;
      const storedToken = localStorage.getItem(TOKEN) || "";
      const storedUser = localStorage.getItem(USER) ?? null;
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const storedIsAuthenticated = localStorage.getItem(IS_AUTHENTICATION);
      const userTheme = getThemePreference(parsedUser);

      setState((prev) => ({
        ...prev,
        themeMode: userTheme,
        auth: {
          token: storedToken,
          isAuthenticated: storedIsAuthenticated === "true" ? true : false,
          user: storedUser ? JSON.parse(storedUser) : null,
        },
        userType: {
          isFreeUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Free,
          isPaidUser:
            parsedUser?.subscription.type !== SubscriptionPlanEnum.Free,
          isPremiumUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Premium,
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
