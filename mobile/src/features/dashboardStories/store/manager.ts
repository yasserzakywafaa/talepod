import { useCallback, useMemo, useRef } from "react";
import i18n from "src/i18n/init";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { logApiError } from "src/shared/api/logApiError";
import type {
  StoryFilterKey,
  StoryFilterValue,
  StoryFilterValues,
} from "src/components/brand/StoryFiltersSheet";
import type { Story } from "src/features/storyCreator/store/state";
import type { ApiResponseWithPaging } from "src/shared/types/api";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";
import { getApiErrorMessage } from "src/features/dashboardShared/adminFeedback";
import {
  getRequestErrorKind,
  isServiceUnavailable,
} from "src/shared/api/getRequestErrorKind";

import { getDashboardStoriesInitialState } from "./state";
import type { DashboardStoriesStore } from "./store";

export interface DashboardStoriesManager {
  setUp: () => Promise<void>;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleDeleteStory: (storyId: string) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilter: (key: StoryFilterKey, value: StoryFilterValue) => void;
  handleApplyFilters: () => Promise<void>;
  handleClearFilters: () => Promise<void>;
  handleDismissFeedback: () => void;
}

const { paging: initialPaging } = getDashboardStoriesInitialState();

export interface DashboardStoriesScope {
  /**
   * When set, the list is one person's stories rather than the whole platform
   * — the web does the same on `/dashboard/users/:userId/stories`, reusing the
   * regular user-stories endpoint instead of a second admin one.
   */
  userId?: string;
}

export const useDashboardStoriesManager = (
  store: DashboardStoriesStore,
  scope: DashboardStoriesScope = {},
): DashboardStoriesManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const userIdRef = useRef(scope.userId);
  userIdRef.current = scope.userId;

  const fetchStories = useCallback(
    async (pageNumber: number, filters?: StoryFilterValues) => {
      storeRef.current.setIsFetching(true);

      const userId = userIdRef.current;
      const activeFilters = filters ?? storeRef.current.state.filters;
      const hasActiveFilters = countActiveFilters(activeFilters) > 0;

      try {
        const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
          userId
            ? END_POINTS.STORIES.GET_ALL_USER_STORIES
            : END_POINTS.DASHBOARD.STORIES.GET_ALL_STORIES,
          {
            params: {
              // Both endpoints read the same filter envelope; the admin one
              // only differs in not being scoped to an author.
              ...(userId ? { userId } : {}),
              pageNumber,
              pageSize: initialPaging.pageSize,
              hasActiveFilters,
              filters: JSON.stringify({
                ...activeFilters,
                pageNumber,
                pageSize: initialPaging.pageSize,
              }),
            },
          },
        );

        const stories = data.results ?? [];
        if (pageNumber > 1) {
          storeRef.current.appendStories(stories);
        } else {
          storeRef.current.setStories(stories);
        }

        storeRef.current.setPaging({
          pageNumber: data.paging?.pageNumber ?? pageNumber,
          pageSize: initialPaging.pageSize,
          totalCount: data.paging?.totalCount ?? 0,
          totalPagesCount: data.paging?.totalPagesCount,
        });
        storeRef.current.setLoadError(null);
      } catch (error) {
        logApiError("Failed to fetch dashboard stories", error);

        // An unreachable API replaces the list with an explanation; anything
        // else is a passing problem and stays a toast over what is on screen.
        if (isServiceUnavailable(error)) {
          storeRef.current.setLoadError(getRequestErrorKind(error));
        } else {
          storeRef.current.setFeedback({
            message: getApiErrorMessage(
              error,
              i18n.t("dashboard:errors.loadStories"),
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
    await fetchStories(initialPaging.pageNumber);
  }, [fetchStories]);

  const handleGetStoriesByPage = useCallback(
    async (pageNumber: number) => {
      await fetchStories(pageNumber);
    },
    [fetchStories],
  );

  const handleToggleFiltersPanel = useCallback((isOpen: boolean) => {
    storeRef.current.toggleFiltersPanel(isOpen);
  }, []);

  const handleUpdateFilter = useCallback(
    (key: StoryFilterKey, value: StoryFilterValue) => {
      storeRef.current.updateFilter(key, value);
    },
    [],
  );

  const handleApplyFilters = useCallback(async () => {
    const filters = storeRef.current.state.filters;
    storeRef.current.setActiveFiltersCount(countActiveFilters(filters));
    storeRef.current.toggleFiltersPanel(false);
    await fetchStories(initialPaging.pageNumber, filters);
  }, [fetchStories]);

  const handleClearFilters = useCallback(async () => {
    const filters = storeRef.current.clearFilters();
    storeRef.current.toggleFiltersPanel(false);
    await fetchStories(initialPaging.pageNumber, filters);
  }, [fetchStories]);

  const handleDeleteStory = useCallback(
    async (storyId: string) => {
      storeRef.current.setIsMutating(true);

      try {
        await api.delete(END_POINTS.DASHBOARD.STORIES.DELETE_STORY(storyId));
        storeRef.current.setFeedback({
          message: i18n.t("dashboard:toasts.storyDeleted"),
          variant: "success",
        });
        await fetchStories(initialPaging.pageNumber);
      } catch (error) {
        logApiError("Failed to delete story", error);
        storeRef.current.setFeedback({
          message: getApiErrorMessage(
            error,
            i18n.t("dashboard:errors.deleteStory"),
          ),
          variant: "error",
        });
      } finally {
        storeRef.current.setIsMutating(false);
      }
    },
    [fetchStories],
  );

  const handleDismissFeedback = useCallback(() => {
    storeRef.current.setFeedback(null);
  }, []);

  return useMemo(
    () => ({
      setUp,
      handleGetStoriesByPage,
      handleDeleteStory,
      handleToggleFiltersPanel,
      handleUpdateFilter,
      handleApplyFilters,
      handleClearFilters,
      handleDismissFeedback,
    }),
    [
      setUp,
      handleGetStoriesByPage,
      handleDeleteStory,
      handleToggleFiltersPanel,
      handleUpdateFilter,
      handleApplyFilters,
      handleClearFilters,
      handleDismissFeedback,
    ],
  );
};
