import { ApplicationInitialState, getApplicationInitialState } from "./state";

import APP_CONSTANTS from "../shared/app_constants";
import { useState } from "react";

export interface ApplicationStore {
  state: ApplicationInitialState;
  updateState: (newState: ApplicationInitialState) => void;
  handleIsFetching: (handleIsFetching: boolean) => void;
  toggleThemeMode: () => void;
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

  return {
    state,
    updateState,
    handleIsFetching,
    toggleThemeMode,
  };
};

export default useApplicationStore;
