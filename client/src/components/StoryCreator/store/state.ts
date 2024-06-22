import { Language, Languages } from "src/shared/languages";

import { Environment } from "src/shared/generatedStory/Environments";
import { Moral } from "src/shared/generatedStory/Moral";
import { Tone } from "src/shared/generatedStory/Tone";

export interface StoryCreatorInitialState {
  isFetching: boolean;
  childInfo: ChildInfo;
  storyParams: StoryParams;
  textGeneration: TextGenerationProps;
  textToSpeechGeneration: TextGenerationProps;
  imageGeneration: ImageGenerationProps;
}

export enum ChildGenderEnum {
  Boy = "Boy",
  Girl = "Girl",
}

export enum AdultGenderEnum {
  Male = "Male",
  Female = "Female",
}

export type ChildInfo = {
  name: string;
  gender: ChildGenderEnum | AdultGenderEnum;
  age: number;
  interests: string;
  language: Language;
};

export interface StoryParams {
  tone: Tone;
  moral: Moral;
  audioLength: number;
  maxCharacters: number;
  environment: Environment;
}

export interface StoryParts {
  title: string;
  summary: string;
  mainStory: string;
  poem: string;
}

export interface TextGenerationProps {
  isFetching: boolean;
  userPrompt: string | undefined;
  autoTextPrompt: string;
  autoImagePrompt: string;
  generatedStory: GeneratedStoryParts | undefined;
}

export interface GeneratedStoryParts extends Partial<StoryParts> {
  storyId: string;
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

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    childInfo: {
      name: "",
      gender: ChildGenderEnum.Girl || AdultGenderEnum.Female,
      age: 1,
      interests: "",
      language: Languages[0],
    },
    storyParams: {
      audioLength: 5,
      maxCharacters: 2000,
      moral: {
        name: "",
        value: "",
      },
      tone: {
        name: "",
        value: "",
      },
      environment: {
        name: "",
        value: "",
      },
    },
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
