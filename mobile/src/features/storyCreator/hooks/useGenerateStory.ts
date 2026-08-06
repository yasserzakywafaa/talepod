import { ProfileInfo } from "../store/state";
import { getCreateStoryPrompt } from "../utils/getStoryPrompts";
import { useGenerationContext } from "../generation/Provider";
import { useStoryCreatorContext } from "../store/Provider";
import { useCreateStoryMutation } from "src/features/storyCreator/useCreateStoryMutation";
import { logger } from "src/shared/logger";

export interface GenerateStoryOptions {
  profileOverride?: Partial<ProfileInfo>;
  source?: "hero_mini" | "create_form";
}

export interface UseGenerateStory {
  isCreatingStory: boolean;
  isGenerating: boolean;
  generateStory: (options?: GenerateStoryOptions) => Promise<void>;
}

export const useGenerateStory = (): UseGenerateStory => {
  const {
    store: {
      state: { profileInfo, storyParams, format, artStyle, avatarId },
    },
    store: storyCreatorStore,
  } = useStoryCreatorContext();

  const { createStory, isCreatingStory } = useCreateStoryMutation();

  const {
    manager: { isGenerating, startGeneration },
  } = useGenerationContext();

  const generateStory = async (options?: GenerateStoryOptions) => {
    if (isGenerating) return;

    const resolvedProfile: ProfileInfo = {
      ...profileInfo,
      ...options?.profileOverride,
    };
    // Built from the same state the request carries, so a server that ignores
    // this and builds its own produces an identical prompt.
    const storyPrompt = getCreateStoryPrompt({
      ...storyCreatorStore.state,
      profileInfo: resolvedProfile,
    });
    if (!storyPrompt) return;

    try {
      const placeholder = await createStory({
        storyPrompt,
        profileInfo: resolvedProfile,
        storyParams,
        format,
        artStyle,
        avatarId,
      });

      if (placeholder?._id) {
        startGeneration(placeholder, resolvedProfile.name);
      }
    } catch (error) {
      logger.error("Failed to create a story", error);
      throw error;
    }
  };

  return {
    isCreatingStory,
    isGenerating,
    generateStory,
  };
};
