import { useState } from "react";

import type { Story } from "src/features/storyCreator/store/state";
import type { PagingInfo } from "src/shared/types/api";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

import {
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

  return {
    state,
    setIsFetching,
    setIsMutating,
    setStories,
    appendStories,
    setPaging,
    setFeedback,
  };
};
