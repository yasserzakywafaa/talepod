import { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import i18n from "src/i18n/init";
import type { StoryFilterKey, StoryFilterValue, StoryFilterValues } from "src/components/brand/StoryFiltersSheet";
import type { Story } from "src/features/storyCreator/store/state";
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
import { countActiveFilters } from "src/shared/utils/countActiveFilters";

const emptyStoryFilters = (): StoryFilterValues => ({
  name: "",
  gender: "",
  age: [],
  language: [],
  moral: [],
  tone: [],
  environment: [],
  audio: undefined,
  createdByAdmin: undefined,
});

const PAGE_SIZE = 20;

const fetchStoriesPage = async (
  userId: string | undefined,
  filters: StoryFilterValues,
  pageNumber: number,
): Promise<ApiResponseWithPaging<Story[]>> => {
  const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
    // Scoped to a user this reuses the regular user-stories endpoint, as
    // the web does, rather than a second admin-only one.
    userId
      ? END_POINTS.STORIES.GET_ALL_USER_STORIES
      : END_POINTS.DASHBOARD.STORIES.GET_ALL_STORIES,
    {
      params: {
        ...(userId ? { userId } : {}),
        pageNumber,
        pageSize: PAGE_SIZE,
        hasActiveFilters: countActiveFilters(filters) > 0,
        filters: JSON.stringify({ ...filters, pageNumber, pageSize: PAGE_SIZE }),
      },
    },
  );
  return data;
};

/**
 * The admin story list, or one account's when `userId` is given. Same
 * filter split and cache-invalidation pattern as `useDashboardUsers`.
 */
export const useDashboardStories = (userId?: string) => {
  const queryClient = useQueryClient();
  const [draftFilters, setDraftFilters] = useState<StoryFilterValues>(
    emptyStoryFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<StoryFilterValues>(
    emptyStoryFilters,
  );
  const [isFiltersPanelOpen, setFiltersPanelOpen] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  const query = useInfiniteQuery({
    queryKey: userId
      ? queryKeys.admin.userStories(userId, appliedFilters)
      : queryKeys.admin.stories(appliedFilters),
    queryFn: ({ pageParam }) =>
      fetchStoriesPage(userId, appliedFilters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageNumber, totalPagesCount } = lastPage.paging;
      if (!totalPagesCount || pageNumber >= totalPagesCount) return undefined;
      return pageNumber + 1;
    },
  });

  const stories = useMemo(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );
  const totalCount = query.data?.pages[0]?.paging.totalCount ?? 0;

  useEffect(() => {
    if (!query.isError || isServiceUnavailable(query.error)) return;
    logApiError("Failed to fetch dashboard stories", query.error);
    setFeedback({
      message: getApiErrorMessage(
        query.error,
        i18n.t("dashboard:errors.loadStories"),
      ),
      variant: "error",
    });
  }, [query.isError, query.error]);

  const updateDraftFilter = useCallback(
    (key: StoryFilterKey, value: StoryFilterValue) => {
      setDraftFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setFiltersPanelOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const cleared = emptyStoryFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersPanelOpen(false);
  }, []);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const deleteStory = useMutation({
    mutationFn: (storyId: string) =>
      api.delete(END_POINTS.DASHBOARD.STORIES.DELETE_STORY(storyId)),
    onSuccess: () => {
      setFeedback({
        message: i18n.t("dashboard:toasts.storyDeleted"),
        variant: "success",
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });
    },
    onError: (error) => {
      logApiError("Failed to delete story", error);
      setFeedback({
        message: getApiErrorMessage(error, i18n.t("dashboard:errors.deleteStory")),
        variant: "error",
      });
    },
  });

  const loadError: RequestErrorKind | null =
    query.isError && stories.length === 0 && isServiceUnavailable(query.error)
      ? getRequestErrorKind(query.error)
      : null;

  return {
    stories,
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

    deleteStory: (storyId: string) => deleteStory.mutate(storyId),
    isMutating: deleteStory.isPending,

    feedback,
    dismissFeedback: () => setFeedback(null),
  };
};
