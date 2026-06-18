import { Avatar, AvatarInput } from "src/shared/types/avatar";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { useCallback, useEffect, useMemo, useState } from "react";

import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";

/** Traits that change how the avatar is *drawn* (mirrors the server). Editing
 *  only name/relationship must not re-paint the portrait. */
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

/** Did this edit touch a visual trait (→ a new portrait will be painted)? */
const didAppearanceChange = (
  before: Avatar | null,
  after: AvatarInput,
): boolean =>
  !before ||
  AVATAR_APPEARANCE_FIELDS.some(
    (field) =>
      normTrait((after as unknown as Record<string, unknown>)[field]) !==
      normTrait((before as unknown as Record<string, unknown>)[field]),
  );

const uniq = (ids: string[]): string[] => Array.from(new Set(ids));

/**
 * CRUD + UX hook for the user's saved avatars. It owns ALL the heavy lifting so
 * the page can stay presentational: the optimistic "set & forget" create card,
 * the background-portrait polling, the create/update/delete flows (with toasts),
 * and the per-card pending/busy state used to show the painting overlay and to
 * disable a card's actions while it's being updated.
 *
 * Auth is cookie-based (axios sends credentials globally), so every call is
 * user-scoped server-side. Portraits are generated server-side in the background
 * and surfaced by the poll once ready.
 */
export const useAvatars = (enabled = true) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Optimistic placeholder cards shown while a create POST is still in flight
  // (no real id yet) so the dialog can close immediately ("set & forget").
  const [optimistic, setOptimistic] = useState<Avatar[]>([]);
  // Saved avatars whose portrait is regenerating → show the painting overlay.
  const [pendingPortraitIds, setPendingPortraitIds] = useState<string[]>([]);
  // Saved avatars with a non-painting mutation in flight (name-only edit, delete)
  // → disable their card actions, without a spinner.
  const [busyIds, setBusyIds] = useState<string[]>([]);

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

  // ---- low-level CRUD (kept internal; the page uses the flows below) ----
  const createAvatar = useCallback(
    async (input: AvatarInput): Promise<Avatar> => {
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
    },
    [],
  );

  const updateAvatar = useCallback(
    async (avatarId: string, input: AvatarInput): Promise<Avatar> => {
      setIsSaving(true);
      try {
        const { data } = await axios.put<Avatar>(
          END_POINTS.AVATARS.UPDATE(avatarId),
          input,
        );
        setAvatars((prev) => prev.map((a) => (a._id === avatarId ? data : a)));
        return data;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteAvatar = useCallback(async (avatarId: string): Promise<void> => {
    await axios.delete(END_POINTS.AVATARS.DELETE(avatarId));
    setAvatars((prev) => prev.filter((a) => a._id !== avatarId));
  }, []);

  /**
   * Poll for background-generated portraits: refresh every 4s (≤6 tries) until
   * each target has a portrait that *differs* from the one it started with (so
   * this works for both a brand-new portrait and a regenerated one on edit),
   * then stop. Any stragglers are dropped so the card stops spinning and falls
   * back to its current image / initial letter instead of spinning forever.
   */
  const pollForPortraits = useCallback(
    (targets: { id: string; since?: string }[]) => {
      const wanted = targets.filter((target) => target.id);
      if (!wanted.length) return;
      setPendingPortraitIds((prev) =>
        uniq([...prev, ...wanted.map((target) => target.id)]),
      );

      let attempts = 0;
      const tick = async () => {
        attempts += 1;
        const fresh = await fetchAvatars();
        const settledIds = wanted
          .filter((target) => {
            const url = fresh.find((a) => a._id === target.id)?.portraitUrl;
            return Boolean(url) && url !== target.since;
          })
          .map((target) => target.id);
        const remaining = wanted.filter(
          (target) => !settledIds.includes(target.id),
        );
        if (settledIds.length) {
          setPendingPortraitIds((prev) =>
            prev.filter((id) => !settledIds.includes(id)),
          );
        }
        if (remaining.length && attempts < 6) {
          window.setTimeout(tick, 4000);
        } else if (remaining.length) {
          const remainingIds = remaining.map((target) => target.id);
          setPendingPortraitIds((prev) =>
            prev.filter((id) => !remainingIds.includes(id)),
          );
        }
      };
      window.setTimeout(tick, 4000);
    },
    [fetchAvatars],
  );

  /**
   * Create or update an avatar with "set & forget" UX. The caller closes the
   * dialog immediately; we add the optimistic card / painting overlay right
   * away, run the request in the background, and poll the new portrait in. A
   * name/relationship-only edit keeps the existing image (no spinner, no poll).
   */
  const saveAvatar = useCallback(
    async (input: AvatarInput, editing: Avatar | null): Promise<void> => {
      const isEditing = Boolean(editing);
      const editingId = editing?._id;
      // Baseline portrait so the poll can detect a *regenerated* one on edit.
      const previousPortrait = editing?.portraitUrl;
      // A new portrait is painted on create, or on an edit that changes the look.
      const willRepaint = !isEditing || didAppearanceChange(editing, input);

      const tempId = `temp-${Date.now()}`;
      if (!isEditing) {
        const placeholder = {
          ...input,
          _id: tempId,
          userId: "",
          createdAt: new Date().toISOString(),
        } as Avatar;
        setOptimistic((prev) => [placeholder, ...prev]);
      } else if (editingId) {
        // Disable the card immediately; also show the painting overlay (covering
        // the description recompose AND the portrait render) when the look changes.
        if (willRepaint) {
          setPendingPortraitIds((prev) => uniq([...prev, editingId]));
        } else {
          setBusyIds((prev) => uniq([...prev, editingId]));
        }
      }

      try {
        if (isEditing && editingId) {
          const updated = await updateAvatar(editingId, input);
          Notify({ type: ToastTypes.Success, content: "Avatar updated." });
          if (willRepaint) {
            pollForPortraits([{ id: updated._id, since: previousPortrait }]);
          } else {
            setBusyIds((prev) => prev.filter((id) => id !== editingId));
          }
        } else {
          const created = await createAvatar(input);
          setOptimistic((prev) => prev.filter((a) => a._id !== tempId));
          Notify({ type: ToastTypes.Success, content: "Avatar created." });
          pollForPortraits([{ id: created._id }]);
        }
      } catch (error) {
        if (!isEditing) {
          setOptimistic((prev) => prev.filter((a) => a._id !== tempId));
        } else if (editingId) {
          setPendingPortraitIds((prev) => prev.filter((id) => id !== editingId));
          setBusyIds((prev) => prev.filter((id) => id !== editingId));
        }
        Notify({ type: ToastTypes.Error, content: "Something went wrong." });
      }
    },
    [createAvatar, updateAvatar, pollForPortraits],
  );

  /** Delete an avatar (with toasts); disables its card actions while in flight. */
  const removeAvatar = useCallback(
    async (avatar: Avatar): Promise<void> => {
      setBusyIds((prev) => uniq([...prev, avatar._id]));
      try {
        await deleteAvatar(avatar._id);
        Notify({ type: ToastTypes.Success, content: "Avatar deleted." });
      } catch (error) {
        Notify({ type: ToastTypes.Error, content: "Failed to delete avatar." });
      } finally {
        setBusyIds((prev) => prev.filter((id) => id !== avatar._id));
      }
    },
    [deleteAvatar],
  );

  // ---- derived view state for the page ----
  const cards = useMemo(
    () => [...optimistic, ...avatars],
    [optimistic, avatars],
  );

  /** Portrait is (re)generating → show the painting overlay on the card. */
  const isPortraitPending = useCallback(
    (id: string): boolean =>
      id.startsWith("temp-") || pendingPortraitIds.includes(id),
    [pendingPortraitIds],
  );

  /** Any mutation in flight for this card → disable its actions. */
  const isBusy = useCallback(
    (id: string): boolean =>
      id.startsWith("temp-") ||
      pendingPortraitIds.includes(id) ||
      busyIds.includes(id),
    [pendingPortraitIds, busyIds],
  );

  return {
    avatars,
    cards,
    isLoading,
    isSaving,
    isPortraitPending,
    isBusy,
    saveAvatar,
    removeAvatar,
  };
};

/** Fetch a single avatar by id (e.g. from a story's `avatarId`). */
export const useAvatar = (avatarId?: string) => {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!avatarId) {
      setAvatar(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    axios
      .get<Avatar>(END_POINTS.AVATARS.GET(avatarId))
      .then(({ data }) => {
        if (!cancelled) setAvatar(data);
      })
      .catch((error) => {
        if (!cancelled) setAvatar(null);
        console.error("❌ Failed to load avatar", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [avatarId]);

  return { avatar, isLoading };
};
