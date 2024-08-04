import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import { ViewStoryStore } from "./store";
import { getStorySeoPrompt } from "src/components/StoryCreator/utils/getStoryPrompts";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";

export interface ViewStoryManager {
  setUp: (slug: string) => Promise<void>;
  fetchStoryBySlug: (slug: string) => Promise<Story | undefined>;
  createSeoTextForStory: (story: Story, userSeoPrompt: string) => Promise<void>;
}

export const useViewStoryManager = (
  store: ViewStoryStore
): ViewStoryManager => {
  const {
    manager: { handleCreateStorySeoRequest },
  } = useOpenaiContext();

  const setUp = async (slug: string) => {
    store.handleIsFetching(true);
    const story = await fetchStoryBySlug(slug);
    store.handleIsFetching(false);

    if (story && !story.seo) {
      const storySeoPrompt = getStorySeoPrompt(story);
      await createSeoTextForStory(story, storySeoPrompt);
    }
  };

  const fetchStoryBySlug = async (slug: string): Promise<Story | undefined> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.get(
        END_POINTS.STORIES.GET_STORY_BY_SLUG(slug)
      );
      store.handleUpdateStory(response.data);

      return response.data;
    } catch (error) {
      store.handleUpdateStory(undefined);
      // throw new Error(`❌ Failed to get Story by Slug :>>> ${error}`);
      console.error("❌ Failed to get Story by Slug :>>>", {
        error,
      });

      return;
    } finally {
      store.handleIsFetching(false);
    }
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
      store.handleUpdateStory(updatedStory);
    } catch (error) {
      store.handleIsFetching(false);
      throw new Error(`❌ Failed to fetch Story SEO :>>> ${error}`);
    }
  };

  return {
    setUp,
    fetchStoryBySlug,
    createSeoTextForStory,
  };
};
