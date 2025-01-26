import { SupportedLanguages } from "src/shared/languages";

export interface BlogInitialState {
  blog: Blog;
  isFetching: boolean;
}

export interface BlogFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Blog {
  _id: string;
  slug: string;
  title: string;
  introduction: string;
  mainBlog: string;
  conclusion: string;
  callToAction: string;
  blogType: BlogTypeEnum;
  language: SupportedLanguages;
  // isFree: boolean | undefined;
  // isBasic: boolean | undefined;
  // isEssential: boolean | undefined;
  // isPremium: boolean | undefined;
  // blogSubscriptionPlan: SubscriptionPlanEnum;
  createdAt: Date;
  // wordCount: number;
  // readingTime: number;
  // author: string;
  // lastModified?: Date;
  // tags?: string[];
  // coverImageUrl?: string;
  // isFeatured: boolean;
  // version: string;
}

export enum BlogTypeEnum {
  PRIVATE = "Private",
  PUBLIC = "Public",
}

export interface BlogParts {
  title: string;
  introduction: string;
  mainBlog: string;
  conclusion: string;
  callToAction: string;
}

export const getBlogInitialState = (): BlogInitialState => {
  return {
    isFetching: false,
    blog: {
      _id: "",
      title: "",
      slug: "",
      introduction: "",
      mainBlog: "",
      conclusion: "",
      callToAction: "",
      language: SupportedLanguages.en,
      blogType: BlogTypeEnum.PUBLIC,
      createdAt: new Date(),
    },
  };
};
