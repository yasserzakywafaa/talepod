import END_POINTS from "src/application/shared/endpoints";
import { ExploreStore } from "./store";
import axios from "axios";
import APP_CONSTANTS from "src/application/shared/app_constants";
import { useFiltersPanel } from "../features/FiltersPanel/useFiltersPanel";

export interface ExploreManager {
  setUp: () => Promise<void>;
  sortStories: () => void;
  filterStories: () => void;
  fetchAllStories: () => Promise<void>;
  toggleFiltersPanel: (isOpen: boolean) => void;
}

export const useExploreManager = (store: ExploreStore): ExploreManager => {
  const {stories, filters} = store.state;
  const filteredStories = useFiltersPanel(stories, filters);

  const setUp = async () => {
    store.handleIsFetching(true);
    try {
      await fetchAllStories();
      store.handleIsFetching(false);
    } catch (error) {
      store.handleIsFetching(false);
    }
  };

  const toggleFiltersPanel = (isOpen: boolean) => {
    store.handleToggleFiltersPanel(isOpen);
  } 

  const sortStories = () => {
    store.handleSortStories();
  }

  const filterStories = () => {
    store.handleApplyFilters(filteredStories);
  }

  const fetchAllStories = async (): Promise<void> => {
    try {
      const response = await axios.get(END_POINTS.STORIES.GET_ALL_STORIES);

      store.handleUpdateStory(response.data);

      if (APP_CONSTANTS.IS_DEV_LOCAL_SERVER) {
        console.log("ℹ️  fetchAllStories:>>>", { storiesList: response.data });
      }
    } catch (error) {
      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    }
  };

  return {
    setUp,
    sortStories,
    filterStories,
    fetchAllStories,
    toggleFiltersPanel,
  };
};
