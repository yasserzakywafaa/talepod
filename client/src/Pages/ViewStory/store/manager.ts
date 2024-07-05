import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import { ViewStoryStore } from "./store";
import { getStorySeoPrompt } from "src/components/StoryCreator/utils/getStoryPrompts";
import { useOpenaiContext } from "src/components/StoryCreator/features/Openai/store/Provider";

export interface ViewStoryManager {
  setUp: (storyId: string) => Promise<void>;
  fetchStoryById: (storyId: string) => Promise<Story>;
  createSeoTextForStory: (story: Story, userSeoPrompt: string) => Promise<void>;
}

export const useViewStoryManager = (
  store: ViewStoryStore
): ViewStoryManager => {
  const {
    manager: { handleCreateStorySeoRequest },
  } = useOpenaiContext();

  const setUp = async (storyId: string) => {
    store.handleIsFetching(true);
    await fetchStoryById(storyId);
    const story = await fetchStoryById(storyId);

    if (!story.seo) {
      const storySeoPrompt = getStorySeoPrompt(story);
      await createSeoTextForStory(story, storySeoPrompt);
    }

    store.handleIsFetching(false);
  };

  const fetchStoryById = async (storyId: string): Promise<Story> => {
    try {
      const response: AxiosResponse<Story, Story> = await axios.get(
        END_POINTS.STORIES.GET_STORY_BY_ID(storyId)
      );
      store.handleUpdateStory(response.data);

      return response.data;
    } catch (error) {
      store.handleUpdateStory(undefined);
      store.handleIsFetching(false);
      throw new Error(`❌ Failed to fetch Story by Id :>>> ${error}`);
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
    fetchStoryById,
    createSeoTextForStory,
  };
};
