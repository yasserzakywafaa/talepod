import type { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import { useApplicationContext } from "src/application/store/Provider";
import type { User } from "src/shared/types/user";

import type { OpenaiStore } from "./store/store";
import type {
  ProfileInfo,
  Story,
  StoryFormat,
  StoryParams,
  StorySeo,
} from "../store/state";

export interface UseTextGeneration {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (createStoryPrompt: string) => void;
  handleCreateStoryRequest: (
    storyPrompt: string,
    profileInfo: ProfileInfo,
    storyParams: StoryParams,
    format?: StoryFormat,
    artStyle?: string,
    avatarId?: string,
  ) => Promise<Story>;
  handleCreateStorySeoRequest: (
    storyId: string,
    userSeoPrompt: string,
  ) => Promise<StorySeo>;
}

export const useCreateStory = (store: OpenaiStore): UseTextGeneration => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const isCreateStoryFetching = (isFetching: boolean) => {
    store.updateState("createStory", {
      ...store.state.createStory,
      isFetching,
    });
  };

  const handleUpdateCreateStoryPrompt = (createStoryPrompt: string) => {
    store.updateState("createStory", {
      ...store.state.createStory,
      createStoryPrompt,
    });
  };

  const handleCreateStoryRequest = async (
    storyPrompt: string,
    profileInfo: ProfileInfo,
    storyParams: StoryParams,
    format: StoryFormat = "comic",
    artStyle?: string,
    avatarId?: string,
  ): Promise<Story> => {
    const payload = {
      storyPrompt,
      profileInfo,
      storyParams,
      format,
      artStyle,
      avatarId: avatarId || undefined,
      userInfo: auth.user as User,
    };

    const response: AxiosResponse<Story> = await api.post(
      END_POINTS.CREATE.GENERATE.STORY,
      payload,
    );

    store.updateState("createStory", {
      ...store.state.createStory,
      story: { ...response.data },
    });

    return response.data;
  };

  const handleCreateStorySeoRequest = async (
    storyId: string,
    userSeoPrompt: string,
  ): Promise<StorySeo> => {
    const response: AxiosResponse<StorySeo> = await api.post(
      END_POINTS.CREATE.GENERATE.STORY_SEO,
      { storyId, userSeoPrompt },
    );
    return response.data;
  };

  return {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
    handleCreateStorySeoRequest,
  };
};

export const getCreateStoryErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, "Oops, something went wrong!");
