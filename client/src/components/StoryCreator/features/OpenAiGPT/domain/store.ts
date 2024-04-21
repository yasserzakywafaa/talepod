import { OpenAiGPTInitialState, getOpenAiGPTInitialState } from "./state";

import { useState } from "react";

export interface OpenAiGPTStore {
  state: OpenAiGPTInitialState;
  updateState: (newState: OpenAiGPTInitialState) => void;
}

const useOpenAiGPTStore = (): OpenAiGPTStore => {
  const initialState = getOpenAiGPTInitialState();
  const [state, setState] = useState<OpenAiGPTInitialState>(initialState);

  const updateState = (newState: OpenAiGPTInitialState) => {
    setState(newState);
  };

  return {
    state,
    updateState,
  };
};

export default useOpenAiGPTStore;
