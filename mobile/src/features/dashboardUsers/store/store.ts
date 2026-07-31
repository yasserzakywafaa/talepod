import { useState } from "react";

import type { PagingInfo } from "src/shared/types/api";
import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

import {
  getDashboardUsersInitialState,
  type DashboardUsersState,
} from "./state";

export interface DashboardUsersStore {
  state: DashboardUsersState;
  setIsFetching: (isFetching: boolean) => void;
  setIsMutating: (isMutating: boolean) => void;
  setUsers: (users: User[]) => void;
  /** Page two and beyond append, so the list grows instead of replacing. */
  appendUsers: (users: User[]) => void;
  setPaging: (paging: PagingInfo) => void;
  setFeedback: (feedback: AdminFeedback | null) => void;
}

export const useDashboardUsersStore = (): DashboardUsersStore => {
  const [state, setState] = useState<DashboardUsersState>(
    getDashboardUsersInitialState(),
  );

  const setIsFetching = (isFetching: boolean) =>
    setState((prev) => ({ ...prev, isFetching }));

  const setIsMutating = (isMutating: boolean) =>
    setState((prev) => ({ ...prev, isMutating }));

  const setUsers = (users: User[]) => setState((prev) => ({ ...prev, users }));

  const appendUsers = (users: User[]) =>
    setState((prev) => ({ ...prev, users: [...prev.users, ...users] }));

  const setPaging = (paging: PagingInfo) =>
    setState((prev) => ({ ...prev, paging }));

  const setFeedback = (feedback: AdminFeedback | null) =>
    setState((prev) => ({ ...prev, feedback }));

  return {
    state,
    setIsFetching,
    setIsMutating,
    setUsers,
    appendUsers,
    setPaging,
    setFeedback,
  };
};
