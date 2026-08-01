import { useMutation } from "@tanstack/react-query";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { useApplicationContext } from "src/application/store/Provider";
import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import type { User } from "src/shared/types/user";

import type {
  ProfileInfo,
  Story,
  StoryFormat,
  StoryParams,
} from "src/features/storyCreator/store/state";

export interface CreateStoryInput {
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  format?: StoryFormat;
  artStyle?: string;
  avatarId?: string;
}

/**
 * The create-story request, as a mutation.
 *
 * This used to be a store/manager/state/Provider quartet
 * (`features/storyCreator/openai/`) wrapping one POST. Most of that state
 * turned out to be dead: `createAudio` and `createImage` were never read
 * outside their own initial-state function, and `createStoryPrompt` /
 * `handleUpdateCreateStoryPrompt` were leftovers from when the client built
 * the AI prompt and sent it — the server does that now (see
 * `server/src/services/create/storyPrompt.ts`), so nothing calls the setter
 * any more. The one thing anything actually read — `createStory.isFetching`
 * — is exactly what `useMutation`'s `isPending` gives for free.
 *
 * Response caching doesn't apply here (a create request is never repeated
 * with the same input), so this is a bare mutation, not backed by a query key.
 */
export const useCreateStoryMutation = () => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const mutation = useMutation({
    mutationFn: async (input: CreateStoryInput): Promise<Story> => {
      const { data } = await api.post<Story>(END_POINTS.CREATE.GENERATE.STORY, {
        profileInfo: input.profileInfo,
        storyParams: input.storyParams,
        format: input.format ?? "comic",
        artStyle: input.artStyle,
        avatarId: input.avatarId || undefined,
        userInfo: auth.user as User,
      });
      return data;
    },
  });

  return {
    createStory: (input: CreateStoryInput) => mutation.mutateAsync(input),
    isCreatingStory: mutation.isPending,
  };
};

export const getCreateStoryErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, "Oops, something went wrong!");
