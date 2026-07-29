import {
  AdultGenderEnum,
  ChildGenderEnum,
  ProfileInfo,
  StoryFormat,
  getStoryCreatorInitialState,
} from "./state";

import { Avatar } from "src/shared/types/avatar";
import { Country } from "src/shared/countries";
import { Environment } from "src/shared/mockedData/Environments";
import { Moral } from "src/shared/mockedData/Moral";
import { StoryCreatorStore } from "./store";
import { Tone } from "src/shared/mockedData/Tone";
import { useEffect } from "react";

export interface StoryCreatorManager {
  handleUpdateProfileInfo: (
    name: keyof ProfileInfo,
    value: string | number | Country,
  ) => void;
  handleUpdateStoryInfo: (
    name: string,
    value: Tone | Moral | Environment | number,
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
  age: number,
): ChildGenderEnum | AdultGenderEnum => {
  const g = (rawGender ?? "").trim().toLowerCase();
  const isFemale =
    g.startsWith("f") || g.includes("girl") || g.includes("woman");
  if (age >= 19)
    return isFemale ? AdultGenderEnum.Female : AdultGenderEnum.Male;
  return isFemale ? ChildGenderEnum.Girl : ChildGenderEnum.Boy;
};

export const useStoryCreatorManager = (
  store: StoryCreatorStore,
): StoryCreatorManager => {
  const { state, updateState } = store;

  const handleUpdateProfileInfo = (
    name: string,
    value: string | number | Country,
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
    value: Environment | Moral | Tone | number,
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
    // "None" / deselect — reset the whole form (name, interests, custom
    // moral/tone/environment, age, gender) back to its default state, keeping
    // only the user's non-avatar choices (chosen format + art style).
    if (!avatar) {
      const fresh = getStoryCreatorInitialState();
      updateState({
        ...fresh,
        format: store.state.format,
        artStyle: store.state.artStyle,
        avatarId: "",
      });
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

  // Keep child vs adult gender enums in sync with age (no prompt sync — built at submit).
  useEffect(() => {
    const { profileInfo } = state;
    let nextGender = profileInfo.gender;

    if (profileInfo.age >= 19) {
      if (profileInfo.gender === ChildGenderEnum.Girl) {
        nextGender = AdultGenderEnum.Female;
      } else if (profileInfo.gender === ChildGenderEnum.Boy) {
        nextGender = AdultGenderEnum.Male;
      }
    } else {
      if (profileInfo.gender === AdultGenderEnum.Female) {
        nextGender = ChildGenderEnum.Girl;
      } else if (profileInfo.gender === AdultGenderEnum.Male) {
        nextGender = ChildGenderEnum.Boy;
      }
    }

    if (nextGender === profileInfo.gender) {
      return;
    }

    updateState({
      ...state,
      profileInfo: {
        ...profileInfo,
        gender: nextGender,
      },
    });
  }, [state.profileInfo.age, state.profileInfo.gender]);

  return {
    handleUpdateProfileInfo,
    handleUpdateStoryInfo,
    handleSetFormat,
    handleSetArtStyle,
    handleSetAvatarId,
    handleSelectAvatar,
  };
};
