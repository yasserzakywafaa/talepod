import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import APP_CONSTANTS from "src/application/shared/app_constants";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { ProfileInfo, StoryFormat } from "../store/state";
import { getCreateStoryPrompt } from "../utils/getStoryPrompts";
import { useOpenaiContext } from "../features/Openai/store/Provider";
import { useStoryCreatorContext } from "../store/Provider";

export interface GenerateStoryOptions {
  /** Mini form: override name and force English without mutating the store. */
  profileOverride?: Partial<ProfileInfo>;
}

export interface UseGenerateStory {
  isCreatingStory: boolean;
  isGenerationComplete: boolean;
  format: StoryFormat;
  childName: string;
  generateStory: (options?: GenerateStoryOptions) => Promise<void>;
}

/**
 * Shared story-generation orchestration for CreateStoryForm and
 * CreateStoryFormMini. Builds the prompt fresh from store state (so format
 * always matches the request), forwards format/artStyle/avatarId, and owns
 * the GeneratingScreen "Done" beat + navigation timer.
 */
export const useGenerateStory = (): UseGenerateStory => {
  const navigate = useNavigate();
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [navTarget, setNavTarget] = useState<{
    userId: string;
    slug: string;
  } | null>(null);

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
    store: {
      state: {
        auth: { user },
      },
    },
    manager: { handleSetAuthInfo, handleFetchUserInfo },
  } = useApplicationContext();

  const generateStory = async (options?: GenerateStoryOptions) => {
    const resolvedProfile: ProfileInfo = {
      ...profileInfo,
      ...options?.profileOverride,
    };
    const prompt = getCreateStoryPrompt({
      ...storyCreatorStore.state,
      profileInfo: resolvedProfile,
    });
    if (!prompt) return;

    isCreateStoryFetching(true);
    try {
      const story = await handleCreateStoryRequest(
        prompt,
        resolvedProfile,
        storyParams,
        format,
        artStyle,
        avatarId,
      );

      const refreshedUser = await handleFetchUserInfo();
      if (refreshedUser) {
        handleSetAuthInfo({ isAuthenticated: true, user: refreshedUser });
      }

      const userId = refreshedUser?._id ?? user?._id;
      if (userId && story._id && story.slug) {
        setNavTarget({ userId, slug: story.slug });
        setIsGenerationComplete(true);
        return;
      }

      isCreateStoryFetching(false);
    } catch (error) {
      console.error("❌ Failed to create a story!", { error });
      isCreateStoryFetching(false);
    }
  };

  // Once the story is saved we flip `isGenerationComplete` (overlay shows its
  // "Done" step); this timer then navigates after a short beat. Keeping the
  // timer here — not inside GeneratingScreen — means it can't be cancelled by
  // the overlay unmounting, which previously left users stranded on the page.
  useEffect(() => {
    if (!isGenerationComplete || !navTarget) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(
        APP_CONSTANTS.LOCAL_STORAGE.STORY_GENERATED,
        "true",
      );
      isCreateStoryFetching(false);
      navigate(routes.myStory(navTarget.userId, navTarget.slug), {
        replace: false,
      });
    }, 2200);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerationComplete, navTarget, navigate]);

  return {
    isCreatingStory,
    isGenerationComplete,
    format,
    childName: profileInfo.name,
    generateStory,
  };
};
