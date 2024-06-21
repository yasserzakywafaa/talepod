import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { OpenAiGPTStore } from "../../store/store";
import { Story } from "src/application/shared/interfaces";

export interface UseTextGeneration {
  handleIsTextGenFetching: (isFetching: boolean) => void;
  handleUpdateUserTextPrompt: (userTextPrompt: string) => void;
  handleUpdateAutoTextPrompt: (autoImagePrompt: string) => void;
  handleGenerateTextRequest: (userPrompt: string) => Promise<Story>;
}

export const useCreateStory = (store: OpenAiGPTStore): UseTextGeneration => {
  const handleIsTextGenFetching = (isFetching: boolean) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      isFetching,
    });
  };

  const handleUpdateUserTextPrompt = (userPrompt: string) => {
    console.log("ℹ️  useTextGeneration:>>>", { userPrompt });
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      userPrompt,
    });
  };

  const handleUpdateAutoTextPrompt = (autoTextPrompt: string) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      autoTextPrompt,
    });
  };

  const handleGenerateTextRequest = async (
    userPrompt: string
  ): Promise<Story> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY,
        {
          userPrompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      handleIsTextGenFetching(false);

      store.updateState("textGeneration", {
        ...store.state.textGeneration,
        generatedStory: {
          statusCode: response.status,
          ...response.data,
        },
      });

      return response.data;
    } catch (error) {
      handleIsTextGenFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        store.updateState("textGeneration", {
          ...store.state.textGeneration,
          generatedStory: {
            statusCode: error.response.status,
            title: error.response.statusText,
            mainStory: error.response.statusText,
          },
        });

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
      throw new Error(`❌ Failed to create a story!  ${error}`);
    }
  };

  return {
    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleUpdateAutoTextPrompt,
    handleGenerateTextRequest,
  };
};
