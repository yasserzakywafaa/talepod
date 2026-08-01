import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import type { User, UserRole } from "src/shared/types/user";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";

const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await api.get<User>(
    END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(userId),
  );
  return normalizeUserFromApi(data);
};

const fetchStoriesCount = async (userId: string): Promise<number> => {
  const { data } = await api.get<{ count: number }>(
    END_POINTS.DASHBOARD.USERS.GET_USER_STORIES_COUNT(userId),
  );
  return data.count ?? 0;
};

/**
 * One admin-visible account and the actions that change it. Mutations
 * invalidate all admin data, since the list can block a user too.
 */
export const useDashboardUser = (userId: string) => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);

  const userQuery = useQuery({
    queryKey: queryKeys.admin.user(userId),
    queryFn: () => fetchUser(userId),
  });

  const storiesCountQuery = useQuery({
    queryKey: [...queryKeys.admin.user(userId), "storiesCount"],
    queryFn: () => fetchStoriesCount(userId),
  });

  useEffect(() => {
    if (!userQuery.isError || isServiceUnavailable(userQuery.error)) return;
    // Without this the screen falls through to "User Not Found", which is a
    // different — and wrong — thing to tell an admin.
    logApiError("Failed to fetch dashboard user", userQuery.error);
    setFeedback({
      message: getApiErrorMessage(
        userQuery.error,
        i18n.t("dashboard:errors.loadUser"),
      ),
      variant: "error",
    });
  }, [userQuery.isError, userQuery.error]);

  const invalidateAdmin = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });

  const updateRole = useMutation({
    mutationFn: (role: UserRole) =>
      api.put<{ message: string; user: User }>(
        END_POINTS.DASHBOARD.USERS.UPDATE_USER_ROLE(userId),
        { role },
      ),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        queryKeys.admin.user(userId),
        normalizeUserFromApi(data.user),
      );
      setFeedback({
        message: i18n.t("dashboard:toasts.userRoleUpdated"),
        variant: "success",
      });
      void invalidateAdmin();
    },
    onError: (error) => {
      logApiError("Failed to update user role", error);
      setFeedback({
        message: getApiErrorMessage(error, i18n.t("dashboard:errors.updateRole")),
        variant: "error",
      });
    },
  });

  /** Block and unblock both reload the user, so the status chip stays honest. */
  const runStatusChange = useMutation({
    mutationFn: async (input: {
      url: string;
      successKey: string;
      errorKey: string;
    }) => {
      await api.post(input.url);
      return input;
    },
    onSuccess: ({ successKey }) => {
      setFeedback({ message: i18n.t(successKey), variant: "success" });
      void invalidateAdmin();
    },
    onError: (error, { errorKey }) => {
      logApiError(errorKey, error);
      setFeedback({ message: getApiErrorMessage(error, i18n.t(errorKey)), variant: "error" });
    },
  });

  const blockUser = () =>
    runStatusChange.mutate({
      url: END_POINTS.DASHBOARD.USERS.BLOCK_USER(userId),
      successKey: "dashboard:toasts.userBlocked",
      errorKey: "dashboard:errors.blockUser",
    });

  const unblockUser = () =>
    runStatusChange.mutate({
      url: END_POINTS.DASHBOARD.USERS.UNBLOCK_USER(userId),
      successKey: "dashboard:toasts.userUnblocked",
      errorKey: "dashboard:errors.unblockUser",
    });

  const deleteUser = useMutation({
    mutationFn: () => api.delete(END_POINTS.DASHBOARD.USERS.DELETE_USER(userId)),
    onSuccess: () => void invalidateAdmin(),
    onError: (error) => {
      logApiError("Failed to delete user", error);
      setFeedback({
        message: getApiErrorMessage(error, i18n.t("dashboard:errors.deleteUser")),
        variant: "error",
      });
    },
  });

  const loadError: RequestErrorKind | null =
    userQuery.isError && !userQuery.data && isServiceUnavailable(userQuery.error)
      ? getRequestErrorKind(userQuery.error)
      : null;

  return {
    user: userQuery.data ?? null,
    storiesCount: storiesCountQuery.data ?? 0,
    isFetching: userQuery.isPending,
    loadError,
    retry: () => void userQuery.refetch(),

    updateUserRole: (role: UserRole) => updateRole.mutate(role),
    blockUser,
    unblockUser,
    /** Resolves true once the account is confirmed gone. */
    deleteUser: () => deleteUser.mutateAsync().then(() => true).catch(() => false),
    isMutating:
      updateRole.isPending || runStatusChange.isPending || deleteUser.isPending,

    feedback,
    dismissFeedback: () => setFeedback(null),
  };
};
