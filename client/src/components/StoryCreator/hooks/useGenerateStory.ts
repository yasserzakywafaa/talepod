import { ProfileInfo } from "../store/state";
import { getCreateStoryPrompt } from "../utils/getStoryPrompts";
import { useGenerationContext } from "../generation/Provider";
import { useOpenaiContext } from "../features/Openai/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";
import { trackGtmEvent } from "src/shared/utils/gtm";

export interface GenerateStoryOptions {
  /** Mini form: override name and force English without mutating the store. */
  profileOverride?: Partial<ProfileInfo>;
  source?: "hero_mini" | "create_form";
}

export interface UseGenerateStory {
  /** True only for the brief create request; the chip owns the long wait. */
  isCreatingStory: boolean;
  /** True while a story is in the generation pipeline (blocks re-submit). */
  isGenerating: boolean;
  generateStory: (options?: GenerateStoryOptions) => Promise<void>;
}

/**
 * Shared story-generation orchestration for CreateStoryForm and
 * CreateStoryFormMini. Builds the prompt fresh from store state (so format
 * always matches the request), forwards format/artStyle/avatarId, and hands the
 * returned "pending" placeholder to the global GenerationContext, which drives
 * the docked progress chip and polling. No navigation happens here.
 */
export const useGenerateStory = (): UseGenerateStory => {
  const {
    store: {
      state: { profileInfo, storyParams, format, artStyle, avatarId },
    },
    store: storyCreatorStore,
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
    // Guard against a second submit while one is already in flight.
    if (isGenerating) return;

    const resolvedProfile: ProfileInfo = {
      ...profileInfo,
      ...options?.profileOverride,
    };
    const prompt = getCreateStoryPrompt({
      ...storyCreatorStore.state,
      profileInfo: resolvedProfile,
    });
    if (!prompt) return;

    trackGtmEvent("create_story", {
      format,
      art_style: artStyle,
      has_avatar: Boolean(avatarId),
      source: options?.source ?? "create_form",
    });

    isCreateStoryFetching(true);
    try {
      // The request now returns a "pending" placeholder almost instantly; the
      // chip + polling take over for the long generation.
      const placeholder = await handleCreateStoryRequest(
        prompt,
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
      console.error("❌ Failed to create a story!", { error });
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
