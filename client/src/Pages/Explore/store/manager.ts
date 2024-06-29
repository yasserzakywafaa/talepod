import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { ExploreStore } from "./store";
import { ExploreStoryFilters } from "./state";
import axios from "axios";
import { useEffect } from "react";
import { useFiltersPanel } from "../features/FiltersPanel/useFiltersPanel";

export interface ExploreManager {
  setUp: () => Promise<void>;
  handleSortStories: () => void;
  handleClearFilters: () => void;
  handleFilterStories: () => void;
  handleFetchAllStories: () => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof name]
  ) => void;
}

export const useExploreManager = (store: ExploreStore): ExploreManager => {
  const { stories, filters } = store.state;
  const { filteredStories, activeFiltersCount } = useFiltersPanel(
    stories,
    filters
  );

  const setUp = async () => {
    store.isExploreFetching(true);
    try {
      await handleFetchAllStories();
      store.isExploreFetching(false);
    } catch (error) {
      store.isExploreFetching(false);
    }
  };

  const handleToggleFiltersPanel = (isOpen: boolean) => {
    store.toggleFiltersPanel(isOpen);
  };

  const handleSortStories = () => {
    store.sortStories();
  };

  const handleUpdateFilters = (
    name: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof name]
  ) => {
    store.updateFilters(name, value);
  };

  const handleFilterStories = () => {
    store.applyFilters(filteredStories);
  };

  const handleClearFilters = () => {
    store.clearFilters();
  };

  const handleFetchAllStories = async (): Promise<void> => {
    try {
      const response = await axios.get(END_POINTS.STORIES.GET_ALL_STORIES);

      store.updateStories(response.data);

      if (APP_CONSTANTS.IS_DEV_LOCAL_SERVER) {
        console.log("ℹ️  fetchAllStories:>>>", { storiesList: response.data });
      }
    } catch (error) {
      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    }
  };

  useEffect(() => {
    store.setActiveFiltersCount(activeFiltersCount);
  }, [activeFiltersCount]);

  return {
    setUp,
    handleSortStories,
    handleClearFilters,
    handleFilterStories,
    handleUpdateFilters,
    handleFetchAllStories,
    handleToggleFiltersPanel,
  };
};
