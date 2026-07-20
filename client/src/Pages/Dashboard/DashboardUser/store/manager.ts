import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { User, UserRole } from "src/shared/types/user";
import axios, { AxiosResponse } from "axios";

import { DashboardUserStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import i18n from "src/i18n/init";

export interface DashboardUserManager {
  setUp: (userId: string) => Promise<void>;
  handleGetUser: (userId: string) => Promise<void>;
  handleGetStoriesCount: (userId: string) => Promise<void>;
  handleUpdateUserRole: (userId: string, role: UserRole) => Promise<void>;
}

export const useDashboardUserManager = (
  store: DashboardUserStore
): DashboardUserManager => {
  const handleGetUser = async (userId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<User> = await axios.get(
        END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(userId)
      );

      store.setUser(response.data);
    } catch (error) {
      console.error("❌ Failed to get user:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch user",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleGetStoriesCount = async (userId: string): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.USERS.GET_USER_STORIES_COUNT(userId)
      );

      store.setStoriesCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to get user stories count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch stories count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    role: UserRole
  ): Promise<void> => {
    try {
      const response: AxiosResponse<{ message: string; user: User }> =
        await axios.put(END_POINTS.DASHBOARD.USERS.UPDATE_USER_ROLE(userId), {
          role,
        });

      store.setUser(response.data.user);

      Notify({
        content: i18n.t("dashboard:toasts.userRoleUpdated"),
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Failed to update user role:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to update user role",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const setUp = async (userId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      await Promise.all([handleGetUser(userId), handleGetStoriesCount(userId)]);
    } catch (error) {
      console.error("Failed to set up user page:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    handleGetUser,
    handleGetStoriesCount,
    handleUpdateUserRole,
  };
};
