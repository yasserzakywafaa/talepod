import { Story, StoryAudioFile } from "src/application/shared/interfaces";
import {
  getAutoImageGenPromptString,
  getAutoTextGenPromptString,
} from "src/components/StoryCreator/utils/getAutoPromptString";

import { OpenaiStore } from "./store";
import { useCreateStory } from "../features/CreateStory/useCreateStory";
import { useCreateStoryAudio } from "../features/CreateStoryAudio/useCreateStoryAudio";
import { useEffect } from "react";
import { useImageGeneration } from "../features/CreateStoryImage/useCreateStoryImage";
import { useStoryCreatorContext } from "src/components/StoryCreator/store/Provider";

export interface OpenaiManager {
  // Form
  handleUpdateChildInfo: (name: string, value: string) => void;
  // Create Story
  isCreateStoryFetching: (isFetching: boolean) => void;
  handleUpdateCreateStoryPrompt: (autoTextPrompt: string) => void;
  handleCreateStoryRequest: (userPrompt: string) => Promise<Story>;
  // Create Audio
  isCreateAudioFetching: (isFetching: boolean) => void;
  handleCreateAudio: (story: Story) => Promise<StoryAudioFile | undefined>;
  // Create Image
  isCreateImageFetching: (isFetching: boolean) => void;
  handleUpdateCreateImagePrompt: (autoImagePrompt: string) => void;
  handleCreateImage: (userPrompt: string) => void;
}

export const useOpenAiGPTManager = (store: OpenaiStore): OpenaiManager => {
  const { store: storyCreatorStore } = useStoryCreatorContext();
  const {
    isCreateStoryFetching,
    handleUpdateCreateStoryPrompt,
    handleCreateStoryRequest,
  } = useCreateStory(store);

  const { isCreateAudioFetching, handleCreateAudio } =
    useCreateStoryAudio(store);

  const {
    isCreateImageFetching,
    handleUpdateCreateImagePrompt,
    handleCreateImage,
  } = useImageGeneration(store);

  const handleUpdateChildInfo = (name: string, value: string) => {
    const newProfileInfo = {
      ...store.state.profileInfo,
      [name as string]: value as string,
    };

    store.updateState("profileInfo", newProfileInfo);
  };

  useEffect(() => {
    store.updateState("profileInfo", storyCreatorStore.state.profileInfo);

    store.updateState("createStory", {
      ...store.state.createStory,
      createStoryPrompt: getAutoTextGenPromptString(storyCreatorStore.state),
    });

    store.updateState("createImage", {
      ...store.state.createImage,
      createImagePrompt: getAutoImageGenPromptString(
        storyCreatorStore.state.profileInfo
      ),
    });
  }, [storyCreatorStore.state]);

  return {
    // Form
    handleUpdateChildInfo,
    // Create Story
    isCreateStoryFetching,
    handleCreateStoryRequest,
    handleUpdateCreateStoryPrompt,
    // Create Audio
    isCreateAudioFetching,
    handleCreateAudio,
    // Create Image
    isCreateImageFetching,
    handleUpdateCreateImagePrompt,
    handleCreateImage,
  };
};
