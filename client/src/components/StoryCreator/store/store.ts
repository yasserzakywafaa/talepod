import { StoryCreatorInitialState, getStoryCreatorInitialState } from "./state";

import { useState } from "react";

export interface StoryCreatorStore {
  state: StoryCreatorInitialState;
  updateState: (newState: StoryCreatorInitialState) => void;
  toggleStorySettings: (isStorySettingsExpanded: boolean) => void;
}

const useStoryCreatorStore = (): StoryCreatorStore => {
  const initialState = getStoryCreatorInitialState();
  const [state, setState] = useState<StoryCreatorInitialState>(initialState);

  const updateState = (newState: StoryCreatorInitialState) => {
    setState(newState);
  };

  const toggleStorySettings = (isStorySettingsExpanded: boolean) => {
    setState((prev) => ({
      ...prev,
      isStorySettingsExpanded: !prev.isStorySettingsExpanded,
    }));
  };

  return {
    state,
    updateState,
    toggleStorySettings,
  };
};

export default useStoryCreatorStore;
