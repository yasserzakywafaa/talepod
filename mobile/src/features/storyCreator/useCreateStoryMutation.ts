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
  // Older servers read this straight off the body, so omitting it there
  // breaks generation. Drop only per the note in `utils/getStoryPrompts.ts`.
  storyPrompt: string;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  format?: StoryFormat;
  artStyle?: string;
  avatarId?: string;
}

// A bare mutation, not backed by a query key: a create request is never
// repeated with the same input, so there is nothing to cache.
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
