import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  StoryFormat,
} from "./state";

import { Avatar } from "src/shared/types/avatar";
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
  handleSetArtStyle: (artStyle: string) => void;
  handleSetAvatarId: (avatarId: string) => void;
  /** Select a saved character: sets avatarId AND pre-fills name/age/gender. */
  handleSelectAvatar: (avatar: Avatar | null) => void;
}

/**
 * Map a saved character's free-text gender + the resolved age onto the form's
 * gender enum (child vs adult bracket mirrors the manager's age effect below).
 */
const resolveAvatarGender = (
  rawGender: string | undefined,
  age: number
): ChildGenderEnum | AdultGenderEnum => {
  const g = (rawGender ?? "").trim().toLowerCase();
  const isFemale =
    g.startsWith("f") || g.includes("girl") || g.includes("woman");
  if (age >= 19) return isFemale ? AdultGenderEnum.Female : AdultGenderEnum.Male;
  return isFemale ? ChildGenderEnum.Girl : ChildGenderEnum.Boy;
};

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

  const handleSetArtStyle = (artStyle: string) => {
    updateState({
      ...store.state,
      artStyle,
    });
  };

  const handleSetAvatarId = (avatarId: string) => {
    updateState({
      ...store.state,
      avatarId,
    });
  };

  const handleSelectAvatar = (avatar: Avatar | null) => {
    // "None" / deselect — only clear the avatar link, keep typed form values.
    if (!avatar) {
      updateState({ ...store.state, avatarId: "" });
      return;
    }

    const rawAge =
      typeof avatar.age === "number" && avatar.age > 0
        ? avatar.age
        : store.state.profileInfo.age;
    const age = Math.max(1, Math.min(rawAge, 50));

    updateState({
      ...store.state,
      avatarId: avatar._id,
      profileInfo: {
        ...store.state.profileInfo,
        name: avatar.name || store.state.profileInfo.name,
        age,
        gender: resolveAvatarGender(avatar.gender, age),
      },
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
  }, [state.profileInfo, state.storyParams, state.format]);

  return {
    handleUpdateProfileInfo,
    handleUpdateStoryInfo,
    handleSetFormat,
    handleSetArtStyle,
    handleSetAvatarId,
    handleSelectAvatar,
  };
};
