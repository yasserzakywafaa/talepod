import { ProfileInfo } from "../store/state";
import { useGenerationContext } from "../generation/Provider";
import { useOpenaiContext } from "../openai/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";
import logger from "src/shared/logger";

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
  } = useStoryCreatorContext();

  const {
    store: {
      state: {
        createStory: { isFetching: isCreatingStory },
      },
    },
    manager: { isCreateStoryFetching, handleCreateStoryRequest },
  } = useOpenaiContext();

  const {
    manager: { isGenerating, startGeneration },
  } = useGenerationContext();

  const generateStory = async (options?: GenerateStoryOptions) => {
    if (isGenerating) return;

    const resolvedProfile: ProfileInfo = {
      ...profileInfo,
      ...options?.profileOverride,
    };
    isCreateStoryFetching(true);
    try {
      const placeholder = await handleCreateStoryRequest(
        resolvedProfile,
        storyParams,
        format,
        artStyle,
        avatarId,
      );

      if (placeholder?._id) {
        startGeneration(placeholder, resolvedProfile.name);
      }
    } catch (error) {
      logger.error("Failed to create a story", error);
      throw error;
    } finally {
      isCreateStoryFetching(false);
    }
  };

  return {
    isCreatingStory,
    isGenerating,
    generateStory,
  };
};
