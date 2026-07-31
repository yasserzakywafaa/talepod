import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import type { PagingInfo } from "src/shared/types/api";
import type { Story } from "src/features/storyCreator/store/state";

export interface MyStoriesInitialState {
  isFetching: boolean;
  stories: Story[];
  filters: MyStoriesStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
  pagingInfo: PagingInfo;
  /** Set when the list could not load at all, so the screen can explain why. */
  loadError: RequestErrorKind | null;
}

export interface MyStoriesStoryFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  createdByAdmin: boolean | undefined;
  audio: boolean | undefined;
  pageNumber?: number;
  pageSize?: number;
}

export const getMyStoriesInitialState = (): MyStoriesInitialState => ({
  isFetching: true,
  stories: [],
  loadError: null,
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
    createdByAdmin: false,
    audio: false,
  },
  pagingInfo: {
    pageNumber: 1,
    pageSize: 20,
  },
});
