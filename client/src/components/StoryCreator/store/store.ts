import { StoryCreatorInitialState, getStoryCreatorInitialState } from "./state";

import { useState } from "react";

export interface StoryCreatorStore {
  state: StoryCreatorInitialState;
  updateState: (newState: StoryCreatorInitialState) => void;
}

const useStoryCreatorStore = (): StoryCreatorStore => {
  const initialState = getStoryCreatorInitialState();
  const [state, setState] = useState<StoryCreatorInitialState>(initialState);

  const updateState = (newState: StoryCreatorInitialState) => {
    setState(newState);
  };

  return {
    state,
    updateState,
  };
};

export default useStoryCreatorStore;
