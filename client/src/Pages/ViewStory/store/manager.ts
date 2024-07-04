import END_POINTS from "src/application/shared/endpoints";
import { ViewStoryStore } from "./store";
import axios from "axios";

export interface ViewStoryManager {
  setUp: (storyId: string) => Promise<void>;
  fetchStoryById: (storyId: string) => Promise<void>;
}

export const useViewStoryManager = (
  store: ViewStoryStore
): ViewStoryManager => {
  const setUp = async (storyId: string) => {
    store.handleIsFetching(true);
    await fetchStoryById(storyId);
    store.handleIsFetching(false);
  };

  const fetchStoryById = async (storyId: string): Promise<void> => {
    try {
      const response = await axios.get(
        END_POINTS.STORIES.GET_STORY_BY_ID(storyId)
      );
      store.handleUpdateStory(response.data);
    } catch (error) {
      store.handleUpdateStory(undefined);
      store.handleIsFetching(false);
      throw new Error(`❌ Failed to fetch Story by Id :>>> ${error}`);
    }
  };

  return {
    setUp,
    fetchStoryById,
  };
};
