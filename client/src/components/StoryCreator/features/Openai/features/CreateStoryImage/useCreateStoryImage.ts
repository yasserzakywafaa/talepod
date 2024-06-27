import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { OpenaiStore } from "../../store/store";
import axios from "axios";

export interface UseImageGeneration {
  isCreateImageFetching: (isFetching: boolean) => void;
  handleUpdateCreateImagePrompt: (autoImagePrompt: string) => void;
  handleCreateImage: (userPrompt: string) => void;
}

export const useImageGeneration = (store: OpenaiStore): UseImageGeneration => {
  const isCreateImageFetching = (isFetching: boolean) => {
    store.updateState("createImage", {
      ...store.state.createImage,
      isFetching,
    });
  };

  const handleUpdateCreateImagePrompt = (autoImagePrompt: string) => {
    store.updateState("createImage", {
      ...store.state.createImage,
      createImagePrompt: autoImagePrompt,
    });
  };

  const handleCreateImage = async (userPrompt: string) => {
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

      console.log("ℹ️  handleCreateImage:>>>", {
        response,
      });

      isCreateImageFetching(false);
    } catch (error) {
      console.error("❌  Failed to create an image", {
        error,
      });
      isCreateImageFetching(false);

      if (axios.isAxiosError(error) && error.response) {
        console.log({
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
          content: `❌  Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    isCreateImageFetching,
    handleUpdateCreateImagePrompt,
    handleCreateImage,
  };
};
