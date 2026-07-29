import { useCallback, useEffect, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import type { Avatar } from "src/shared/types/avatar";

export const useAvatarsList = (enabled = true) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvatars = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Avatar[]>(END_POINTS.AVATARS.LIST);
      setAvatars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load avatars", error);
      setAvatars([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void fetchAvatars();
    }
  }, [enabled, fetchAvatars]);

  return { avatars, isLoading, refetch: fetchAvatars };
};
