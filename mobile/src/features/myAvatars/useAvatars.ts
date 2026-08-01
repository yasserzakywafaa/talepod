import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { getRequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { queryKeys } from "src/shared/api/queryKeys";
import type { Avatar, AvatarInput } from "src/shared/types/avatar";

/**
 * The saved-character list, shared by the story-creator picker and the My
 * Avatars screen. One query key means an edit on either reaches both.
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

/**
 * Traits that change how the avatar is drawn, so a name-only edit skips the
 * portrait wait. Mirrors the server's `AVATAR_APPEARANCE_FIELDS`.
 */
const AVATAR_APPEARANCE_FIELDS: (keyof AvatarInput)[] = [
  "age",
  "gender",
  "skinTone",
  "hairColor",
  "hairStyle",
  "eyeColor",
  "outfit",
  "distinguishingFeature",
  "notes",
];

const normTrait = (value: unknown): string =>
  value === undefined || value === null ? "" : `${value}`.trim();

/** Did this edit touch a visual trait (→ the server will paint a new portrait)? */
const didAppearanceChange = (
  before: Avatar | null,
  after: AvatarInput,
): boolean =>
  !before ||
  AVATAR_APPEARANCE_FIELDS.some(
    (field) => normTrait(after[field]) !== normTrait(before[field]),
  );

const addId = (ids: string[], id: string): string[] =>
  ids.includes(id) ? ids : [...ids, id];
const removeId = (ids: string[], id: string): string[] =>
  ids.filter((existing) => existing !== id);

const POLL_INTERVAL_MS = 4000;
const POLL_MAX_ATTEMPTS = 6;

/**
 * The server paints portraits in the background and returns before they
 * exist, so poll until the URL changes. Capped so no card spins forever.
 */
export const useAvatarMutations = () => {
  const queryClient = useQueryClient();

  /** Avatar ids currently having a new portrait painted — card shows the overlay. */
  const [pendingPortraitIds, setPendingPortraitIds] = useState<string[]>([]);
  /** Avatar ids with a non-portrait mutation in flight — card dims, no overlay. */
  const [busyIds, setBusyIds] = useState<string[]>([]);

  const activeTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const timers = activeTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: queryKeys.avatars.list() }),
    [queryClient],
  );

  const pollForPortrait = useCallback(
    (avatarId: string, sincePortraitUrl: string | undefined) => {
      setPendingPortraitIds((prev) => addId(prev, avatarId));

      let attempts = 0;
      const tick = () => {
        const timer = setTimeout(async () => {
          activeTimers.current.delete(timer);
          attempts += 1;

          let settled = false;
          try {
            const { data } = await api.get<Avatar>(
              END_POINTS.AVATARS.GET(avatarId),
            );
            settled = Boolean(data.portraitUrl) && data.portraitUrl !== sincePortraitUrl;
            if (settled) {
              queryClient.setQueryData<Avatar[]>(
                queryKeys.avatars.list(),
                (prev) => prev?.map((a) => (a._id === avatarId ? data : a)),
              );
            }
          } catch {
            // A failed poll attempt is not fatal on its own — retry until the cap.
          }

          if (settled || attempts >= POLL_MAX_ATTEMPTS) {
            setPendingPortraitIds((prev) => removeId(prev, avatarId));
          } else {
            tick();
          }
        }, POLL_INTERVAL_MS);
        activeTimers.current.add(timer);
      };
      tick();
    },
    [queryClient],
  );

  const save = useMutation({
    mutationFn: async ({
      input,
      existing,
    }: {
      input: AvatarInput;
      existing: Avatar | null;
    }): Promise<Avatar> => {
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
  });

  const saveAvatar = useCallback(
    async (input: AvatarInput, existing: Avatar | null): Promise<void> => {
      const editingId = existing?._id;
      const willRepaint = didAppearanceChange(existing, input);

      // Mark the card before the request goes out, so the list behind the
      // dialog reacts the moment Save is pressed.
      if (editingId) {
        if (willRepaint) {
          setPendingPortraitIds((prev) => addId(prev, editingId));
        } else {
          setBusyIds((prev) => addId(prev, editingId));
        }
      }

      try {
        const saved = await save.mutateAsync({ input, existing });
        await invalidate();

        if (willRepaint) {
          // A brand-new avatar has no prior portrait to compare against;
          // `existing` covers the edit case.
          pollForPortrait(saved._id, existing?.portraitUrl);
        } else if (editingId) {
          setBusyIds((prev) => removeId(prev, editingId));
        }
      } catch (error) {
        if (editingId) {
          setPendingPortraitIds((prev) => removeId(prev, editingId));
          setBusyIds((prev) => removeId(prev, editingId));
        }
        throw error;
      }
    },
    [save, pollForPortrait, invalidate],
  );

  const remove = useMutation({
    mutationFn: async (avatar: Avatar) => {
      await api.delete(END_POINTS.AVATARS.DELETE(avatar._id));
    },
  });

  const removeAvatar = useCallback(
    async (avatar: Avatar): Promise<void> => {
      setBusyIds((prev) => addId(prev, avatar._id));
      try {
        await remove.mutateAsync(avatar);
        await invalidate();
      } finally {
        // Harmless if the card is already gone from the list post-invalidate.
        setBusyIds((prev) => removeId(prev, avatar._id));
      }
    },
    [remove, invalidate],
  );

  return {
    saveAvatar,
    removeAvatar,
    isSaving: save.isPending || remove.isPending,
    /** Portrait is (re)painting for this card → show the overlay. */
    isPortraitPending: (avatarId: string) => pendingPortraitIds.includes(avatarId),
    /** Any mutation in flight for this card → dim it and disable its actions. */
    isBusy: (avatarId: string) =>
      busyIds.includes(avatarId) || pendingPortraitIds.includes(avatarId),
  };
};
