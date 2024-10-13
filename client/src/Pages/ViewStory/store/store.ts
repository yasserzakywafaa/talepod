import { AudioUserVoice, Story } from "src/components/StoryCreator/store/state";
import { ViewStoryInitialState, getViewStoryInitialState } from "./state";

import { User } from "src/shared/user";
import { useState } from "react";

export interface ViewStoryStore {
  state: ViewStoryInitialState;
  setIsFetching: (isFetching: boolean) => void;
  updateStory: (stories: Story | undefined) => void;
  setIsCreatingAudio: (isCreatingAudio: boolean) => void;
  updateStoryAuthor: (storyAuthor: User | undefined) => void;
  updateAudioFileVoice: (audioFileVoice: AudioUserVoice) => void;
}

const useViewStoryStore = (): ViewStoryStore => {
  const initialState = getViewStoryInitialState();
  const [state, setState] = useState<ViewStoryInitialState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setIsCreatingAudio = (isCreatingAudio: boolean) => {
    setState((prev) => ({
      ...prev,
      isCreatingAudio,
    }));
  };

  const updateStory = (story: Story) => {
    setState((prev) => ({
      ...prev,
      story,
    }));
  };

  const updateStoryAuthor = (storyAuthor: User | undefined) => {
    setState((prev) => ({
      ...prev,
      storyAuthor,
    }));
  };

  const updateAudioFileVoice = (audioFileVoice: AudioUserVoice) => {
    setState((prev) => ({
      ...prev,
      audioFileVoice,
    }));
  };

  return {
    state,
    setIsFetching,
    updateStory,
    setIsCreatingAudio,
    updateStoryAuthor,
    updateAudioFileVoice,
  };
};

export default useViewStoryStore;
