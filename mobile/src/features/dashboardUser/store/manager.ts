import { useCallback, useMemo, useRef } from "react";
import i18n from "src/i18n/init";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { logApiError } from "src/shared/api/logApiError";
import type { User, UserRole } from "src/shared/types/user";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";
import { getApiErrorMessage } from "src/features/dashboardShared/adminFeedback";
import {
  getRequestErrorKind,
  isServiceUnavailable,
} from "src/shared/api/getRequestErrorKind";

import type { DashboardUserStore } from "./store";

export interface DashboardUserManager {
  setUp: (userId: string) => Promise<void>;
  handleUpdateUserRole: (userId: string, role: UserRole) => Promise<void>;
  handleBlockUser: (userId: string) => Promise<void>;
  handleUnblockUser: (userId: string) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<boolean>;
  handleDismissFeedback: () => void;
}

/** Port of the web's `useDashboardUserManager`, plus block/unblock. */
export const useDashboardUserManager = (
  store: DashboardUserStore,
): DashboardUserManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const fetchUser = useCallback(async (userId: string) => {
    const { data } = await api.get<User>(
      END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(userId),
    );
    storeRef.current.setUser(normalizeUserFromApi(data));
  }, []);

  const fetchStoriesCount = useCallback(async (userId: string) => {
    const { data } = await api.get<{ count: number }>(
      END_POINTS.DASHBOARD.USERS.GET_USER_STORIES_COUNT(userId),
    );
    storeRef.current.setStoriesCount(data.count ?? 0);
  }, []);

  const setUp = useCallback(
    async (userId: string) => {
      storeRef.current.setIsFetching(true);

      try {
        await Promise.all([fetchUser(userId), fetchStoriesCount(userId)]);
        storeRef.current.setLoadError(null);
      } catch (error) {
        logApiError("Failed to fetch dashboard user", error);

        // Without this the screen falls through to "User Not Found", which is
        // a different — and wrong — thing to tell an admin.
        if (isServiceUnavailable(error)) {
          storeRef.current.setLoadError(getRequestErrorKind(error));
        } else {
          storeRef.current.setFeedback({
            message: getApiErrorMessage(
              error,
              i18n.t("dashboard:errors.loadUser"),
            ),
            variant: "error",
          });
        }
      } finally {
        storeRef.current.setIsFetching(false);
      }
    },
    [fetchUser, fetchStoriesCount],
  );

  const handleUpdateUserRole = useCallback(
    async (userId: string, role: UserRole) => {
      storeRef.current.setIsMutating(true);

      try {
        const { data } = await api.put<{ message: string; user: User }>(
          END_POINTS.DASHBOARD.USERS.UPDATE_USER_ROLE(userId),
          { role },
        );
        storeRef.current.setUser(normalizeUserFromApi(data.user));
        storeRef.current.setFeedback({
          message: i18n.t("dashboard:toasts.userRoleUpdated"),
          variant: "success",
        });
      } catch (error) {
        logApiError("Failed to update user role", error);
        storeRef.current.setFeedback({
          message: getApiErrorMessage(
            error,
            i18n.t("dashboard:errors.updateRole"),
          ),
          variant: "error",
        });
      } finally {
        storeRef.current.setIsMutating(false);
      }
    },
    [],
  );

  /** Block and unblock both reload the user, so the status chip stays honest. */
  const runStatusChange = useCallback(
    async (userId: string, url: string, successKey: string, errorKey: string) => {
      storeRef.current.setIsMutating(true);

      try {
        await api.post(url);
        await fetchUser(userId);
        storeRef.current.setFeedback({
          message: i18n.t(successKey),
          variant: "success",
        });
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
    [fetchUser],
  );

  const handleBlockUser = useCallback(
    (userId: string) =>
      runStatusChange(
        userId,
        END_POINTS.DASHBOARD.USERS.BLOCK_USER(userId),
        "dashboard:toasts.userBlocked",
        "dashboard:errors.blockUser",
      ),
    [runStatusChange],
  );

  const handleUnblockUser = useCallback(
    (userId: string) =>
      runStatusChange(
        userId,
        END_POINTS.DASHBOARD.USERS.UNBLOCK_USER(userId),
        "dashboard:toasts.userUnblocked",
        "dashboard:errors.unblockUser",
      ),
    [runStatusChange],
  );

  /**
   * Resolves true when the account is gone, so the screen knows to pop back to
   * the list rather than sit on a user that no longer exists.
   */
  const handleDeleteUser = useCallback(async (userId: string) => {
    storeRef.current.setIsMutating(true);

    try {
      await api.delete(END_POINTS.DASHBOARD.USERS.DELETE_USER(userId));
      return true;
    } catch (error) {
      logApiError("Failed to delete user", error);
      storeRef.current.setFeedback({
        message: getApiErrorMessage(
          error,
          i18n.t("dashboard:errors.deleteUser"),
        ),
        variant: "error",
      });
      return false;
    } finally {
      storeRef.current.setIsMutating(false);
    }
  }, []);

  const handleDismissFeedback = useCallback(() => {
    storeRef.current.setFeedback(null);
  }, []);

  return useMemo(
    () => ({
      setUp,
      handleUpdateUserRole,
      handleBlockUser,
      handleUnblockUser,
      handleDeleteUser,
      handleDismissFeedback,
    }),
    [
      setUp,
      handleUpdateUserRole,
      handleBlockUser,
      handleUnblockUser,
      handleDeleteUser,
      handleDismissFeedback,
    ],
  );
};
