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
  /**
   * The fully built AI prompt.
   *
   * Still sent, and still required in practice: an API deployment that
   * predates this branch reads this field straight off the body and hands it
   * to the model, so omitting it there produces an empty user message and a
   * response with none of the structure the extractors need. Newer servers
   * ignore what is sent here and build their own.
   *
   * Drop this field only once every environment runs a server that builds the
   * prompt itself — see the note at the top of `utils/getStoryPrompts.ts`.
   */
  storyPrompt: string;
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
 * `handleUpdateCreateStoryPrompt` were a half-finished draft feature nothing
 * ever called. The one thing anything actually read — `createStory.isFetching`
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
        storyPrompt: input.storyPrompt,
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
