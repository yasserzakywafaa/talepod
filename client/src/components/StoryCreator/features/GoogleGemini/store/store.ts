import { GoogleGeminiInitialState, getGoogleGeminiInitialState } from "./state";

import { useState } from "react";

export interface GoogleGeminiStore {
  state: GoogleGeminiInitialState;
  updateState: (
    key: keyof GoogleGeminiInitialState,
    newValue: GoogleGeminiInitialState[keyof GoogleGeminiInitialState]
  ) => void;
}

const useGoogleGeminiStore = (): GoogleGeminiStore => {
  const initialState = getGoogleGeminiInitialState();
  const [state, setState] = useState<GoogleGeminiInitialState>(initialState);

  const updateState = (
    key: keyof GoogleGeminiInitialState,
    newValue: GoogleGeminiInitialState[keyof GoogleGeminiInitialState]
  ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: newValue,
    }));
  };

  return {
    state,
    updateState,
  };
};

export default useGoogleGeminiStore;
