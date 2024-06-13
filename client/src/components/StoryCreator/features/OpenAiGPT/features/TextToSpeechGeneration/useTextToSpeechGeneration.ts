import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";

import END_POINTS from "src/application/shared/endpoints";
import { GeneratedStoryParts } from "../../store/state";
import { OpenAiGPTStore } from "../../store/store";
import axios from "axios";
import extractStoryParts from "src/components/StoryCreator/utils/extractStoryParts";
import { getRandomString } from "src/shared/utils/stringUtils";

export interface UseTextGeneration {
  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleSetTextToSpeechAiAnswer: (aiAnswer: GeneratedStoryParts) => void;
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
      const { name, age } = store.state.childInfo;

      if (!store.state.textGeneration.generatedStory) return;

      // Extract the parts from the story
      const storyParts = extractStoryParts(
        store.state.textGeneration.generatedStory.mainStory as string
      );
      console.log("🎯 storyParts :>>>", {
        storyParts,
      });

      const response = await axios.post(
        END_POINTS.OPENAI.GENERATE.TEXT_TO_SPEECH,
        {
          userPrompt: `${storyParts.mainStory} ${storyParts.poem}`,
          fileName: `${name}_${age}yo_${storyParts.title}_${getRandomString()}`,
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
