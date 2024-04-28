import { ApplicationInitialState, getApplicationInitialState } from "./state";

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
    setState((prev) => {
      console.log("useApplicationStore :>> Mode:>>>", prev);

      return {
        ...prev,
        themeMode: prev.themeMode === "dark" ? "light" : "dark",
      };
    });
  };

  return {
    state,
    updateState,
    handleIsFetching,
    toggleThemeMode,
  };
};

export default useApplicationStore;
