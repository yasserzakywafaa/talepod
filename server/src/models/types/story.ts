import { ObjectId } from "mongodb";
import { PagingInfo } from "./api";
import { User } from "./user";

/** V2 story formats. Stories created before V2 have no `format` and are
 *  treated as "long" everywhere (back-compat). */
export type StoryFormat = "comic" | "long";

/** A single comic-book page: short caption shown in the reader plus an
 *  illustration. `imagePrompt` is stored at creation time so the picture can
 *  be generated later; `imageUrl` is empty until image generation is wired. */
export interface ComicPage {
  index: number;
  caption: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface Story {
  _id: ObjectId;
  title: string;
  slug: string;
  summary: string;
  mainStory: string;
  poem: string;
  isPremium: boolean | undefined;
  audioFile?: StoryAudioFile;
  createdAt: Date;
  seo?: StorySeo;
  author: ObjectId;
  lastModified?: Date;
  tags?: string[];
  coverImageUrl?: string;
  isFeatured: boolean;
  authorProfile?: User;
  /** "comic" | "long". Absent on pre-V2 stories → treated as "long". */
  format?: StoryFormat;
  /** Populated for comic-format stories only. */
  pages?: ComicPage[];
  /** Background image-generation state. Absent on pre-V2 stories (never poll). */
  imagesStatus?: ImagesStatus;
  /** Canonical visual description of the hero (+ recurring companions),
   *  generated once and reused across the cover + every comic page so the
   *  character stays on-model across independent image generations. */
  characterSheet?: string;
  /** Cached S3 URL of the exported eBook PDF (screen layout). Regenerated
   *  while images are still filling in so it never caches a placeholder. */
  pdfUrl?: string;
}

export type ImagesStatus = "pending" | "ready" | "failed";

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
  /**
   * Word-based story length (long stories). Optional for back-compat with
   * stories created before the character→word length switch.
   */
  minWords?: number;
  maxWords?: number;
  totalWords?: number;
  environment: Environment;
  /** Comic-only: "Classic" | "Speech bubbles". */
  panelStyle?: string;
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

export interface StoryFilters extends PagingInfo {
  name: string | undefined;
  gender: AdultGenderEnum | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  createdByAdmin: boolean | undefined;
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
  createdByAdmin = "storyParams.createdByAdmin",
  audio = "audioFile.url",
  author = "author",
}
