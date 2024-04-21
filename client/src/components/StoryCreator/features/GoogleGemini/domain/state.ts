import {
  ChildInfo,
  GenderEnum,
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
  return {
    isFetching: false,
    childInfo: {
      gender: GenderEnum.female,
      age: 0,
      hairColor: "",
      eyeColor: "",
      race: "",
      height: 0,
      nationality: "",
    },
    userPrompt: "",
    optionsAutoPrompt: "",
    aiAnswer: {
      statusCode: 0,
      title: "",
      description: "",
    },
  };
};
