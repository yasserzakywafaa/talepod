import { Environment, Environments } from "src/shared/mockedData/Environments";
import { Language, Languages } from "src/shared/languages";
import { Moral, Morals } from "src/shared/mockedData/Moral";
import { Tone, Tones } from "src/shared/mockedData/Tone";

import { DEFAULT_ART_STYLE_ID } from "src/shared/artStyles";
import { User } from "src/shared/types/user";

/** V2 story formats: "comic" (~6 illustrated pages) | "long" (prose + cover). */
export type StoryFormat = "comic" | "long";

export interface ComicPage {
  index: number;
  caption: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface LongStoryImage {
  index: number;
  imagePrompt: string;
  imageUrl?: string;
}

export interface StoryCreatorInitialState {
  isFetching: boolean;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  createStory: CreateStoryProps;
  createAudio: CreateAudioProps;
  isStorySettingsExpanded: boolean;
  /** Chosen story format (defaults to "comic" — the V2 flagship). */
  format: StoryFormat;
  /** Chosen illustration art style id (see src/shared/artStyles). */
  artStyle: string;
  /** Optional saved character (avatar) id whose look seeds the illustrations. */
  avatarId?: string;
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
  minWords: number;
  maxWords: number;
  totalWords: number;
  environment: Environment;
  createdByAdmin?: boolean;
  panelStyle?: string;
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
  isPremium: boolean | undefined;
  audioFile?: StoryAudioFile;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  createdAt: Date;
  seo?: StorySeo;
  author: string;
  lastModified?: Date;
  tags?: string[];
  coverImageUrl?: string;
  isFeatured: boolean;
  authorProfile?: User;
  format?: StoryFormat;
  artStyle?: string;
  pages?: ComicPage[];
  longStoryImages?: LongStoryImage[];
  imagesStatus?: "pending" | "ready" | "failed";
  pdfUrl?: string;
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
export type AudioFileUserVoice =
  | "Narrator"
  | "Heroic Voice"
  | "Fairy Tale"
  | "Deep Focus"
  | "Starry Night"
  | "Sparkle";

export type AudioUserVoice = {
  name: AudioFileVoice;
  value: AudioFileUserVoice;
  gender: AdultGenderEnum;
  isFree: boolean;
};

export interface CreateAudioProps extends CreateStoryProps {
  audioFileVoice: AudioUserVoice;
}

export const userAudioVoiceNames: AudioUserVoice[] = [
  {
    name: "alloy",
    value: "Narrator",
    gender: AdultGenderEnum.Male,
    isFree: false,
  },
  {
    name: "echo",
    value: "Heroic Voice",
    gender: AdultGenderEnum.Male,
    isFree: true,
  },
  {
    name: "onyx",
    value: "Deep Focus",
    gender: AdultGenderEnum.Male,
    isFree: false,
  },
  {
    name: "fable",
    value: "Fairy Tale",
    gender: AdultGenderEnum.Female,
    isFree: false,
  },
  {
    name: "nova",
    value: "Starry Night",
    gender: AdultGenderEnum.Female,
    isFree: true,
  },
  {
    name: "shimmer",
    value: "Sparkle",
    gender: AdultGenderEnum.Female,
    isFree: false,
  },
];

/**
 * Story format to open the create flow on. Honours a `?style=comic|long` query
 * param (set by the homepage "Try …" CTAs) so deep-links preselect the right
 * format. Read at store-init time — the create provider is page-scoped, so the
 * URL is correct here and there's no effect-ordering race with the manager.
 */
const getInitialStoryFormat = (): StoryFormat => {
  if (typeof window !== "undefined") {
    const style = new URLSearchParams(window.location.search).get("style");
    if (style === "comic" || style === "long") return style;
  }
  return "comic";
};

export const getStoryCreatorInitialState = (): StoryCreatorInitialState => {
  return {
    isFetching: false,
    isStorySettingsExpanded: false,
    format: getInitialStoryFormat(),
    artStyle: DEFAULT_ART_STYLE_ID,
    profileInfo: {
      name: "",
      gender: Genders[Math.floor(Math.random() * Genders.length)],
      age: Math.floor(Math.random() * 50),
      interests: "",
      // language: Languages[Math.floor(Math.random() * Languages.length)],
      language: Languages[0],
    },
    storyParams: {
      audioLength: 10,
      minCharacters: 3900,
      maxCharacters: 4000,
      totalCharacters: 4000,
      minWords: 800,
      maxWords: 1200,
      totalWords: 1000,
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
      audioFileVoice: userAudioVoiceNames[4],
    },
  };
};
