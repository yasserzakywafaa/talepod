import { PagingInfo } from "src/shared/types";
import { Story } from "src/components/StoryCreator/store/state";
import { SupportedLanguages } from "src/shared/languages";

export interface ExploreInitialState {
  isFetching: boolean;
  stories: Story[];
  filters: ExploreStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
  pagingInfo: PagingInfo;
}

export interface ExploreStoryFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  createdByAdmin: boolean | undefined;
  audio: boolean | undefined;
}

const getLanguageFromUserLanguage = (): string[] | undefined => {
  const userLanguage = navigator.language || navigator.languages[0];
  const supportedLanguages = Object.values(SupportedLanguages);

  const matchedLanguage = supportedLanguages.find((lang) =>
    userLanguage.startsWith(lang)
  ) as string;

  return matchedLanguage ? [matchedLanguage] : undefined;
};

export const getExploreInitialState = (
  hasDefaultLanguage?: boolean
): ExploreInitialState => {
  return {
    isFetching: true,
    stories: [],
    isFiltersPanelOpen: false,
    activeFiltersCount: 0,
    filters: {
      name: "",
      gender: "",
      age: [],
      language: (hasDefaultLanguage && getLanguageFromUserLanguage()) || [],
      moral: [],
      tone: [],
      environment: [],
      createdByAdmin: false,
      audio: false,
    },
    pagingInfo: {
      pageNumber: 1,
      pageSize: 20,
    },
  };
};
