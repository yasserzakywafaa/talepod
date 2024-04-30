import {
  ChildInfo,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/domain/state";

export interface OpenAiGPTInitialState {
  childInfo: ChildInfo;
  textGeneration: GenerationProps;
  imageGeneration: GenerationProps;
}

export interface GenerationProps {
  isFetching: boolean;
  userPrompt: string | undefined;
  autoTextPrompt: string;
  autoImagePrompt: string;
  aiAnswer: OpenAiGPTAIAnswerProps;
}

export interface OpenAiGPTAIAnswerProps {
  title: string;
  statusCode: number;
  description: string | string[];
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
      aiAnswer: {
        statusCode: 0,
        title: "",
        description: "",
      },
    },
    imageGeneration: {
      isFetching: false,
      userPrompt: "",
      autoTextPrompt: "",
      autoImagePrompt: "",
      aiAnswer: {
        statusCode: 0,
        title: "",
        description: "",
      },
    },
  };
};
