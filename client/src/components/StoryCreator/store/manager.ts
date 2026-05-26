import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  StoryFormat,
} from "./state";

import { Country } from "src/shared/countries";
import { Environment } from "src/shared/mockedData/Environments";
import { Moral } from "src/shared/mockedData/Moral";
import { StoryCreatorStore } from "./store";
import { Tone } from "src/shared/mockedData/Tone";
import { getCreateStoryPrompt } from "../utils/getStoryPrompts";
import { useEffect } from "react";

export interface StoryCreatorManager {
  handleUpdateProfileInfo: (
    name: keyof ProfileInfo,
    value: string | number | Country
  ) => void;
  handleUpdateStoryInfo: (
    name: string,
    value: Tone | Moral | Environment | number
  ) => void;
  handleSetFormat: (format: StoryFormat) => void;
  handleSetPanelStyle: (panelStyle: string) => void;
}

export const useStoryCreatorManager = (
  store: StoryCreatorStore
): StoryCreatorManager => {
  const { state, updateState } = store;

  const handleUpdateProfileInfo = (
    name: string,
    value: string | number | Country
  ) => {
    updateState({
      ...store.state,
      profileInfo: {
        ...store.state.profileInfo,
        [name]: value,
      },
    });
  };

  const handleUpdateStoryInfo = (
    name: string,
    value: Environment | Moral | Tone
  ) => {
    updateState({
      ...store.state,
      storyParams: {
        ...store.state.storyParams,
        [name]: value,
      },
    });
  };

  const handleSetFormat = (format: StoryFormat) => {
    updateState({
      ...store.state,
      format,
    });
  };

  const handleSetPanelStyle = (panelStyle: string) => {
    updateState({
      ...store.state,
      panelStyle,
    });
  };

  useEffect(() => {
    updateState({
      ...state,
      createStory: {
        ...state.createStory,
        createStoryPrompt: getCreateStoryPrompt(state),
      },
    });

    const { profileInfo } = state;
    if (profileInfo.age >= 19) {
      if (profileInfo.gender === ChildGenderEnum.Girl) {
        handleUpdateProfileInfo("gender", AdultGenderEnum.Female);
      } else if (profileInfo.gender === ChildGenderEnum.Boy) {
        handleUpdateProfileInfo("gender", AdultGenderEnum.Male);
      }
    } else {
      if (profileInfo.gender === AdultGenderEnum.Female) {
        handleUpdateProfileInfo("gender", ChildGenderEnum.Girl);
      } else if (profileInfo.gender === AdultGenderEnum.Male) {
        handleUpdateProfileInfo("gender", ChildGenderEnum.Boy);
      }
    }
  }, [state.profileInfo, state.storyParams, state.format, state.panelStyle]);

  return {
    handleUpdateProfileInfo,
    handleUpdateStoryInfo,
    handleSetFormat,
    handleSetPanelStyle,
  };
};
