import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/lib/endpoints";
import { OpenAiGPTAIAnswerProps } from "../../domain/state";
import { OpenAiGPTStore } from "../../domain/store";
import axios from "axios";

export interface UseTextGeneration {
  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleSetTextToSpeechAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateTextToSpeechRequest: () => void;
}

export const useTextToSpeechGeneration = (
  store: OpenAiGPTStore
): UseTextGeneration => {
  const handleIsTextToSpeechGenFetching = (isFetching: boolean) => {
    store.updateState("textToSpeechGeneration", {
      ...store.state.textGeneration,
      isFetching,
    });
  };

  const handleSetTextToSpeechAiAnswer = (aiAnswer: OpenAiGPTAIAnswerProps) => {
    store.updateState("textToSpeechGeneration", {
      ...store.state.textGeneration,
      aiAnswer: {
        statusCode: aiAnswer.statusCode,
        title: aiAnswer.title,
        description: aiAnswer.description,
      },
    });
  };

  const handleGenerateTextToSpeechRequest = async () => {
    try {
      const response = await axios.post(
        END_POINTS.OPENAI.GENERATE.TEXT_TO_SPEECH,
        {
          userPrompt: store.state.textGeneration.aiAnswer.description,
        }
      );

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsTextToSpeechGenFetching(false);
      handleSetTextToSpeechAiAnswer({
        statusCode: response.status,
        title: "",
        description: response.data.audioUrl,
      });
    } catch (error) {
      console.error("OpenAiSection:>>> Error", {
        error,
      });
      handleIsTextToSpeechGenFetching(false);
      if (axios.isAxiosError(error) && error.response) {
        handleSetTextToSpeechAiAnswer({
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
    handleIsTextToSpeechGenFetching,
    handleSetTextToSpeechAiAnswer,
    handleGenerateTextToSpeechRequest,
  };
};
