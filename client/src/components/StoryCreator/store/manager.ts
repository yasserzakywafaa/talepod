import { Country } from "src/shared/countries";

import { StoryCreatorStore } from "./store";
import { Environment } from "src/shared/generatedStory/Environments";
import { Moral } from "src/shared/generatedStory/Moral";
import { Tone } from "src/shared/generatedStory/Tone";

export interface StoryCreatorManager {
  handleUpdateChildInfo: (
    name: string,
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
      generatedStory: {
        ...store.state.generatedStory,
        [name]: value,
      },
    });
  };

  return {
    handleUpdateChildInfo,
    handleUpdateStoryInfo,
  };
};
