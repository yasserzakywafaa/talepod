import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { DashboardOverviewStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardOverviewManager {
  setUp: () => Promise<void>;
  handleFetchUsersCount: () => Promise<void>;
  handleFetchStoriesCount: () => Promise<void>;
}

export const useDashboardOverviewManager = (
  store: DashboardOverviewStore
): DashboardOverviewManager => {
  const setUp = async () => {
    store.setIsFetching(true);

    try {
      await Promise.all([handleFetchUsersCount(), handleFetchStoriesCount()]);
    } catch (error) {
      console.error("Failed to fetch dashboard overview data:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleFetchUsersCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.OVERVIEW.GET_USERS_COUNT
      );
      store.setUsersCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to fetch users count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch users count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchStoriesCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.OVERVIEW.GET_STORIES_COUNT
      );
      store.setStoriesCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to fetch stories count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch stories count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleFetchUsersCount,
    handleFetchStoriesCount,
  };
};
