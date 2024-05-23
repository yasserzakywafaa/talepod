import { OpenAiGPTInitialState, getOpenAiGPTInitialState } from "./state";

import { useState } from "react";

export interface OpenAiGPTStore {
  state: OpenAiGPTInitialState;
  updateState: (
    key: keyof OpenAiGPTInitialState,
    newValue: OpenAiGPTInitialState[keyof OpenAiGPTInitialState]
  ) => void;
}

const useOpenAiGPTStore = (): OpenAiGPTStore => {
  const initialState = getOpenAiGPTInitialState();
  const [state, setState] = useState<OpenAiGPTInitialState>(initialState);

  const updateState = (
    key: keyof OpenAiGPTInitialState,
    newValue: OpenAiGPTInitialState[keyof OpenAiGPTInitialState]
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

export default useOpenAiGPTStore;
