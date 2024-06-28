import { Story } from "src/components/StoryCreator/store/state";

export interface ExploreInitialState {
  isFetching: boolean;
  stories: Story[];
  filteredStories: Story[];
  filters: ExploreStoryFilters;
  isFiltersPanelOpen: boolean;
}

export interface ExploreStoryFilters {
  name: string;
  gender: string[];
  age: string[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
}

export const getExploreInitialState = (): ExploreInitialState => {
  return {
    isFetching: false,
    stories: [],
    isFiltersPanelOpen: false,
    filteredStories: [],
    filters: {
      name: "",
      gender: [],
      age: [],
      language: [],
      moral: [],
      tone: [],
      environment: [],
    },
  };
};
