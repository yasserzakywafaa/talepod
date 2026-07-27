import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";
import { SupportedLanguages } from "src/shared/languages";

export type LibraryStoriesSource = "community" | "talepod" | "users";

export interface LibraryInitialState {
  isFetching: boolean;
  stories: Story[];
  filters: LibraryStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
  pagingInfo: PagingInfo;
  storiesSource: LibraryStoriesSource;
}

export interface LibraryStoryFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  audio: boolean | undefined;
}

const getLanguageFromUserLanguage = (): string[] | undefined => {
  const userLanguage = navigator.language || navigator.languages[0];
  const supportedLanguages = Object.values(SupportedLanguages);

  const matchedLanguage = supportedLanguages.find((lang) =>
    userLanguage.startsWith(lang),
  ) as string;

  return matchedLanguage ? [matchedLanguage] : undefined;
};

export const getLibraryInitialState = (
  hasDefaultLanguage?: boolean,
): LibraryInitialState => {
  return {
    isFetching: true,
    stories: [],
    storiesSource: "community",
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
      audio: false,
    },
    pagingInfo: {
      pageNumber: 1,
      pageSize: 20,
    },
  };
};
