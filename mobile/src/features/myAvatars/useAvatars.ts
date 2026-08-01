import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { getRequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { queryKeys } from "src/shared/api/queryKeys";
import type { Avatar, AvatarInput } from "src/shared/types/avatar";

/**
 * The saved-character list, shared by two very different screens: the avatar
 * picker inside story creation (read-only) and the My Avatars screen (full
 * CRUD). They used to be two separate hooks — `useAvatarsList` and
 * `useMyAvatars`, defined inline in `MyAvatarsScreen.tsx` — each with its own
 * `useState`/`useEffect` fetch and its own cache of one. Editing an avatar on
 * the management screen never reached the picker's copy; only a full remount
 * (leaving and re-entering the create flow) would refetch it.
 *
 * One query key means one cache: a mutation here invalidates
 * `queryKeys.avatars.list()`, and every consumer — picker included — updates
 * without an extra fetch.
 */
export const useAvatarsQuery = (enabled = true) => {
  const query = useQuery({
    queryKey: queryKeys.avatars.list(),
    queryFn: async () => {
      const { data } = await api.get<Avatar[]>(END_POINTS.AVATARS.LIST);
      return Array.isArray(data) ? data : [];
    },
    enabled,
  });

  return {
    avatars: query.data ?? [],
    isLoading: query.isPending && enabled,
    loadError: query.isError ? getRequestErrorKind(query.error) : null,
    refetch: () => void query.refetch(),
  };
};

export const useAvatarMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.avatars.list() });

  const save = useMutation({
    mutationFn: async ({
      input,
      existing,
    }: {
      input: AvatarInput;
      existing: Avatar | null;
    }) => {
      if (existing) {
        const { data } = await api.put<Avatar>(
          END_POINTS.AVATARS.UPDATE(existing._id),
          input,
        );
        return data;
      }
      const { data } = await api.post<Avatar>(END_POINTS.AVATARS.CREATE, input);
      return data;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (avatar: Avatar) => {
      await api.delete(END_POINTS.AVATARS.DELETE(avatar._id));
    },
    onSuccess: invalidate,
  });

  return {
    saveAvatar: (input: AvatarInput, existing: Avatar | null) =>
      save.mutateAsync({ input, existing }),
    removeAvatar: (avatar: Avatar) => remove.mutateAsync(avatar),
    isSaving: save.isPending || remove.isPending,
  };
};
