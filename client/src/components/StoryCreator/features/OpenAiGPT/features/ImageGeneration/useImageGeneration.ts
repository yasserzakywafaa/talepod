import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { GeneratedStoryParts } from "../../store/state";
import { OpenAiGPTStore } from "../../store/store";
import axios from "axios";

export interface UseImageGeneration {
  handleIsImageGenFetching: (isFetching: boolean) => void;
  handleUpdateUserImagePrompt: (userImagePrompt: string) => void;
  handleUpdateAutoImagePrompt: (autoImagePrompt: string) => void;
  handleSetImageAiAnswer: (aiAnswer: GeneratedStoryParts) => void;
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

  const handleUpdateUserImagePrompt = (userPrompt: string) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      userPrompt,
    });
  };

  const handleUpdateAutoImagePrompt = (autoImagePrompt: string) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      autoImagePrompt,
    });
  };

  const handleSetImageAiAnswer = (aiAnswer: GeneratedStoryParts) => {
    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      generatedStory: {
        statusCode: aiAnswer.statusCode,
        title: aiAnswer.title,
        mainStory: aiAnswer.mainStory,
      },
    });
  };

  const handleGenerateImageRequest = async (userPrompt: string) => {
    try {
      const response = await axios.post(
        END_POINTS.OPENAI.GENERATE.IMAGES,
        {
          userPrompt,
          numImages: 5, // Specify the number of images to generate
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      // // Extract the generated images from the response
      // const images = response.data.choices
      //   .map((choice) =>
      //     choice.finish_reason === "stop" ? choice.image : null
      //   )
      //   .filter((image) => image !== null);

      // return images;

      console.log("OpenAiSection:>>>", {
        response,
      });

      handleIsImageGenFetching(false);
      handleSetImageAiAnswer({
        statusCode: response.status,
        title: "",
        mainStory: response.data,
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
          mainStory: error.response.statusText,
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
    handleUpdateUserImagePrompt,
    handleUpdateAutoImagePrompt,
    handleSetImageAiAnswer,
    handleGenerateImageRequest,
  };
};
