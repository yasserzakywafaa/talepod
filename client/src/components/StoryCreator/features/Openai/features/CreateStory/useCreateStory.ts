import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { OpenaiStore } from "../../store/store";
import { Story } from "src/application/shared/interfaces";

export interface UseTextGeneration {
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (createStoryPrompt: string) => void;
  handleCreateStoryRequest: (storyPrompt: string) => Promise<Story>;
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
    storyPrompt: string
  ): Promise<Story> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY,
        {
          userPrompt: storyPrompt,
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
