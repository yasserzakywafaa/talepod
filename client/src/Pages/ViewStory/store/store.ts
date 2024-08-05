import { ViewStoryInitialState, getViewStoryInitialState } from "./state";

import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface ViewStoryStore {
  state: ViewStoryInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateStory: (stories: Story | undefined) => void;
  handleIsCreatingAudio: (isCreatingAudio: boolean) => void;
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

  const handleIsCreatingAudio = (isCreatingAudio: boolean) => {
    setState((prev) => ({
      ...prev,
      isCreatingAudio,
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
    handleIsCreatingAudio,
  };
};

export default useViewStoryStore;
