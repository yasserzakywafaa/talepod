import { Story } from "src/components/StoryCreator/store/state";

export interface ExploreInitialState {
  isFetching: boolean;
  stories: Story[];
  filteredStories: Story[];
  filters: ExploreStoryFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
}

export interface ExploreStoryFilters {
  name: string | undefined;
  gender: string[];
  age: string[];
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
    filteredStories: [],
    activeFiltersCount: 0,
    filters: {
      name: undefined,
      gender: [],
      age: [],
      language: [],
      moral: [],
      tone: [],
      environment: [],
      audio: undefined,
    },
  };
};
