import { Avatar, AvatarInput } from "src/shared/types/avatar";
import { useCallback, useEffect, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";

/**
 * CRUD hook for the user's saved avatars. Auth is cookie-based
 * (axios sends credentials globally), so all calls are user-scoped server-side.
 * Portraits are generated server-side in the background; `refetch` (e.g. on a
 * short delay after a mutation) surfaces them once ready.
 */
export const useAvatars = (enabled = true) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvatars = useCallback(async (): Promise<Avatar[]> => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<Avatar[]>(END_POINTS.AVATARS.LIST);
      const list = Array.isArray(data) ? data : [];
      setAvatars(list);
      return list;
    } catch (error) {
      console.error("❌ Failed to load avatars", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) fetchAvatars();
  }, [enabled, fetchAvatars]);

  const createAvatar = useCallback(async (input: AvatarInput) => {
    setIsSaving(true);
    try {
      const { data } = await axios.post<Avatar>(
        END_POINTS.AVATARS.CREATE,
        input,
      );
      setAvatars((prev) => [data, ...prev]);
      return data;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateAvatar = useCallback(
    async (avatarId: string, input: AvatarInput) => {
      setIsSaving(true);
      try {
        const { data } = await axios.put<Avatar>(
          END_POINTS.AVATARS.UPDATE(avatarId),
          input,
        );
        setAvatars((prev) =>
          prev.map((avatar) => (avatar._id === avatarId ? data : avatar)),
        );
        return data;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteAvatar = useCallback(async (avatarId: string) => {
    await axios.delete(END_POINTS.AVATARS.DELETE(avatarId));
    setAvatars((prev) => prev.filter((avatar) => avatar._id !== avatarId));
  }, []);

  return {
    avatars,
    isLoading,
    isSaving,
    fetchAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar,
  };
};
