import { useCallback, useMemo, useRef } from "react";
import i18n from "src/i18n/init";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { logApiError } from "src/shared/api/logApiError";
import type { Story } from "src/features/storyCreator/store/state";
import type { ApiResponseWithPaging } from "src/shared/types/api";
import { getApiErrorMessage } from "src/features/dashboardShared/adminFeedback";

import { getDashboardStoriesInitialState } from "./state";
import type { DashboardStoriesStore } from "./store";

export interface DashboardStoriesManager {
  setUp: () => Promise<void>;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleDeleteStory: (storyId: string) => Promise<void>;
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

  const fetchStories = useCallback(async (pageNumber: number) => {
    storeRef.current.setIsFetching(true);

    const userId = userIdRef.current;

    try {
      const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
        userId
          ? END_POINTS.STORIES.GET_ALL_USER_STORIES
          : END_POINTS.DASHBOARD.STORIES.GET_ALL_STORIES,
        {
          params: userId
            ? {
                userId,
                pageNumber,
                pageSize: initialPaging.pageSize,
                hasActiveFilters: false,
                filters: JSON.stringify({
                  pageNumber,
                  pageSize: initialPaging.pageSize,
                }),
              }
            : { pageNumber, pageSize: initialPaging.pageSize },
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
    } catch (error) {
      logApiError("Failed to fetch dashboard stories", error);
      storeRef.current.setFeedback({
        message: getApiErrorMessage(
          error,
          i18n.t("dashboard:errors.loadStories"),
        ),
        variant: "error",
      });
    } finally {
      storeRef.current.setIsFetching(false);
    }
  }, []);

  const setUp = useCallback(async () => {
    await fetchStories(initialPaging.pageNumber);
  }, [fetchStories]);

  const handleGetStoriesByPage = useCallback(
    async (pageNumber: number) => {
      await fetchStories(pageNumber);
    },
    [fetchStories],
  );

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
      handleDismissFeedback,
    }),
    [setUp, handleGetStoriesByPage, handleDeleteStory, handleDismissFeedback],
  );
};
