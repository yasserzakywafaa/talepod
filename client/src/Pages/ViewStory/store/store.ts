import { ViewStoryInitialState, getViewStoryInitialState } from "./state";

import { Story } from "src/components/StoryCreator/store/state";
import { User } from "src/shared/user";
import { useState } from "react";

export interface ViewStoryStore {
  state: ViewStoryInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateStory: (stories: Story | undefined) => void;
  handleIsCreatingAudio: (isCreatingAudio: boolean) => void;
  handleUpdateStoryAuthor: (storyAuthor: User | undefined) => void;
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

  const handleUpdateStoryAuthor = (storyAuthor: User | undefined) => {
    setState((prev) => ({
      ...prev,
      storyAuthor,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleUpdateStory,
    handleIsCreatingAudio,
    handleUpdateStoryAuthor,
  };
};

export default useViewStoryStore;
