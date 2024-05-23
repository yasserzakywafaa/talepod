import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/lib/endpoints";
import { OpenAiGPTAIAnswerProps } from "../../store/state";
import { OpenAiGPTStore } from "../../store/store";
import axios from "axios";
import { getRandomString } from "src/lib/functions";

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
      const { name, age, nationality } = store.state.childInfo;
      const response = await axios.post(
        END_POINTS.OPENAI.GENERATE.TEXT_TO_SPEECH,
        {
          userPrompt: store.state.textGeneration.aiAnswer.description,
          fileName: `${name}_${age}yo_${nationality.name}_${getRandomString()}`,
        }
      );

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsTextToSpeechGenFetching(false);
      handleSetTextToSpeechAiAnswer({
        statusCode: response.status,
        title: response.data.fileName,
        description: response.data.audioFileUrl,
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
