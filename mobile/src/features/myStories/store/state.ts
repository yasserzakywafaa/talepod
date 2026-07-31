import type { PagingInfo } from "src/shared/types/api";
import type { Story } from "src/features/storyCreator/store/state";

export interface MyStoriesInitialState {
  isFetching: boolean;
  stories: Story[];
  filters: MyStoriesStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
  pagingInfo: PagingInfo;
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
