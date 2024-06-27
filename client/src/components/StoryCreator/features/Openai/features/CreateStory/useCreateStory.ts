import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import {
  ProfileInfo,
  Story,
  StoryParams,
} from "src/components/StoryCreator/store/state";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { OpenaiStore } from "../../store/store";

export interface UseTextGeneration {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (createStoryPrompt: string) => void;
  handleCreateStoryRequest: (
    storyPrompt: string,
    profileInfo: ProfileInfo,
    storyParams: StoryParams
  ) => Promise<Story>;
}

export const useCreateStory = (store: OpenaiStore): UseTextGeneration => {
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
    storyParams: StoryParams
  ): Promise<Story> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY,
        {
          storyPrompt,
          profileInfo,
          storyParams,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      isCreateStoryFetching(false);

      store.updateState("createStory", {
        ...store.state.createStory,
        story: {
          ...response.data,
        },
      });

      console.log("✅ response", { response });

      Notify({
        type: ToastTypes.Success,
        content: "Story created successfully.",
      });

      return response.data;
    } catch (error) {
      isCreateStoryFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
      throw new Error(`❌  Failed to create a story!  ${error}`);
    }
  };

  return {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
  };
};
