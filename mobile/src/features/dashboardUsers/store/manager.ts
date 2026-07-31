import { useCallback, useMemo, useRef } from "react";
import i18n from "src/i18n/init";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { logApiError } from "src/shared/api/logApiError";
import type { ApiResponseWithPaging } from "src/shared/types/api";
import type { User } from "src/shared/types/user";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";
import { getApiErrorMessage } from "src/features/dashboardShared/adminFeedback";
import {
  getRequestErrorKind,
  isServiceUnavailable,
} from "src/shared/api/getRequestErrorKind";

import {
  getDashboardUsersInitialState,
  type DashboardUsersFilters,
} from "./state";
import type { DashboardUsersStore } from "./store";

export interface DashboardUsersManager {
  setUp: () => Promise<void>;
  handleGetUsersByPage: (pageNumber: number) => Promise<void>;
  handleBlockUser: (userId: string) => Promise<void>;
  handleUnblockUser: (userId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilter: <Key extends keyof DashboardUsersFilters>(
    key: Key,
    value: DashboardUsersFilters[Key],
  ) => void;
  handleApplyFilters: () => Promise<void>;
  handleClearFilters: () => Promise<void>;
  handleDismissFeedback: () => void;
}

const { paging: initialPaging } = getDashboardUsersInitialState();

/**
 * Read-and-moderate port of the web's `useDashboardUsersManager`.
 *
 * Two differences, both because this runs on a phone: pages append rather than
 * replace, and the list can be filtered — walking to page 100 with a thumb is
 * not a search strategy.
 */
export const useDashboardUsersManager = (
  store: DashboardUsersStore,
): DashboardUsersManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const fetchUsers = useCallback(
    async (pageNumber: number, filters?: DashboardUsersFilters) => {
      storeRef.current.setIsFetching(true);
      const active = filters ?? storeRef.current.state.filters;

      try {
        const { data } = await api.get<ApiResponseWithPaging<User[]>>(
          END_POINTS.DASHBOARD.USERS.GET_ALL_USERS,
          {
            params: {
              pageNumber,
              pageSize: initialPaging.pageSize,
              search: active.search || undefined,
              role: active.role || undefined,
              status: active.status || undefined,
            },
          },
        );

        const users = (data.results ?? []).map(normalizeUserFromApi);
        if (pageNumber > 1) {
          storeRef.current.appendUsers(users);
        } else {
          storeRef.current.setUsers(users);
        }

        storeRef.current.setPaging({
          pageNumber: data.paging?.pageNumber ?? pageNumber,
          pageSize: initialPaging.pageSize,
          totalCount: data.paging?.totalCount ?? 0,
          totalPagesCount: data.paging?.totalPagesCount,
        });
        storeRef.current.setLoadError(null);
      } catch (error) {
        logApiError("Failed to fetch dashboard users", error);

        // An unreachable API replaces the list with an explanation; anything
        // else is a passing problem and stays a toast over what is on screen.
        if (isServiceUnavailable(error)) {
          storeRef.current.setLoadError(getRequestErrorKind(error));
        } else {
          storeRef.current.setFeedback({
            message: getApiErrorMessage(
              error,
              i18n.t("dashboard:errors.loadUsers"),
            ),
            variant: "error",
          });
        }
      } finally {
        storeRef.current.setIsFetching(false);
      }
    },
    [],
  );

  const setUp = useCallback(async () => {
    await fetchUsers(initialPaging.pageNumber);
  }, [fetchUsers]);

  const handleGetUsersByPage = useCallback(
    async (pageNumber: number) => {
      await fetchUsers(pageNumber);
    },
    [fetchUsers],
  );

  const handleToggleFiltersPanel = useCallback((isOpen: boolean) => {
    storeRef.current.toggleFiltersPanel(isOpen);
  }, []);

  const handleUpdateFilter = useCallback(
    <Key extends keyof DashboardUsersFilters>(
      key: Key,
      value: DashboardUsersFilters[Key],
    ) => {
      storeRef.current.updateFilter(key, value);
    },
    [],
  );

  const handleApplyFilters = useCallback(async () => {
    const filters = storeRef.current.state.filters;
    storeRef.current.setActiveFiltersCount(countActiveFilters(filters));
    storeRef.current.toggleFiltersPanel(false);
    await fetchUsers(initialPaging.pageNumber, filters);
  }, [fetchUsers]);

  const handleClearFilters = useCallback(async () => {
    const filters = storeRef.current.clearFilters();
    storeRef.current.toggleFiltersPanel(false);
    await fetchUsers(initialPaging.pageNumber, filters);
  }, [fetchUsers]);

  /**
   * Every mutation reloads from page one rather than patching the row: the
   * list is ordered and paged server-side, so a local edit would drift.
   */
  const runMutation = useCallback(
    async (
      request: () => Promise<unknown>,
      successKey: string,
      errorKey: string,
    ) => {
      storeRef.current.setIsMutating(true);

      try {
        await request();
        storeRef.current.setFeedback({
          message: i18n.t(successKey),
          variant: "success",
        });
        await fetchUsers(initialPaging.pageNumber);
      } catch (error) {
        logApiError(errorKey, error);
        storeRef.current.setFeedback({
          message: getApiErrorMessage(error, i18n.t(errorKey)),
          variant: "error",
        });
      } finally {
        storeRef.current.setIsMutating(false);
      }
    },
    [fetchUsers],
  );

  const handleBlockUser = useCallback(
    (userId: string) =>
      runMutation(
        () => api.post(END_POINTS.DASHBOARD.USERS.BLOCK_USER(userId)),
        "dashboard:toasts.userBlocked",
        "dashboard:errors.blockUser",
      ),
    [runMutation],
  );

  const handleUnblockUser = useCallback(
    (userId: string) =>
      runMutation(
        () => api.post(END_POINTS.DASHBOARD.USERS.UNBLOCK_USER(userId)),
        "dashboard:toasts.userUnblocked",
        "dashboard:errors.unblockUser",
      ),
    [runMutation],
  );

  const handleDeleteUser = useCallback(
    (userId: string) =>
      runMutation(
        () => api.delete(END_POINTS.DASHBOARD.USERS.DELETE_USER(userId)),
        "dashboard:toasts.userDeleted",
        "dashboard:errors.deleteUser",
      ),
    [runMutation],
  );

  const handleDismissFeedback = useCallback(() => {
    storeRef.current.setFeedback(null);
  }, []);

  return useMemo(
    () => ({
      setUp,
      handleGetUsersByPage,
      handleBlockUser,
      handleUnblockUser,
      handleDeleteUser,
      handleToggleFiltersPanel,
      handleUpdateFilter,
      handleApplyFilters,
      handleClearFilters,
      handleDismissFeedback,
    }),
    [
      setUp,
      handleGetUsersByPage,
      handleBlockUser,
      handleUnblockUser,
      handleDeleteUser,
      handleToggleFiltersPanel,
      handleUpdateFilter,
      handleApplyFilters,
      handleClearFilters,
      handleDismissFeedback,
    ],
  );
};
