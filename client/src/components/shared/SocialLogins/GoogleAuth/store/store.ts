import { GoogleAuthInitialState, getGoogleAuthInitialState } from "./state";

import { useState } from "react";

export interface GoogleAuthStore {
  state: GoogleAuthInitialState;
  handleIsFetching: (isFetching: boolean) => void;

  updateState: (
    key: keyof GoogleAuthInitialState,
    newValue: GoogleAuthInitialState[keyof GoogleAuthInitialState]
  ) => void;
}

const useGoogleAuthStore = (): GoogleAuthStore => {
  const initialState = getGoogleAuthInitialState();
  const [state, setState] = useState<GoogleAuthInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isFetching,
    }));
  };

  const updateState = (
    key: keyof GoogleAuthInitialState,
    newValue: GoogleAuthInitialState[keyof GoogleAuthInitialState]
  ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: newValue,
    }));
  };

  return {
    state,
    handleIsFetching,
    updateState,
  };
};

export default useGoogleAuthStore;
