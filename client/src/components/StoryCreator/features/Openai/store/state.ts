import {
  CreateAudioProps,
  CreateStoryProps,
  ProfileInfo,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/store/state";

export interface OpenaiInitialState {
  profileInfo: ProfileInfo;
  createStory: CreateStoryProps;
  createAudio: CreateAudioProps;
  createImage: CreateImageProps;
}

export interface CreateImageProps {
  isFetching: boolean;
  createImagePrompt: string;
  image: Image | undefined;
}

export interface Image {
  title: string;
  statusCode: number;
  content: string | string[];
}

export const getOpenaiInitialState = (): OpenaiInitialState => {
  const { profileInfo: childInfo } = getStoryCreatorInitialState();
  return {
    profileInfo: childInfo,
    createStory: {
      isFetching: false,
      createStoryPrompt: "",
      story: undefined,
    },
    createAudio: {
      isFetching: false,
      createStoryPrompt: "",
      story: undefined,
    },
    createImage: {
      isFetching: false,
      createImagePrompt: "",
      image: undefined,
    },
  };
};
