import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import {
  getRandomString,
  replaceSpaceWithUnderscore,
} from "src/shared/utils/stringUtils";

import END_POINTS from "src/application/shared/endpoints";
import { GeneratedStoryParts } from "../../store/state";
import { OpenAiGPTStore } from "../../store/store";
import axios from "axios";
import extractStoryParts from "src/components/StoryCreator/utils/extractStoryParts";

export interface UseTextGeneration {
  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleSetTextToSpeechAiAnswer: (aiAnswer: GeneratedStoryParts) => void;
  handleGenerateTextToSpeechRequest: () => void;
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

  const handleSetTextToSpeechAiAnswer = (
    aiAnswer: Partial<GeneratedStoryParts>
  ) => {
    store.updateState("textToSpeechGeneration", {
      ...store.state.textGeneration,
      generatedStory: {
        statusCode: aiAnswer.statusCode,
        title: aiAnswer.title!,
        summary: aiAnswer.summary!,
        mainStory: aiAnswer.mainStory!,
        poem: aiAnswer.poem!,
      },
    });
  };

  const handleGenerateTextToSpeechRequest = async () => {
    try {
      const { name } = store.state.childInfo;
      const story = store.state.textGeneration.generatedStory;

      if (!story) return;

      // Extract the parts from the story
      const storyParts = extractStoryParts(story.mainStory as string);
      console.log("🎯 storyParts :>>>", {
        storyParts,
      });

      const fileName = `${replaceSpaceWithUnderscore(
        storyParts.title
      ).toLowerCase()}_${name}_${getRandomString()}`;

      const response = await axios.post(
        END_POINTS.OPENAI.GENERATE.STORY_AUdio,
        {
          fileName,
          storyId: story.storyId,
          userPrompt: `${storyParts.mainStory} ${storyParts.poem}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      console.log("ℹ️  OpenAiSection:>>>", {
        response,
      });

      handleIsTextToSpeechGenFetching(false);
      handleSetTextToSpeechAiAnswer({
        statusCode: response.status,
        title: response.data.fileName,
        mainStory: response.data.fileUrl,
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
          mainStory: error.response.statusText,
        });
        Notify({
          content: error.response.statusText,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `❌ Oops! Something went wrong.\n${error}`,
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
