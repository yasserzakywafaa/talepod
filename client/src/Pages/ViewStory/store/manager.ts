import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import { ViewStoryStore } from "./store";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";

export interface ViewStoryManager {
  setUp: (slug: string) => Promise<void>;
  fetchStoryBySlug: (
    slug: string,
    options?: { keepOnError?: boolean }
  ) => Promise<Story | undefined>;
  createSeoTextForStory: (story: Story, userSeoPrompt: string) => Promise<void>;
}

// Background images fill in after creation; poll the story until they land.
const IMAGE_POLL_INTERVAL_MS = 5000;
const IMAGE_POLL_MAX_ATTEMPTS = 24; // ~2 minutes
const activeImagePolls = new Set<string>();

export const useViewStoryManager = (
  store: ViewStoryStore
): ViewStoryManager => {
  const {
    manager: { handleCreateStorySeoRequest },
  } = useOpenaiContext();

  const setUp = async (slug: string) => {
    store.setIsFetching(true);
    try {
      const story = await fetchStoryBySlug(slug);
      if (story?.imagesStatus === "pending") {
        pollForImages(slug);
      }
    } catch (error) {
      getAxiosError(error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const fetchStoryBySlug = async (
    slug: string,
    options?: { keepOnError?: boolean }
  ): Promise<Story | undefined> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.get(
        END_POINTS.STORIES.GET_STORY_BY_SLUG(slug)
      );
      store.updateStory(response.data);

      return response.data;
    } catch (error) {
      // During polling we keep the already-rendered story so a transient
      // network blip doesn't flash the "not found" state.
      if (!options?.keepOnError) {
        store.updateStory(undefined);
      }
      console.error("❌ Failed to get Story by Slug :>>>", {
        error,
      });

      return;
    } finally {
      store.setIsFetching(false);
    }
  };

  // Re-fetch the story on an interval until image generation finishes, then
  // stop. ComicReader / the long cover render the new imageUrls as they arrive.
  const pollForImages = (slug: string) => {
    if (activeImagePolls.has(slug)) return;
    activeImagePolls.add(slug);

    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      const story = await fetchStoryBySlug(slug, { keepOnError: true });
      const stillPending = story?.imagesStatus === "pending";
      if (stillPending && attempts < IMAGE_POLL_MAX_ATTEMPTS) {
        setTimeout(tick, IMAGE_POLL_INTERVAL_MS);
      } else {
        activeImagePolls.delete(slug);
      }
    };
    setTimeout(tick, IMAGE_POLL_INTERVAL_MS);
  };

  const createSeoTextForStory = async (story: Story, userSeoPrompt: string) => {
    try {
      const storySEO = await handleCreateStorySeoRequest(
        story._id,
        userSeoPrompt
      );
      const updatedStory: Story = {
        ...story,
        seo: storySEO,
      };
      store.updateStory(updatedStory);
    } catch (error) {
      store.setIsFetching(false);
      throw new Error(`❌ Failed to fetch Story SEO :>>> ${error}`);
    }
  };

  return {
    setUp,
    fetchStoryBySlug,
    createSeoTextForStory,
  };
};
