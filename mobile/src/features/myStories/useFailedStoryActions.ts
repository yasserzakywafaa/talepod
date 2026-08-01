import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { useCreateStoryMutation } from "src/features/storyCreator/useCreateStoryMutation";
import { useGenerationContext } from "src/features/storyCreator/generation/Provider";
import { getCreateStoryPrompt } from "src/features/storyCreator/utils/getStoryPrompts";
import { getStoryCreatorInitialState } from "src/features/storyCreator/store/state";
import type { Story } from "src/features/storyCreator/store/state";
import { queryKeys } from "src/shared/api/queryKeys";

// `getCreateStoryPrompt` only reads profileInfo/storyParams/format, but its
// type is the whole wizard state — a retry has none, so pad it with defaults.
const buildRetryPromptInput = (failed: Story) => ({
  ...getStoryCreatorInitialState(),
  profileInfo: failed.profileInfo,
  storyParams: failed.storyParams,
  format: failed.format ?? "comic",
  artStyle: failed.artStyle ?? getStoryCreatorInitialState().artStyle,
});

export interface FailedStoryActionsOptions {
  /** Fired once the replacement exists, so the list can scroll to it. */
  onRetryStarted?: () => void;
}

/**
 * Delete and retry for a placeholder whose generation failed. Both are
 * author-scoped on the server, so a user can only touch their own.
 */
export const useFailedStoryActions = (
  options: FailedStoryActionsOptions = {},
) => {
  const queryClient = useQueryClient();
  const { createStory } = useCreateStoryMutation();
  const {
    manager: { startGeneration },
  } = useGenerationContext();

  const [retryingStoryId, setRetryingStoryId] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });

  const deleteStory = useMutation({
    mutationFn: (storyId: string) =>
      api.delete(END_POINTS.STORIES.DELETE_MY_STORY(storyId)),
    onSuccess: invalidate,
  });

  const retryStory = useMutation({
    mutationFn: async (failed: Story) => {
      const placeholder = await createStory({
        storyPrompt: getCreateStoryPrompt(buildRetryPromptInput(failed)),
        profileInfo: failed.profileInfo,
        storyParams: failed.storyParams,
        format: failed.format ?? "comic",
        artStyle: failed.artStyle,
        avatarId: failed.avatarId || undefined,
      });

      // Only drop the failed row once its replacement exists, so a failed
      // retry still leaves something on screen to retry or delete.
      await api.delete(END_POINTS.STORIES.DELETE_MY_STORY(failed._id));
      return placeholder;
    },
    onMutate: (failed: Story) => setRetryingStoryId(failed._id),
    onSuccess: async (placeholder, failed) => {
      // Same treatment as a story started from the wizard: the docked progress
      // snackbar, plus polling that refreshes the list as it lands.
      if (placeholder?._id) {
        startGeneration(placeholder, failed.profileInfo?.name ?? "");
      }
      await invalidate();
      options.onRetryStarted?.();
    },
    onSettled: () => setRetryingStoryId(null),
  });

  return {
    deleteStory: (storyId: string) => deleteStory.mutate(storyId),
    retryStory: (story: Story) => retryStory.mutate(story),
    isDeletingStory: deleteStory.isPending,
    /** Only the card that was actually tapped shows a spinner. */
    isRetryingStory: (storyId: string) => retryingStoryId === storyId,
  };
};
