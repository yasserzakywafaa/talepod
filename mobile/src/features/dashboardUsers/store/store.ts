import { useState } from "react";

import type { PagingInfo } from "src/shared/types/api";
import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

import {
  getDashboardUsersInitialFilters,
  getDashboardUsersInitialState,
  type DashboardUsersFilters,
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
  setLoadError: (loadError: RequestErrorKind | null) => void;
  toggleFiltersPanel: (isOpen: boolean) => void;
  updateFilter: <Key extends keyof DashboardUsersFilters>(
    key: Key,
    value: DashboardUsersFilters[Key],
  ) => void;
  setActiveFiltersCount: (count: number) => void;
  clearFilters: () => DashboardUsersFilters;
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

  const setLoadError = (loadError: RequestErrorKind | null) =>
    setState((prev) => ({ ...prev, loadError }));

  const toggleFiltersPanel = (isFiltersPanelOpen: boolean) =>
    setState((prev) => ({ ...prev, isFiltersPanelOpen }));

  const updateFilter = <Key extends keyof DashboardUsersFilters>(
    key: Key,
    value: DashboardUsersFilters[Key],
  ) =>
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));

  const setActiveFiltersCount = (activeFiltersCount: number) =>
    setState((prev) => ({ ...prev, activeFiltersCount }));

  /** Returns the reset values so the caller can refetch without a re-render. */
  const clearFilters = () => {
    const filters = getDashboardUsersInitialFilters();
    setState((prev) => ({ ...prev, filters, activeFiltersCount: 0 }));
    return filters;
  };

  return {
    state,
    setIsFetching,
    setIsMutating,
    setUsers,
    appendUsers,
    setPaging,
    setFeedback,
    setLoadError,
    toggleFiltersPanel,
    updateFilter,
    setActiveFiltersCount,
    clearFilters,
  };
};
