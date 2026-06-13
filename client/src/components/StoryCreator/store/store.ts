import {
  ProfileInfo,
  StoryCreatorInitialState,
  StoryFormat,
  StoryParams,
  getStoryCreatorInitialState,
} from "./state";

import { useState } from "react";
import routes from "src/application/routes";
import { popCreateDraft } from "src/shared/utils/authReturn";

export interface StoryCreatorStore {
  state: StoryCreatorInitialState;
  updateState: (newState: StoryCreatorInitialState) => void;
  toggleStorySettings: (isStorySettingsExpanded: boolean) => void;
}

type CreateDraft = Partial<{
  profileInfo: Partial<ProfileInfo>;
  storyParams: Partial<StoryParams>;
  format: StoryFormat;
  artStyle: string;
  avatarId: string;
}>;

const useStoryCreatorStore = (): StoryCreatorStore => {
  const [state, setState] = useState<StoryCreatorInitialState>(() => {
    const initial = getStoryCreatorInitialState();
    // Only the page-scoped provider on /create restores a saved draft; the
    // app-global provider also mounts on "/" (where OAuth lands) and would
    // otherwise consume it first. popCreateDraft() removes it once read.
    if (
      typeof window === "undefined" ||
      window.location.pathname !== routes.create
    ) {
      return initial;
    }
    const draft = popCreateDraft() as CreateDraft | null;
    if (!draft) return initial;
    return {
      ...initial,
      format: draft.format ?? initial.format,
      artStyle: draft.artStyle ?? initial.artStyle,
      avatarId: draft.avatarId ?? initial.avatarId,
      profileInfo: { ...initial.profileInfo, ...draft.profileInfo },
      storyParams: { ...initial.storyParams, ...draft.storyParams },
    };
  });

  const updateState = (newState: StoryCreatorInitialState) => {
    setState(newState);
  };

  const toggleStorySettings = (isStorySettingsExpanded: boolean) => {
    setState((prev) => ({
      ...prev,
      isStorySettingsExpanded: !prev.isStorySettingsExpanded,
    }));
  };

  return {
    state,
    updateState,
    toggleStorySettings,
  };
};

export default useStoryCreatorStore;
