import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { useApplicationContext } from "src/application/store/Provider";
import { getCreateStoryPrompt } from "src/features/storyCreator/utils/getStoryPrompts";
import { getStoryCreatorInitialState } from "src/features/storyCreator/store/state";
import type { Story } from "src/features/storyCreator/store/state";
import { queryKeys } from "src/shared/api/queryKeys";
import type { User } from "src/shared/types/user";

/**
 * `getCreateStoryPrompt` only ever reads `profileInfo` / `storyParams` /
 * `format` off its argument, but its type is the whole story-creator wizard
 * state (it's meant to be called with that state directly during creation).
 * A retry has no wizard in scope — just the failed story's own saved
 * fields — so this fills the rest from the wizard's defaults, which the
 * function never looks at.
 */
const buildRetryPromptInput = (failed: Story) => ({
  ...getStoryCreatorInitialState(),
  profileInfo: failed.profileInfo,
  storyParams: failed.storyParams,
  format: failed.format ?? "comic",
  artStyle: failed.artStyle ?? getStoryCreatorInitialState().artStyle,
});

/**
 * What a stuck "Creating your story…" card actually is: a placeholder whose
 * background generation set `textStatus: "failed"` (see
 * `generateStoryText` in the server) and then had nowhere to go — nothing in
 * the UI distinguished it from one still in progress, and there was no way to
 * remove or retry it. It sat in the list forever, permanently reading
 * "Creating your story…".
 *
 * Two actions, both scoped to the story's own author on the server (a user
 * can only touch their own placeholders):
 *
 *  - delete: removes the failed row. Its own endpoint, separate from the
 *    admin delete — a regular user was never able to delete anything before
 *    this.
 *  - retry: rebuilds the prompt from the profileInfo/storyParams/format the
 *    failed placeholder already has saved, fires a fresh create request, and
 *    only removes the old failed row once the new one exists — so a failed
 *    retry never loses the "at least something is here to retry again" state.
 */
export const useFailedStoryActions = () => {
  const queryClient = useQueryClient();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });

  const deleteStory = useMutation({
    mutationFn: (storyId: string) =>
      api.delete(END_POINTS.STORIES.DELETE_MY_STORY(storyId)),
    onSuccess: invalidate,
  });

  const retryStory = useMutation({
    mutationFn: async (failed: Story) => {
      const storyPrompt = getCreateStoryPrompt(buildRetryPromptInput(failed));

      await api.post<Story>(END_POINTS.CREATE.GENERATE.STORY, {
        storyPrompt,
        profileInfo: failed.profileInfo,
        storyParams: failed.storyParams,
        format: failed.format ?? "comic",
        artStyle: failed.artStyle,
        avatarId: failed.avatarId || undefined,
        userInfo: auth.user as User,
      });

      // Only clear the failed placeholder once its replacement is confirmed
      // created — if the retry itself fails, the original stays so there is
      // still something on screen to retry or delete.
      await api.delete(END_POINTS.STORIES.DELETE_MY_STORY(failed._id));
    },
    onSuccess: invalidate,
  });

  return {
    deleteStory: (storyId: string) => deleteStory.mutate(storyId),
    retryStory: (story: Story) => retryStory.mutate(story),
    isDeletingStory: deleteStory.isPending,
    isRetryingStory: retryStory.isPending,
  };
};
