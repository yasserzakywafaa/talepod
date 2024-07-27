import { PagingInfo } from "src/shared/types";
import { Story } from "src/components/StoryCreator/store/state";

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
  audio: boolean | undefined;
}

export const getExploreInitialState = (): ExploreInitialState => {
  return {
    isFetching: false,
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
      audio: false,
    },
    pagingInfo: {
      pageNumber: 1,
      pageSize: 20,
    },
  };
};
