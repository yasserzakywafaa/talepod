import {
  getAutoImageGenPromptString,
  getAutoTextGenPromptString,
} from "src/components/StoryCreator/utils/getAutoPromptString";

import { OpenAiGPTAIAnswerProps } from "./state";
import { OpenAiGPTStore } from "./store";
import { useEffect } from "react";
import { useImageGeneration } from "../features/ImageGeneration/useImageGeneration";
import { useStoryCreatorContext } from "src/components/StoryCreator/store/Provider";
import { useTextGeneration } from "../features/TextGeneration/useTextGeneration";
import { useTextToSpeechGeneration } from "../features/TextToSpeechGeneration/useTextToSpeechGeneration";

export interface OpenAiGPTManager {
  handleUpdateChildInfo: (name: string, value: string) => void;
  // handleUpdateUserPrompt: (userPrompt: string) => void;

  handleIsTextGenFetching: (isFetching: boolean) => void;
  handleUpdateUserTextPrompt: (userTextPrompt: string) => void;
  handleSetTextAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleUpdateAutoTextPrompt: (autoTextPrompt: string) => void;
  handleGenerateTextRequest: (userPrompt: string) => void;

  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleSetTextToSpeechAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateTextToSpeechRequest: (userPrompt: string) => void;

  handleUpdateAutoImagePrompt: (autoImagePrompt: string) => void;
  handleIsImageGenFetching: (isFetching: boolean) => void;
  handleUpdateUserImagePrompt: (userImagePrompt: string) => void;
  handleSetImageAiAnswer: (aiAnswer: OpenAiGPTAIAnswerProps) => void;
  handleGenerateImageRequest: (userPrompt: string) => void;
}

export const useOpenAiGPTManager = (
  store: OpenAiGPTStore
): OpenAiGPTManager => {
  const { store: storyCreatorStore } = useStoryCreatorContext();
  const {
    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleUpdateAutoTextPrompt,
    handleSetTextAiAnswer,
    handleGenerateTextRequest,
  } = useTextGeneration(store);

  const {
    handleIsTextToSpeechGenFetching,
    handleSetTextToSpeechAiAnswer,
    handleGenerateTextToSpeechRequest,
  } = useTextToSpeechGeneration(store);

  const {
    handleIsImageGenFetching,
    handleUpdateUserImagePrompt,
    handleUpdateAutoImagePrompt,
    handleSetImageAiAnswer,
    handleGenerateImageRequest,
  } = useImageGeneration(store);

  const handleUpdateChildInfo = (name: string, value: string) => {
    const newChildInfo = {
      ...store.state.childInfo,
      [name as string]: value as string,
    };

    store.updateState("childInfo", newChildInfo);
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
    handleUpdateChildInfo,

    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleGenerateTextRequest,
    handleUpdateAutoTextPrompt,
    handleSetTextAiAnswer,

    handleIsTextToSpeechGenFetching,
    handleSetTextToSpeechAiAnswer,
    handleGenerateTextToSpeechRequest,

    handleIsImageGenFetching,
    handleUpdateUserImagePrompt,
    handleUpdateAutoImagePrompt,
    handleSetImageAiAnswer,
    handleGenerateImageRequest,
  };
};
