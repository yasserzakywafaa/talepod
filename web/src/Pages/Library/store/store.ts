import {
  LibraryInitialState,
  LibraryStoriesSource,
  LibraryStoryFilters,
  getLibraryInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface LibraryStore {
  state: LibraryInitialState;
  isLibraryFetching: (isFetching: boolean) => void;
  toggleFiltersPanel: (isFetching: boolean) => void;
  sortStories: () => void;
  setStoriesSource: (storiesSource: LibraryStoriesSource) => void;
  updateStories: (stories: Story[]) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePagingInfo: (pagingInfo: PagingInfo) => void;
  updateFilters: (
    key: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof key],
  ) => void;
  clearFilters: () => void;
  applyFilters: (stories: Story[]) => void;
  setActiveFiltersCount: (activeFiltersCount: number) => void;
}

const useLibraryStore = (): LibraryStore => {
  const initialState = getLibraryInitialState();
  const [state, setState] = useState<LibraryInitialState>(initialState);
  const { stories } = state;

  const isLibraryFetching = (isFetching: boolean) => {
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

  const setStoriesSource = (storiesSource: LibraryStoriesSource) => {
    setState((prev) => ({
      ...prev,
      storiesSource,
    }));
  };

  const updateStories = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
    }));
  };

  const updateFilters = (
    key: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof key],
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
      filters: getLibraryInitialState().filters,
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
    isLibraryFetching,
    updateStories,
    sortStories,
    setStoriesSource,
    updatePageNumber,
    updatePagingInfo,
    toggleFiltersPanel,
    updateFilters,
    applyFilters,
    setActiveFiltersCount,
    clearFilters,
  };
};

export default useLibraryStore;
