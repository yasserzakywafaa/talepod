import {
  ChildInfo,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/domain/state";

export interface OpenAiGPTInitialState {
  isFetching: boolean;
  childInfo: ChildInfo;
  userPrompt: string;
  optionsAutoPrompt: string;
  aiAnswer: OpenAiGPTAIAnswerProps;
}

export interface OpenAiGPTAIAnswerProps {
  title: string;
  statusCode: number;
  description: string;
}

export const getOpenAiGPTInitialState = (): OpenAiGPTInitialState => {
  const { childInfo } = getStoryCreatorInitialState();
  return {
    isFetching: false,
    childInfo,
    userPrompt: "",
    optionsAutoPrompt: "",
    aiAnswer: {
      statusCode: 0,
      title: "",
      description: "",
    },
  };
};
