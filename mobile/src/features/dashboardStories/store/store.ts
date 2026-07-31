import { useState } from "react";

import type {
  StoryFilterKey,
  StoryFilterValue,
  StoryFilterValues,
} from "src/components/brand/StoryFiltersSheet";
import type { Story } from "src/features/storyCreator/store/state";
import type { PagingInfo } from "src/shared/types/api";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

import {
  getDashboardStoriesInitialFilters,
  getDashboardStoriesInitialState,
  type DashboardStoriesState,
} from "./state";

export interface DashboardStoriesStore {
  state: DashboardStoriesState;
  setIsFetching: (isFetching: boolean) => void;
  setIsMutating: (isMutating: boolean) => void;
  setStories: (stories: Story[]) => void;
  appendStories: (stories: Story[]) => void;
  setPaging: (paging: PagingInfo) => void;
  setFeedback: (feedback: AdminFeedback | null) => void;
  toggleFiltersPanel: (isOpen: boolean) => void;
  updateFilter: (key: StoryFilterKey, value: StoryFilterValue) => void;
  setActiveFiltersCount: (count: number) => void;
  clearFilters: () => StoryFilterValues;
}

export const useDashboardStoriesStore = (): DashboardStoriesStore => {
  const [state, setState] = useState<DashboardStoriesState>(
    getDashboardStoriesInitialState(),
  );

  const setIsFetching = (isFetching: boolean) =>
    setState((prev) => ({ ...prev, isFetching }));

  const setIsMutating = (isMutating: boolean) =>
    setState((prev) => ({ ...prev, isMutating }));

  const setStories = (stories: Story[]) =>
    setState((prev) => ({ ...prev, stories }));

  const appendStories = (stories: Story[]) =>
    setState((prev) => ({ ...prev, stories: [...prev.stories, ...stories] }));

  const setPaging = (paging: PagingInfo) =>
    setState((prev) => ({ ...prev, paging }));

  const setFeedback = (feedback: AdminFeedback | null) =>
    setState((prev) => ({ ...prev, feedback }));

  const toggleFiltersPanel = (isFiltersPanelOpen: boolean) =>
    setState((prev) => ({ ...prev, isFiltersPanelOpen }));

  const updateFilter = (key: StoryFilterKey, value: StoryFilterValue) =>
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));

  const setActiveFiltersCount = (activeFiltersCount: number) =>
    setState((prev) => ({ ...prev, activeFiltersCount }));

  /** Returns the reset values so the caller can refetch without a re-render. */
  const clearFilters = () => {
    const filters = getDashboardStoriesInitialFilters();
    setState((prev) => ({ ...prev, filters, activeFiltersCount: 0 }));
    return filters;
  };

  return {
    state,
    setIsFetching,
    setIsMutating,
    setStories,
    appendStories,
    setPaging,
    setFeedback,
    toggleFiltersPanel,
    updateFilter,
    setActiveFiltersCount,
    clearFilters,
  };
};
