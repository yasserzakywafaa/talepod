import { ChildInfo } from "./state";
import { Country } from "src/shared/countries";
import { Environment } from "src/shared/generatedStory/Environments";
import { Moral } from "src/shared/generatedStory/Moral";
import { StoryCreatorStore } from "./store";
import { Tone } from "src/shared/generatedStory/Tone";
import { getAutoTextGenPromptString } from "../utils/getAutoPromptString";
import { useEffect } from "react";

export interface StoryCreatorManager {
  handleUpdateChildInfo: (
    name: keyof ChildInfo,
    value: string | number | Country
  ) => void;
  handleUpdateStoryInfo: (
    name: string,
    value: Tone | Moral | Environment | number
  ) => void;
}

export const useStoryCreatorManager = (
  store: StoryCreatorStore
): StoryCreatorManager => {
  const handleUpdateChildInfo = (
    name: string,
    value: string | number | Country
  ) => {
    store.updateState({
      ...store.state,
      childInfo: {
        ...store.state.childInfo,
        [name]: value,
      },
    });
  };

  const handleUpdateStoryInfo = (
    name: string,
    value: Environment | Moral | Tone
  ) => {
    store.updateState({
      ...store.state,
      storyParams: {
        ...store.state.storyParams,
        [name]: value,
      },
    });
  };

  useEffect(() => {
    store.updateState({
      ...store.state,
      textGeneration: {
        ...store.state.textGeneration,
        autoTextPrompt: getAutoTextGenPromptString(store.state),
      },
    });
  }, [store.state.childInfo, store.state.storyParams]);

  return {
    handleUpdateChildInfo,
    handleUpdateStoryInfo,
  };
};
