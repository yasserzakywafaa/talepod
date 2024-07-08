import { Language, Languages } from "src/shared/languages";

import { Environment } from "src/shared/mockedData/Environments";
import { Moral } from "src/shared/mockedData/Moral";
import { Tone } from "src/shared/mockedData/Tone";

export interface StoryCreatorInitialState {
  isFetching: boolean;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  createStory: CreateStoryProps;
  createAudio: CreateAudioProps;
}

export enum ChildGenderEnum {
  Boy = "Boy",
  Girl = "Girl",
}

export enum AdultGenderEnum {
  Male = "Male",
  Female = "Female",
}

export type ProfileInfo = {
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

export interface CreateStoryProps {
  isFetching: boolean;
  createStoryPrompt: string;
  story: Story | undefined;
}
export interface Story {
  _id: string;
  createdAt: Date;
  title: string;
  summary: string;
  mainStory: string;
  poem: string;
  audioFile?: StoryAudioFile;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  seo?: StorySeo;
}

export interface StorySeo {
  createdAt: Date;
  content: string;
}

export interface StoryAudioFile {
  url: string;
  fileName: string;
  createdAt: Date;
}

export type AudioFileVoice =
  | "alloy"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "shimmer";

export type CreateAudioProps = CreateStoryProps;

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    profileInfo: {
      name: "",
      gender: ChildGenderEnum.Girl || AdultGenderEnum.Female,
      age: 1,
      interests: "",
      language: Languages[0],
    },
    storyParams: {
      audioLength: 10,
      maxCharacters: 4000,
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
  };
};
