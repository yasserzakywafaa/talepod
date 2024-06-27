import { ExploreInitialState, getExploreInitialState } from "./state";

import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface ExploreStore {
  state: ExploreInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateStory: (stories: Story[]) => void;
}

const useExploreStore = (): ExploreStore => {
  const initialState = getExploreInitialState();
  const [state, setState] = useState<ExploreInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const handleUpdateStory = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleUpdateStory,
  };
};

export default useExploreStore;
