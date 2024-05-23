import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { OpenAiGPTAIAnswerProps } from "../../store/state";
import { OpenAiGPTStore } from "../../store/store";
import axios from "axios";

export interface UseTextGeneration {
  handleIsTextGenFetching: (isFetching: boolean) => void;
  handleUpdateUserTextPrompt: (userTextPrompt: string) => void;
  handleUpdateAutoTextPrompt: (autoImagePrompt: string) => void;
  handleSetTextAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateTextRequest: (userPrompt: string) => void;
}

export const useTextGeneration = (store: OpenAiGPTStore): UseTextGeneration => {
  const handleIsTextGenFetching = (isFetching: boolean) => {
    store.updateState("textGeneration", {
      ...store.state.textGeneration,
      isFetching,
    });
  };

  const handleUpdateUserTextPrompt = (userPrompt: string) => {
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

  const handleGenerateTextRequest = async (userPrompt: string) => {
    try {
      const response = await axios.post(END_POINTS.OPENAI.GENERATE.TEXT, {
        userPrompt,
      });

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

  return {
    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleUpdateAutoTextPrompt,
    handleSetTextAiAnswer,
    handleGenerateTextRequest,
  };
};
