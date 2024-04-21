import {
  ChildInfo,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/domain/state";

export interface GoogleGeminiInitialState {
  isFetching: boolean;
  childInfo: ChildInfo;
  userPrompt: string;
  optionsAutoPrompt: string;
  aiAnswer: GoogleGeminiAIAnswerProps;
}

export interface GoogleGeminiAIAnswerProps {
  title: string;
  statusCode: number;
  description: string;
}

export const getGoogleGeminiInitialState = (): GoogleGeminiInitialState => {
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
