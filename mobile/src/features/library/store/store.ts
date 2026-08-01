import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { useState } from "react";

import type { PagingInfo } from "src/shared/types/api";
import type { Story } from "src/features/storyCreator/store/state";

import {
  getLibraryInitialState,
  type LibraryInitialState,
  type LibraryStoriesSource,
  type LibraryStoryFilters,
} from "./state";

export interface LibraryStore {
  state: LibraryInitialState;
  isLibraryFetching: (isFetching: boolean) => void;
  setLoadError: (loadError: RequestErrorKind | null) => void;
  toggleFiltersPanel: (isOpen: boolean) => void;
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
  setActiveFiltersCount: (activeFiltersCount: number) => void;
}

export const useLibraryStore = (): LibraryStore => {
  const initialState = getLibraryInitialState();
  const [state, setState] = useState<LibraryInitialState>(initialState);
  const { stories } = state;

  const isLibraryFetching = (isFetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching }));
  };

  const setLoadError = (loadError: RequestErrorKind | null) => {
    setState((prev) => ({ ...prev, loadError }));
  };

  const toggleFiltersPanel = (isFiltersPanelOpen: boolean) => {
    setState((prev) => ({ ...prev, isFiltersPanelOpen }));
  };

  const sortStories = () => {
    setState((prev) => ({ ...prev, stories: [...stories].reverse() }));
  };

  const setStoriesSource = (storiesSource: LibraryStoriesSource) => {
    setState((prev) => ({ ...prev, storiesSource }));
  };

  const updateStories = (nextStories: Story[]) => {
    setState((prev) => ({ ...prev, stories: nextStories }));
  };

  const updateFilters = (
    key: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof key],
  ) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  };

  const updatePageNumber = (pageNumber: number) => {
    setState((prev) => ({
      ...prev,
      pagingInfo: { ...prev.pagingInfo, pageNumber },
    }));
  };

  const updatePagingInfo = (pagingInfo: PagingInfo) => {
    setState((prev) => ({ ...prev, pagingInfo }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      activeFiltersCount: 0,
      filters: getLibraryInitialState().filters,
    }));
  };

  const setActiveFiltersCount = (activeFiltersCount: number) => {
    setState((prev) => ({ ...prev, activeFiltersCount }));
  };

  return {
    state,
    isLibraryFetching,
    setLoadError,
    updateStories,
    sortStories,
    setStoriesSource,
    updatePageNumber,
    updatePagingInfo,
    toggleFiltersPanel,
    updateFilters,
    setActiveFiltersCount,
    clearFilters,
  };
};
