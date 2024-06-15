import END_POINTS from "src/application/shared/endpoints";
import { ExploreStore } from "./store";
import axios from "axios";

export interface ExploreManager {
  setUp: () => Promise<void>;
  fetchAllStories: () => Promise<void>;
}

export const useExploreManager = (store: ExploreStore): ExploreManager => {
  const setUp = async () => {
    debugger;
    store.handleIsFetching(true);
    await fetchAllStories();
    store.handleIsFetching(false);
  };

  const fetchAllStories = async (): Promise<void> => {
    try {
      const response = await axios.get(END_POINTS.STORIES.GET_ALL_STORIES);

      store.handleUpdateStory(response.data);

      console.log("ℹ️  fetchAllStories:>>>", { storiesList: response.data });
    } catch (error) {
      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    }
  };

  return {
    setUp,
    fetchAllStories,
  };
};
