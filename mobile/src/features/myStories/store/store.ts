import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { useState } from "react";

import type { PagingInfo } from "src/shared/types/api";
import type { Story } from "src/features/storyCreator/store/state";

import {
  getMyStoriesInitialState,
  type MyStoriesInitialState,
  type MyStoriesStoryFilters,
} from "./state";

export interface MyStoriesStore {
  state: MyStoriesInitialState;
  isMyStoriesFetching: (isFetching: boolean) => void;
  setLoadError: (loadError: RequestErrorKind | null) => void;
  updateStories: (stories: Story[]) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePagingInfo: (pagingInfo: PagingInfo) => void;
  toggleFiltersPanel: (isOpen: boolean) => void;
  updateFilters: (
    key: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof key],
  ) => void;
  setActiveFiltersCount: (activeFiltersCount: number) => void;
  clearFilters: () => void;
}

export const useMyStoriesStore = (): MyStoriesStore => {
  const [state, setState] = useState<MyStoriesInitialState>(
    getMyStoriesInitialState(),
  );

  const isMyStoriesFetching = (isFetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching }));
  };

  const setLoadError = (loadError: RequestErrorKind | null) => {
    setState((prev) => ({ ...prev, loadError }));
  };

  const updateStories = (stories: Story[]) => {
    setState((prev) => ({ ...prev, stories }));
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

  const toggleFiltersPanel = (isFiltersPanelOpen: boolean) => {
    setState((prev) => ({ ...prev, isFiltersPanelOpen }));
  };

  const updateFilters = (
    key: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof key],
  ) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  };

  const setActiveFiltersCount = (activeFiltersCount: number) => {
    setState((prev) => ({ ...prev, activeFiltersCount }));
  };

  const clearFilters = () => {
    setState((prev) => ({
      ...prev,
      filters: getMyStoriesInitialState().filters,
      activeFiltersCount: 0,
    }));
  };

  return {
    state,
    isMyStoriesFetching,
    setLoadError,
    updateStories,
    updatePageNumber,
    updatePagingInfo,
    toggleFiltersPanel,
    updateFilters,
    setActiveFiltersCount,
    clearFilters,
  };
};
