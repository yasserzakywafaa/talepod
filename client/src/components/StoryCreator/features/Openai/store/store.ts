import { OpenaiInitialState, getOpenaiInitialState } from "./state";

import { useState } from "react";

export interface OpenaiStore {
  state: OpenaiInitialState;
  updateState: (
    key: keyof OpenaiInitialState,
    newValue: OpenaiInitialState[keyof OpenaiInitialState]
  ) => void;
}

const useOpenaiStore = (): OpenaiStore => {
  const initialState = getOpenaiInitialState();
  const [state, setState] = useState<OpenaiInitialState>(initialState);

  const updateState = (
    key: keyof OpenaiInitialState,
    newValue: OpenaiInitialState[keyof OpenaiInitialState]
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

export default useOpenaiStore;
