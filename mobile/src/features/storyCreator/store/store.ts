import {
  ProfileInfo,
  StoryCreatorInitialState,
  StoryFormat,
  StoryParams,
  getStoryCreatorInitialState,
} from "./state";

import { useEffect, useState } from "react";
import { consumeCreateDraft } from "src/shared/utils/authReturn";

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
  const [state, setState] = useState<StoryCreatorInitialState>(
    getStoryCreatorInitialState,
  );

  useEffect(() => {
    void (async () => {
      const draft = (await consumeCreateDraft()) as CreateDraft | null;
      if (!draft) return;
      setState((initial) => ({
        ...initial,
        format: draft.format ?? initial.format,
        artStyle: draft.artStyle ?? initial.artStyle,
        avatarId: draft.avatarId ?? initial.avatarId,
        profileInfo: { ...initial.profileInfo, ...draft.profileInfo },
        storyParams: { ...initial.storyParams, ...draft.storyParams },
      }));
    })();
  }, []);

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
