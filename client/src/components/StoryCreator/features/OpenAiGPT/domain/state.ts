import {
  ChildInfo,
  GenderEnum,
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
  return {
    isFetching: false,
    childInfo: {
      gender: GenderEnum.female,
      age: 0,
      hairColor: "",
      eyeColor: "",
      race: "",
      height: 0,
      nationality: {
        name: "",
        value: "",
      },
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
