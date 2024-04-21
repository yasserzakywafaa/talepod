import { GoogleGeminiInitialState, getGoogleGeminiInitialState } from "./state";

import { useState } from "react";

export interface GoogleGeminiStore {
  state: GoogleGeminiInitialState;
  updateState: (newState: GoogleGeminiInitialState) => void;
}

const useGoogleGeminiStore = (): GoogleGeminiStore => {
  const initialState = getGoogleGeminiInitialState();
  const [state, setState] = useState<GoogleGeminiInitialState>(initialState);

  const updateState = (newState: GoogleGeminiInitialState) => {
    setState(newState);
  };

  return {
    state,
    updateState,
  };
};

export default useGoogleGeminiStore;
