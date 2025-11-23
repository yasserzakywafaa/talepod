import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";

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
}

export const getMyStoriesInitialState = (): MyStoriesInitialState => {
  return {
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
  };
};
