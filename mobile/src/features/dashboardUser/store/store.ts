import { useState } from "react";

import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

import {
  getDashboardUserInitialState,
  type DashboardUserState,
} from "./state";

export interface DashboardUserStore {
  state: DashboardUserState;
  setIsFetching: (isFetching: boolean) => void;
  setIsMutating: (isMutating: boolean) => void;
  setUser: (user: User | null) => void;
  setStoriesCount: (storiesCount: number) => void;
  setFeedback: (feedback: AdminFeedback | null) => void;
}

export const useDashboardUserStore = (): DashboardUserStore => {
  const [state, setState] = useState<DashboardUserState>(
    getDashboardUserInitialState(),
  );

  const setIsFetching = (isFetching: boolean) =>
    setState((prev) => ({ ...prev, isFetching }));

  const setIsMutating = (isMutating: boolean) =>
    setState((prev) => ({ ...prev, isMutating }));

  const setUser = (user: User | null) => setState((prev) => ({ ...prev, user }));

  const setStoriesCount = (storiesCount: number) =>
    setState((prev) => ({ ...prev, storiesCount }));

  const setFeedback = (feedback: AdminFeedback | null) =>
    setState((prev) => ({ ...prev, feedback }));

  return {
    state,
    setIsFetching,
    setIsMutating,
    setUser,
    setStoriesCount,
    setFeedback,
  };
};
