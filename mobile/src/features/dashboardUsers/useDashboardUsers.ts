import { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import i18n from "src/i18n/init";
import { getApiErrorMessage } from "src/features/dashboardShared/adminFeedback";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";
import { logApiError } from "src/shared/api/logApiError";
import {
  getRequestErrorKind,
  isServiceUnavailable,
  type RequestErrorKind,
} from "src/shared/api/getRequestErrorKind";
import { queryKeys } from "src/shared/api/queryKeys";
import type { ApiResponseWithPaging } from "src/shared/types/api";
import type { User, UserRole, UserStatus } from "src/shared/types/user";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";

export interface DashboardUsersFilters {
  search: string;
  role: UserRole | "";
  status: UserStatus | "";
}

export const emptyDashboardUsersFilters = (): DashboardUsersFilters => ({
  search: "",
  role: "",
  status: "",
});

const PAGE_SIZE = 20;

const fetchUsersPage = async (
  filters: DashboardUsersFilters,
  pageNumber: number,
): Promise<ApiResponseWithPaging<User[]>> => {
  const { data } = await api.get<ApiResponseWithPaging<User[]>>(
    END_POINTS.DASHBOARD.USERS.GET_ALL_USERS,
    {
      params: {
        pageNumber,
        pageSize: PAGE_SIZE,
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
      },
    },
  );
  return { ...data, results: (data.results ?? []).map(normalizeUserFromApi) };
};

/**
 * The admin user list, plus the row actions (block, unblock, delete) that act
 * on it.
 *
 * Each mutation invalidates `queryKeys.admin.all` rather than just the users
 * list: deleting a user also changes the overview counts and, if this admin
 * is on that user's detail screen when it happens, that query too. The old
 * version handled only the second half of that (`setUp()` after every
 * mutation) and needed a `useFocusEffect` on the list screen to catch changes
 * made from the detail screen — a shared cache key makes that manual refetch
 * unnecessary, so it is not carried over.
 *
 * Feedback (the toast on a completed action) is intentionally still local
 * `useState`, not query state — it belongs to how the screen reports outcomes
 * to the admin, not to the data itself.
 */
export const useDashboardUsers = () => {
  const queryClient = useQueryClient();
  const [draftFilters, setDraftFilters] = useState<DashboardUsersFilters>(
    emptyDashboardUsersFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<DashboardUsersFilters>(
    emptyDashboardUsersFilters,
  );
  const [isFiltersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  const query = useInfiniteQuery({
    queryKey: queryKeys.admin.users(appliedFilters),
    queryFn: ({ pageParam }) => fetchUsersPage(appliedFilters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageNumber, totalPagesCount } = lastPage.paging;
      if (!totalPagesCount || pageNumber >= totalPagesCount) return undefined;
      return pageNumber + 1;
    },
  });

  const users = useMemo(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );
  const totalCount = query.data?.pages[0]?.paging.totalCount ?? 0;

  const updateDraftFilter = useCallback(
    <K extends keyof DashboardUsersFilters>(
      key: K,
      value: DashboardUsersFilters[K],
    ) => {
      setDraftFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setFiltersPanelOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const cleared = emptyDashboardUsersFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersPanelOpen(false);
  }, []);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const runRowAction = useMutation({
    mutationFn: async (input: {
      request: () => Promise<unknown>;
      successKey: string;
      errorKey: string;
    }) => {
      await input.request();
      return input;
    },
    onSuccess: ({ successKey }) => {
      setFeedback({ message: i18n.t(successKey), variant: "success" });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
    onError: (error, { errorKey }) => {
      logApiError(errorKey, error);
      setFeedback({
        message: getApiErrorMessage(error, i18n.t(errorKey)),
        variant: "error",
      });
    },
  });

  const blockUser = (userId: string) =>
    runRowAction.mutate({
      request: () => api.post(END_POINTS.DASHBOARD.USERS.BLOCK_USER(userId)),
      successKey: "dashboard:toasts.userBlocked",
      errorKey: "dashboard:errors.blockUser",
    });

  const unblockUser = (userId: string) =>
    runRowAction.mutate({
      request: () => api.post(END_POINTS.DASHBOARD.USERS.UNBLOCK_USER(userId)),
      successKey: "dashboard:toasts.userUnblocked",
      errorKey: "dashboard:errors.unblockUser",
    });

  const deleteUser = (userId: string) =>
    runRowAction.mutate({
      request: () => api.delete(END_POINTS.DASHBOARD.USERS.DELETE_USER(userId)),
      successKey: "dashboard:toasts.userDeleted",
      errorKey: "dashboard:errors.deleteUser",
    });

  const loadError: RequestErrorKind | null =
    query.isError && users.length === 0 && isServiceUnavailable(query.error)
      ? getRequestErrorKind(query.error)
      : null;

  /**
   * React Query v5 dropped onError from useQuery/useInfiniteQuery — side
   * effects for query failures go through an effect instead. Only a
   * non-blocking failure gets a toast; an unreachable API is handled by
   * `loadError` taking over the whole screen instead.
   */
  useEffect(() => {
    if (!query.isError || isServiceUnavailable(query.error)) return;
    logApiError("dashboard:errors.loadUsers", query.error);
    setFeedback({
      message: getApiErrorMessage(
        query.error,
        i18n.t("dashboard:errors.loadUsers"),
      ),
      variant: "error",
    });
  }, [query.isError, query.error]);

  return {
    users,
    totalCount,
    isFetching: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    loadError,
    loadMore,
    retry: () => void query.refetch(),

    draftFilters,
    updateDraftFilter,
    applyFilters,
    clearFilters,
    activeFiltersCount: countActiveFilters(appliedFilters),
    isFiltersPanelOpen,
    setFiltersPanelOpen,

    blockUser,
    unblockUser,
    deleteUser,
    isMutating: runRowAction.isPending,

    feedback,
    dismissFeedback: () => setFeedback(null),
  };
};
