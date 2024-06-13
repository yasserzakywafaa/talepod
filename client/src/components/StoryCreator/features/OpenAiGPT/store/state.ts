import {
  ChildInfo,
  StoryParts,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/store/state";

export interface OpenAiGPTInitialState {
  childInfo: ChildInfo;
  textGeneration: TextGenerationProps;
  textToSpeechGeneration: TextGenerationProps;
  imageGeneration: ImageGenerationProps;
}

export interface TextGenerationProps {
  isFetching: boolean;
  userPrompt: string | undefined;
  autoTextPrompt: string;
  autoImagePrompt: string;
  generatedStory: GeneratedStoryParts | undefined;
}

export interface GeneratedStoryParts extends Partial<StoryParts> {
  statusCode?: number;
  url?: string;
}

export interface ImageGenerationProps {
  isFetching: boolean;
  userPrompt: string | undefined;
  autoTextPrompt: string;
  autoImagePrompt: string;
  generatedImage: GeneratedImageProps | undefined;
}

export interface GeneratedImageProps {
  title: string;
  statusCode: number;
  content: string | string[];
}

export const getOpenAiGPTInitialState = (): OpenAiGPTInitialState => {
  const { childInfo } = getStoryCreatorInitialState();
  return {
    childInfo,
    textGeneration: {
      isFetching: false,
      userPrompt: "",
      autoTextPrompt: "",
      autoImagePrompt: "",
      generatedStory: undefined,
    },
    textToSpeechGeneration: {
      isFetching: false,
      userPrompt: "",
      autoTextPrompt: "",
      autoImagePrompt: "",
      generatedStory: undefined,
    },
    imageGeneration: {
      isFetching: false,
      userPrompt: "",
      autoTextPrompt: "",
      autoImagePrompt: "",
      generatedImage: undefined,
    },
  };
};
