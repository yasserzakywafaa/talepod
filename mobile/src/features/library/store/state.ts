import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import type { PagingInfo } from "src/shared/types/api";
import type { Story } from "src/features/storyCreator/store/state";

export type LibraryStoriesSource = "community" | "talepod" | "users";

export interface LibraryInitialState {
  isFetching: boolean;
  stories: Story[];
  filters: LibraryStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
  pagingInfo: PagingInfo;
  storiesSource: LibraryStoriesSource;
  /** Set when the list could not load at all, so the screen can explain why. */
  loadError: RequestErrorKind | null;
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

export const getLibraryInitialState = (): LibraryInitialState => ({
  isFetching: true,
  stories: [],
  loadError: null,
  storiesSource: "community",
  isFiltersPanelOpen: false,
  activeFiltersCount: 0,
  filters: {
    name: "",
    gender: "",
    age: [],
    language: [],
    moral: [],
    tone: [],
    environment: [],
    audio: false,
  },
  pagingInfo: {
    pageNumber: 1,
    pageSize: 20,
  },
});
