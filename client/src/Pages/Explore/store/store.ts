import {
  ExploreInitialState,
  ExploreStoryFilters,
  getExploreInitialState,
} from "./state";

import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface ExploreStore {
  state: ExploreInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleToggleFiltersPanel: (isFetching: boolean) => void;
  handleSortStories: () => void;
  handleUpdateStory: (stories: Story[]) => void;
  handleUpdateFilters: (
    key: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof key]
  ) => void;
  handleApplyFilters: (filteredStories: Story[]) => void;
  handleClearFilters: () => void;
}

const useExploreStore = (): ExploreStore => {
  const initialState = getExploreInitialState();
  const [state, setState] = useState<ExploreInitialState>(initialState);
  const { stories } = state;

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const handleSortStories = () => {
    setState((prev) => ({
      ...prev,
      stories: stories.reverse(),
    }));
  };

  const handleToggleFiltersPanel = (isFiltersPanelOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      isFiltersPanelOpen,
    }));
  };

  const handleUpdateStory = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
      filteredStories: stories,
    }));
  };

  const handleUpdateFilters = (
    key: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof key]
  ) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const handleClearFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: getExploreInitialState().filters,
      filteredStories: stories,
    }));
  };

  const handleApplyFilters = (filteredStories: Story[]) => {
    setState((prev) => ({
      ...prev,
      // stories: filteredStories,
      filteredStories,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleUpdateStory,
    handleSortStories,
    handleToggleFiltersPanel,
    handleUpdateFilters,
    handleApplyFilters,
    handleClearFilters,
  };
};

export default useExploreStore;
