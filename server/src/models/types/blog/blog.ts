import { CallToAction } from "./blogParams/CallToAction";
import { ContentStructure } from "./blogParams/ContentStructure";
import { Frequency } from "./blogParams/Frequency";
import { Language } from "..";
import { ObjectId } from "mongodb";
import { PagingInfo } from "../api";
import { SubscriptionPlanEnum } from "../user";
import { SupportedLanguages } from "src/utils/languages";
import { TargetAudience } from "./blogParams/TargetAudience";
import { Time } from "./blogParams/Time";
import { ToneStyle } from "./blogParams/Tone";

export interface Blog {
  _id: ObjectId;
  slug: string;
  title: string;
  introduction: string;
  mainBlog: string;
  conclusion: string;
  callToAction: string;
  blogType: BlogTypeEnum;
  isFree: boolean | undefined;
  isBasic: boolean | undefined;
  isEssential: boolean | undefined;
  isPremium: boolean | undefined;
  blogSubscriptionPlan: SubscriptionPlanEnum;
  audioFile?: BlogAudioFile;
  blogParams: BlogParams;
  createdAt: Date;
  wordCount: number;
  readingTime: number;
  author: ObjectId;
  lastModified?: Date;
  tags?: string[];
  coverImageUrl?: string;
  isFeatured: boolean;
  version: string;
  seo?: BlogSeo;
}

export enum BlogTypeEnum {
  PRIVATE = "Private",
  PUBLIC = "Public",
}

export interface BlogData extends Partial<Blog> {
  language: SupportedLanguages;
}

export interface BlogSeo {
  createdAt: Date;
  content: string;
}

export interface BlogAudioFile {
  url: string;
  fileName: string;
  createdAt: Date;
}

export interface BlogParts {
  title: string;
  introduction: string;
  mainBlog: string;
  conclusion: string;
  callToAction: string;
}

export interface BlogParams {
  topicKeywords: string[];
  language: Language;
  callToAction: CallToAction;
  targetAudience: TargetAudience;
  hyperlinks: string[];
  toneStyle: ToneStyle;
  contentStructure: ContentStructure;
  minCharacters: number;
  maxCharacters: number;
  totalCharacters: number;
  frequency: Frequency;
  time: Time;
  createdByAdmin?: boolean;
}
