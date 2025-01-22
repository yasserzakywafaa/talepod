import { CallToAction } from "./blogParams/CallToAction";
import { ContentStructure } from "./blogParams/ContentStructure";
import { Frequency } from "./blogParams/Frequency";
import { ObjectId } from "mongodb";
import { PagingInfo } from "../api";
import { SubscriptionPlanEnum } from "../user";
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
  blogParams: BlogParams;
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

export type Tone = BasicParam;
export type Moral = BasicParam;
export type Environment = BasicParam;

export interface BasicParam {
  name: string;
  value: string;
  description?: string;
  customValue?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface BlogFilters extends PagingInfo {
  topicKeywords: string | undefined;
  hyperlinks: string | undefined;
  language: string[];
  blogType: BlogTypeEnum | undefined;
}

export enum BlogFiltersEnum {
  topicKeywords = "blogParams.topicKeywords",
  hyperlinks = "blogParams.hyperlinks",
  language = "blogParams.language.value",
  blogType = "blogType",
  author = "author",
}
