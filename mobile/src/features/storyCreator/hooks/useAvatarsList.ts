import { useCallback, useEffect, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import type { Avatar } from "src/shared/types/avatar";
import { logApiError } from "src/shared/api/logApiError";
import {
  getRequestErrorKind,
  type RequestErrorKind,
} from "src/shared/api/getRequestErrorKind";

export const useAvatarsList = (enabled = true) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<RequestErrorKind | null>(null);

  const fetchAvatars = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Avatar[]>(END_POINTS.AVATARS.LIST);
      setAvatars(Array.isArray(data) ? data : []);
      setLoadError(null);
    } catch (error) {
      // `console.error` used to be the only signal, which in a dev build is a
      // red LogBox banner reading "AxiosError: Network Error" — meaningless to
      // a user and invisible in production. The picker now says so itself.
      logApiError("Failed to fetch avatars for the story creator", error);
      setAvatars([]);
      setLoadError(getRequestErrorKind(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void fetchAvatars();
    }
  }, [enabled, fetchAvatars]);

  return { avatars, isLoading, loadError, refetch: fetchAvatars };
};
