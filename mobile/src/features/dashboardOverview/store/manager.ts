import { useCallback, useMemo, useRef } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { dedupedGet } from "src/shared/api/dedupedGet";
import { logApiError } from "src/shared/api/logApiError";

import type { DashboardOverviewStore } from "./store";

export interface DashboardOverviewManager {
  setUp: () => Promise<void>;
}

export const useDashboardOverviewManager = (
  store: DashboardOverviewStore,
): DashboardOverviewManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const setUp = useCallback(async () => {
    storeRef.current.setIsFetching(true);
    try {
      const [storiesRes, usersRes] = await Promise.all([
        dedupedGet<{ count: number }>(
          END_POINTS.DASHBOARD.OVERVIEW.GET_STORIES_COUNT,
        ),
        dedupedGet<{ count: number }>(
          END_POINTS.DASHBOARD.OVERVIEW.GET_USERS_COUNT,
        ),
      ]);
      storeRef.current.setStoriesCount(storiesRes.data.count);
      storeRef.current.setUsersCount(usersRes.data.count);
    } catch (error) {
      logApiError("Failed to fetch dashboard overview counts", error);
      storeRef.current.setStoriesCount(null);
      storeRef.current.setUsersCount(null);
    } finally {
      storeRef.current.setIsFetching(false);
    }
  }, []);

  return useMemo(() => ({ setUp }), [setUp]);
};
