import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Language, Languages } from "src/shared/languages";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import { Tone, Tones } from "src/shared/mockedData/Tone";

export interface StoryCreatorInitialState {
  isFetching: boolean;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  createStory: CreateStoryProps;
  createAudio: CreateAudioProps;
  isStorySettingsExpanded: boolean;
}

export enum ChildGenderEnum {
  Boy = "Boy",
  Girl = "Girl",
}

export enum AdultGenderEnum {
  Male = "Male",
  Female = "Female",
}

export enum AgeGroupEnum {
  Child = "Child",
  Adult = "Adult",
}

export const Genders = [
  ChildGenderEnum.Boy,
  ChildGenderEnum.Girl,
  AdultGenderEnum.Male,
  AdultGenderEnum.Female,
];

export type ProfileInfo = {
  name: string;
  gender: ChildGenderEnum | AdultGenderEnum;
  // gender: AgeGroupEnum;
  age: number;
  interests: string;
  language: Language;
};

export interface StoryParams {
  tone: Tone;
  moral: Moral;
  audioLength: number;
  minCharacters: number;
  maxCharacters: number;
  totalCharacters: number;
  environment: Environment;
  createdByAdmin?: boolean;
}

export interface CreateStoryProps {
  isFetching: boolean;
  createStoryPrompt: string;
  story: Story | undefined;
}
export interface Story {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  mainStory: string;
  poem: string;
  audioFile?: StoryAudioFile;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  createdAt: Date;
  seo?: StorySeo;
  author?: string;
  lastModified?: Date;
  tags?: string[];
  coverImageUrl?: string;
  isFeatured: boolean;
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
  // const ageGroupArray = Object.values(AgeGroupEnum);

  return {
    isFetching: false,
    isStorySettingsExpanded: false,
    profileInfo: {
      name: "",
      gender: Genders[Math.floor(Math.random() * Genders.length)],
      // gender: ageGroupArray[Math.floor(Math.random() * ageGroupArray.length)],
      age: Math.floor(Math.random() * 50),
      interests: "",
      language: Languages[Math.floor(Math.random() * Languages.length)],
    },
    storyParams: {
      audioLength: 10,
      minCharacters: 3900,
      maxCharacters: 4000,
      totalCharacters: 4000,
      moral: Morals[Math.floor(Math.random() * Morals.length)],
      tone: Tones[Math.floor(Math.random() * Tones.length)],
      environment:
        Environments[Math.floor(Math.random() * Environments.length)],
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
