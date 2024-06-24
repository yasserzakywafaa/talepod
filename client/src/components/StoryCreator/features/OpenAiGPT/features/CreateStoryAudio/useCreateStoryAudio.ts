import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { Story, StoryAudioFile } from "src/application/shared/interfaces";
import axios, { AxiosResponse } from "axios";
import {
  getRandomString,
  replaceSpaceWithUnderscore,
} from "src/shared/utils/stringUtils";

import END_POINTS from "src/application/shared/endpoints";
import { OpenAiGPTStore } from "../../store/store";

export interface UseTextGeneration {
  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleGenerateTextToSpeechRequest: (
    story: Story
  ) => Promise<StoryAudioFile | undefined>;
}

export const useCreateStoryAudio = (
  store: OpenAiGPTStore
): UseTextGeneration => {
  const handleIsTextToSpeechGenFetching = (isFetching: boolean) => {
    store.updateState("textToSpeechGeneration", {
      ...store.state.textGeneration,
      isFetching,
    });
  };

  const handleGenerateTextToSpeechRequest = async (
    story: Story
  ): Promise<StoryAudioFile | undefined> => {
    try {
      const { name } = store.state.childInfo;
      if (!story) return;

      const fileName = `${replaceSpaceWithUnderscore(
        story.title
      ).toLowerCase()}_${name}_${getRandomString()}`;

      const response: AxiosResponse<StoryAudioFile, StoryAudioFile> =
        await axios.post(
          END_POINTS.OPENAI.GENERATE.STORY_AUdio,
          {
            fileName,
            storyId: story._id,
            userPrompt: `${story.mainStory} ${story.poem}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Custom-Header": new Date().toISOString(),
            },
          }
        );

      handleIsTextToSpeechGenFetching(false);

      Notify({
        type: ToastTypes.Success,
        content: "Story audio created successfully.",
      });

      return response.data;
    } catch (error) {
      console.error("OpenAiSection:>>> Error", {
        error,
      });
      handleIsTextToSpeechGenFetching(false);

      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });

        console.error("❌ Failed to create an audio file for the story!", {
          error: error.response.statusText,
        });
      } else {
        Notify({
          content: `❌ Oops! Something went wrong.\n${error}`,
          type: ToastTypes.Error,
        });
      }
    }

    return;
  };

  return {
    handleIsTextToSpeechGenFetching,
    handleGenerateTextToSpeechRequest,
  };
};
