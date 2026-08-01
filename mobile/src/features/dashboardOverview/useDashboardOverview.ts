import { useQuery } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { queryKeys } from "src/shared/api/queryKeys";

const fetchOverviewCounts = async (): Promise<{
  storiesCount: number | null;
  usersCount: number | null;
}> => {
  // Each counter degrades to `null` on its own, rather than one rejected
  // Promise.all taking both cards down.
  const [storiesResult, usersResult] = await Promise.allSettled([
    api.get<{ count: number }>(END_POINTS.DASHBOARD.OVERVIEW.GET_STORIES_COUNT),
    api.get<{ count: number }>(END_POINTS.DASHBOARD.OVERVIEW.GET_USERS_COUNT),
  ]);

  return {
    storiesCount:
      storiesResult.status === "fulfilled" ? storiesResult.value.data.count : null,
    usersCount:
      usersResult.status === "fulfilled" ? usersResult.value.data.count : null,
  };
};

export const useDashboardOverview = () => {
  const query = useQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: fetchOverviewCounts,
  });

  return {
    storiesCount: query.data?.storiesCount ?? null,
    usersCount: query.data?.usersCount ?? null,
    isFetching: query.isPending,
  };
};
