import {
  ExploreInitialState,
  ExploreStoryFilters,
  getExploreInitialState,
} from "./state";

import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface ExploreStore {
  state: ExploreInitialState;
  isExploreFetching: (isFetching: boolean) => void;
  toggleFiltersPanel: (isFetching: boolean) => void;
  sortStories: () => void;
  updateStories: (stories: Story[]) => void;
  updateFilters: (
    key: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof key]
  ) => void;
  clearFilters: () => void;
  applyFilters: (stories: Story[]) => void;
  setActiveFiltersCount: (activeFiltersCount: number) => void;
}

const useExploreStore = (): ExploreStore => {
  const initialState = getExploreInitialState();
  const [state, setState] = useState<ExploreInitialState>(initialState);
  const { stories } = state;

  const isExploreFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const toggleFiltersPanel = (isFiltersPanelOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      isFiltersPanelOpen,
    }));
  };

  const sortStories = () => {
    setState((prev) => ({
      ...prev,
      stories: stories.reverse(),
    }));
  };

  const updateStories = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
    }));
  };

  const updateFilters = (
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

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      activeFiltersCount: 0,
      filters: getExploreInitialState().filters,
      stories,
    }));
  };

  const applyFilters = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
    }));
  };

  const setActiveFiltersCount = (activeFiltersCount: number) => {
    setState((prev) => ({
      ...prev,
      activeFiltersCount,
    }));
  };

  return {
    state,
    isExploreFetching,
    updateStories,
    sortStories,
    toggleFiltersPanel,
    updateFilters,
    applyFilters,
    setActiveFiltersCount,
    clearFilters,
  };
};

export default useExploreStore;
