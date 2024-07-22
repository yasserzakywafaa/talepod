import { ObjectId } from "mongodb";

export interface Story {
  _id: ObjectId;
  title: string;
  slug: string;
  summary: string;
  mainStory: string;
  poem: string;
  audioFile?: StoryAudioFile;
  createdAt: Date;
  seo?: StorySeo;
}

export interface StoryData extends Partial<Story> {
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
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

export interface StoryParts {
  title: string;
  summary: string;
  mainStory: string;
  poem: string;
}

export enum ChildGenderEnum {
  Boy = "Boy",
  Girl = "Girl",
}

export enum AdultGenderEnum {
  Male = "Male",
  Female = "Female",
}

export interface Language {
  name: string;
  value: string;
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
  minCharacters: number;
  maxCharacters: number;
  totalCharacters: number;
  environment: Environment;
}

export type Tone = BasicParam;
export type Moral = BasicParam;
export type Environment = BasicParam;

export interface BasicParam {
  name: string;
  value: string;
  description?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface StoryFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  audio: boolean | undefined;
}

export enum StoryFiltersEnum {
  name = "profileInfo.name",
  gender = "profileInfo.gender",
  age = "profileInfo.age",
  language = "profileInfo.language.value",
  moral = "storyParams.moral.value",
  tone = "storyParams.tone.value",
  environment = "storyParams.environment.value",
  audio = "storyParams.audio",
}
