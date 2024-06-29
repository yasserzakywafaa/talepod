import {
  ProfileInfo,
  getStoryCreatorInitialState,
} from "src/components/StoryCreator/store/state";

export interface GoogleGeminiInitialState {
  isFetching: boolean;
  childInfo: ProfileInfo;
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
  const { profileInfo: childInfo } = getStoryCreatorInitialState();
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
