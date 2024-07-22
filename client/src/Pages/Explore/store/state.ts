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
  gender: string | undefined;
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
      name: "",
      gender: "",
      age: [],
      language: [],
      moral: [],
      tone: [],
      environment: [],
      audio: false,
    },
  };
};
