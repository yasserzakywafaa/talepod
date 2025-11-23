import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardStoriesStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";

export interface DashboardStoriesManager {
  setUp: () => Promise<void>;
  handleGetStoriesByPage: (
    pageNumber?: number,
    pageSize?: number
  ) => Promise<void>;
  handleDeleteStory: (storyId: string) => Promise<void>;
}

export const useDashboardStoriesManager = (
  store: DashboardStoriesStore
): DashboardStoriesManager => {
  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetStoriesByPage();
    } catch (error) {
      console.error("Failed to get all blogs:", error);
    }
  };

  const handleGetStoriesByPage = async (
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Story[]>> =
        await axios.get(END_POINTS.DASHBOARD.STORIES.GET_ALL_STORIES, {
          params: {
            pageNumber,
            pageSize,
          },
        });

      store.setStories(response.data.results as Story[]);
      store.setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount,
        totalPagesCount: response.data.paging.totalPagesCount,
      });
    } catch (error) {
      console.error("❌ Failed to get all stories:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch stories",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleDeleteStory = async (storyId: string): Promise<void> => {
    try {
      await axios.delete(END_POINTS.DASHBOARD.STORIES.DELETE_STORY(storyId));

      Notify({
        content: "Story deleted successfully",
        type: ToastTypes.Success,
      });

      // Refresh the blogs list
      await handleGetStoriesByPage();
    } catch (error) {
      console.error("❌ Failed to delete story:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete story",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetStoriesByPage,
    handleDeleteStory,
  };
};
