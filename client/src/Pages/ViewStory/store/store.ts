import { ViewStoryInitialState, getViewStoryInitialState } from "./state";

import { Story } from "src/application/shared/interfaces";
import { useState } from "react";

export interface ViewStoryStore {
  state: ViewStoryInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateStory: (stories: Story) => void;
}

const useViewStoryStore = (): ViewStoryStore => {
  const initialState = getViewStoryInitialState();
  const [state, setState] = useState<ViewStoryInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const handleUpdateStory = (story: Story) => {
    setState((prev) => ({
      ...prev,
      story,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleUpdateStory,
  };
};

export default useViewStoryStore;
