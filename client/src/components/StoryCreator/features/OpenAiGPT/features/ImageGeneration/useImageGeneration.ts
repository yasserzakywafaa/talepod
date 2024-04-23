import axios from "axios";
import { Notify, ToastTypes } from "src/components/Notification/Notification";
import END_POINTS from "src/lib/endpoints";
import { OpenAiGPTAIAnswerProps } from "../../domain/state";
import { OpenAiGPTStore } from "../../domain/store";

export interface UseImageGeneration {
  handleIsImageGenFetching: (isFetching: boolean) => void;
  handleUpdateAutoImagePrompt: (autoImagePrompt: string) => void;
  handleSetImageAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateImageRequest: (userPrompt: string) => void;
}

export const useImageGeneration = (
  store: OpenAiGPTStore
): UseImageGeneration => {
  const handleIsImageGenFetching = (isFetching: boolean) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      isFetching,
    });
  };

  const handleUpdateAutoImagePrompt = (autoImagePrompt: string) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      autoImagePrompt,
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

  const handleGenerateImageRequest = async (userPrompt: string) => {
    try {
      const response = await axios.post(END_POINTS.OPENAI.GENERATE.IMAGES, {
        userPrompt,
      });

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

  return {
    handleIsImageGenFetching,
    handleUpdateAutoImagePrompt,
    handleSetImageAiAnswer,
    handleGenerateImageRequest,
  };
};
