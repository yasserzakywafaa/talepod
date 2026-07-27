import {
  MyStoriesInitialState,
  MyStoriesStoryFilters,
  getMyStoriesInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface MyStoriesStore {
  state: MyStoriesInitialState;
  isMyStoriesFetching: (isFetching: boolean) => void;
  toggleFiltersPanel: (isFetching: boolean) => void;
  sortStories: () => void;
  updateStories: (stories: Story[]) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePagingInfo: (pagingInfo: PagingInfo) => void;
  updateFilters: (
    key: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof key]
  ) => void;
  clearFilters: () => void;
  applyFilters: (stories: Story[]) => void;
  setActiveFiltersCount: (activeFiltersCount: number) => void;
}

const useMyStoriesStore = (): MyStoriesStore => {
  const initialState = getMyStoriesInitialState();
  const [state, setState] = useState<MyStoriesInitialState>(initialState);
  const { stories } = state;

  const isMyStoriesFetching = (isFetching: boolean) => {
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
    key: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof key]
  ) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const updatePageNumber = (pageNumber: number) => {
    setState((prev) => ({
      ...prev,
      pagingInfo: {
        ...prev.pagingInfo,
        pageNumber,
      },
    }));
  };

  const updatePagingInfo = (pagingInfo: PagingInfo) => {
    setState((prev) => ({
      ...prev,
      pagingInfo,
    }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      activeFiltersCount: 0,
      filters: getMyStoriesInitialState().filters,
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
    isMyStoriesFetching,
    updateStories,
    sortStories,
    updatePageNumber,
    updatePagingInfo,
    toggleFiltersPanel,
    updateFilters,
    applyFilters,
    setActiveFiltersCount,
    clearFilters,
  };
};

export default useMyStoriesStore;
