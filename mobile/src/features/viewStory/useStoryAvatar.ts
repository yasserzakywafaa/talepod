import { useQuery } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { queryKeys } from "src/shared/api/queryKeys";
import type { Avatar } from "src/shared/types/avatar";

/** The saved character a story was generated from, shown beside the export card. */
export const useStoryAvatar = (avatarId?: string) => {
  const query = useQuery({
    queryKey: queryKeys.avatars.detail(avatarId ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Avatar>(END_POINTS.AVATARS.GET(avatarId!));
      return data;
    },
    enabled: Boolean(avatarId),
  });

  return {
    avatar: query.data ?? null,
    isLoading: Boolean(avatarId) && query.isPending,
  };
};
