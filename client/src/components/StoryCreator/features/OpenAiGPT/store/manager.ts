import {
  getAutoImageGenPromptString,
  getAutoTextGenPromptString,
} from "src/components/StoryCreator/utils/getAutoPromptString";

import { GeneratedStoryParts } from "./state";
import { OpenAiGPTStore } from "./store";
import { useEffect } from "react";
import { useImageGeneration } from "../features/ImageGeneration/useImageGeneration";
import { useStoryCreatorContext } from "src/components/StoryCreator/store/Provider";
import { useTextGeneration } from "../features/TextGeneration/useTextGeneration";
import { useTextToSpeechGeneration } from "../features/TextToSpeechGeneration/useTextToSpeechGeneration";

export interface OpenAiGPTManager {
  handleUpdateChildInfo: (name: string, value: string) => void;

  handleIsTextGenFetching: (isFetching: boolean) => void;
  handleUpdateUserTextPrompt: (userTextPrompt: string) => void;
  handleUpdateAutoTextPrompt: (autoTextPrompt: string) => void;
  handleGenerateTextRequest: (userPrompt: string) => void;

  handleIsTextToSpeechGenFetching: (isFetching: boolean) => void;
  handleSetTextToSpeechAiAnswer: (aiAnswer: GeneratedStoryParts) => void;
  handleGenerateTextToSpeechRequest: (userPrompt: string) => void;

  handleUpdateAutoImagePrompt: (autoImagePrompt: string) => void;
  handleIsImageGenFetching: (isFetching: boolean) => void;
  handleUpdateUserImagePrompt: (userImagePrompt: string) => void;
  handleSetImageAiAnswer: (aiAnswer: GeneratedStoryParts) => void;
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
      autoTextPrompt: getAutoTextGenPromptString(storyCreatorStore.state),
    });

    store.updateState("imageGeneration", {
      ...store.state.imageGeneration,
      autoImagePrompt: getAutoImageGenPromptString(
        storyCreatorStore.state.childInfo
      ),
    });
  }, [storyCreatorStore.state]);

  return {
    handleUpdateChildInfo,

    handleIsTextGenFetching,
    handleUpdateUserTextPrompt,
    handleGenerateTextRequest,
    handleUpdateAutoTextPrompt,

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
