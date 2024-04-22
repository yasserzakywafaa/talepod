import { Notify, ToastTypes } from "src/components/Notification/Notification";

import END_POINTS from "src/lib/endpoints";
import { OpenAiGPTAIAnswerProps } from "./state";
import { OpenAiGPTStore } from "./store";
import axios from "axios";
import {
  getAutoImageGenPromptString,
  getAutoTextGenPromptString,
} from "src/components/StoryCreator/utils/getAutoPromptString";
import { useEffect } from "react";
import { useStoryCreatorContext } from "src/components/StoryCreator/domain/Provider";

export interface OpenAiGPTManager {
  handleUpdateChildInfo: (name: string, value: string) => void;
  handleUpdateUserPrompt: (userPrompt: string) => void;

  handleIsTextGenFetching: (isFetching: boolean) => void;
  handleSetTextAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleUpdateAutoTextPrompt: (autoTextPrompt: string) => void;
  handleGenerateTextRequest: (userPrompt: string) => void;

  handleUpdateAutoImagePrompt: (autoImagePrompt: string) => void;
  handleIsImageGenFetching: (isFetching: boolean) => void;
  handleSetImageAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateImageRequest: (userPrompt: string) => void;
}

export const useOpenAiGPTManager = (
  store: OpenAiGPTStore
): OpenAiGPTManager => {
  const { store: storyCreatorStore } = useStoryCreatorContext();

  const handleIsTextGenFetching = (isFetching: boolean) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      isFetching,
    });
  };

  const handleIsImageGenFetching = (isFetching: boolean) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      isFetching,
    });
  };

  const handleUpdateChildInfo = (name: string, value: string) => {
    const newChildInfo = {
      ...store.state.childInfo,
      [name as string]: value as string,
    };

    store.updateState("childInfo", newChildInfo);
  };

  const handleUpdateAutoTextPrompt = (autoTextPrompt: string) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      autoTextPrompt,
    });
  };

  const handleUpdateAutoImagePrompt = (autoImagePrompt: string) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      autoImagePrompt,
    });
  };

  const handleUpdateUserPrompt = (userPrompt: string) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      userPrompt,
    });

    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      userPrompt,
    });
  };

  const handleSetTextAiAnswer = (aiAnswer: OpenAiGPTAIAnswerProps) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      aiAnswer: {
        statusCode: aiAnswer.statusCode,
        title: aiAnswer.title,
        description: aiAnswer.description,
      },
    });
  };

  const handleSetImageAiAnswer = (aiAnswer: OpenAiGPTAIAnswerProps) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      aiAnswer: {
        statusCode: aiAnswer.statusCode,
        title: aiAnswer.title,
        description: aiAnswer.description,
      },
    });
  };

  const handleGenerateTextRequest = async (userPrompt: string) => {
    try {
      const URL = END_POINTS(userPrompt);
      const response = await axios.post(URL.OPENAI.USER_PROMPT);

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsTextGenFetching(false);
      handleSetTextAiAnswer({
        statusCode: response.status,
        title: "",
        description: response.data,
      });
    } catch (error) {
      console.error("OpenAiSection:>>> Error", {
        error,
      });
      handleIsTextGenFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        handleSetTextAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.statusText,
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
    }
  };

  const handleGenerateImageRequest = async (userPrompt: string) => {
    try {
      const URL = END_POINTS(userPrompt);
      const response = await axios.post(URL.OPENAI.USER_PROMPT);

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsImageGenFetching(false);
      handleSetImageAiAnswer({
        statusCode: response.status,
        title: "",
        description: response.data,
      });
    } catch (error) {
      console.error("OpenAiSection:>>> Error", {
        error,
      });
      handleIsImageGenFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        handleSetImageAiAnswer({
          statusCode: error.response.status,
          title: error.response.statusText,
          description: error.response.statusText,
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
    }
  };

  useEffect(() => {
    store.updateState("childInfo", storyCreatorStore.state.childInfo);

    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      autoTextPrompt: getAutoTextGenPromptString(
        storyCreatorStore.state.childInfo
      ),
    });

    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      autoImagePrompt: getAutoImageGenPromptString(
        storyCreatorStore.state.childInfo
      ),
    });
  }, [storyCreatorStore.state.childInfo]);

  return {
    handleIsTextGenFetching,
    handleIsImageGenFetching,
    handleUpdateChildInfo,
    handleUpdateAutoTextPrompt,
    handleUpdateAutoImagePrompt,
    handleUpdateUserPrompt,
    handleSetTextAiAnswer,
    handleSetImageAiAnswer,
    handleGenerateTextRequest,
    handleGenerateImageRequest,
  };
};
