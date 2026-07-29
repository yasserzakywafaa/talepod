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
  updateStories: (stories: Story[]) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePagingInfo: (pagingInfo: PagingInfo) => void;
  clearFilters: () => void;
}

export const useMyStoriesStore = (): MyStoriesStore => {
  const [state, setState] = useState<MyStoriesInitialState>(
    getMyStoriesInitialState(),
  );

  const isMyStoriesFetching = (isFetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching }));
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
    updateStories,
    updatePageNumber,
    updatePagingInfo,
    clearFilters,
  };
};
