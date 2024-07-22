import { ExploreStoryFilters, getExploreInitialState } from "./state";
import { parseQueryString, replaceUrl } from "src/shared/utils/stringUtils";

import APP_CONSTANTS from "src/application/shared/app_constants";
import END_POINTS from "src/application/shared/endpoints";
import { ExploreStore } from "./store";
import axios from "axios";
import { useFiltersPanel } from "../features/FiltersPanel/useFiltersPanel";

export interface ExploreManager {
  setUp: () => Promise<void>;
  handleSortStories: () => void;
  handleClearFilters: () => void;
  handleFilterStories: () => void;
  handleUpdateUrlByFilters: () => void;
  handleFetchStories: (filters?: ExploreStoryFilters) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof ExploreStoryFilters,
    value: ExploreStoryFilters[typeof name]
  ) => void;
}

export const useExploreManager = (store: ExploreStore): ExploreManager => {
  const { stories, filters } = store.state;
  const initialFilters = getExploreInitialState().filters;
  const { filteredStories, activeFiltersCount, getActiveFiltersCount } =
    useFiltersPanel(stories, filters);

  const setUp = async () => {
    store.isExploreFetching(true);
    const newFilters = await handleUpdateUrlByFilters();
    await handleFetchStories(newFilters);
    store.isExploreFetching(false);
  };

  const handleUpdateUrlByFilters = async (): Promise<
    ExploreStoryFilters | undefined
  > => {
    if (!window.location.search.length) {
      // Append empty filters to URL
      replaceUrl(initialFilters);

      return;
    }

    // Update current filters from URL (if any)
    const urlParams = window.location.search.replace("?", "");
    const parsedFilters: ExploreStoryFilters = parseQueryString(urlParams);

    Object.keys(parsedFilters).forEach((key: keyof ExploreStoryFilters) => {
      const value = parsedFilters[key];
      store.updateFilters(key, value);
    });
    store.setActiveFiltersCount(getActiveFiltersCount(parsedFilters));

    return parsedFilters;
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

  const handleFilterStories = async () => {
    store.applyFilters(filteredStories);
    store.setActiveFiltersCount(activeFiltersCount);
    replaceUrl(filters);
    await handleFetchStories();
  };

  const handleClearFilters = async () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
    store.toggleFiltersPanel(false);
    replaceUrl(initialFilters);
    await handleFetchStories(initialFilters);
  };

  const handleFetchStories = async (
    newFilters?: ExploreStoryFilters
  ): Promise<void> => {
    const updatedFilters = newFilters ?? filters;
    store.isExploreFetching(true);
    try {
      const response = await axios.get(END_POINTS.STORIES.GET_ALL_STORIES, {
        params: {
          filters: JSON.stringify(updatedFilters),
          page: 1,
        },
      });

      store.updateStories(response.data);

      if (APP_CONSTANTS.IS_DEV_LOCAL_SERVER) {
        console.log("ℹ️  fetchAllStories:>>>", { storiesList: response.data });
      }

      store.isExploreFetching(false);
    } catch (error) {
      store.isExploreFetching(false);

      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    }
  };

  return {
    setUp,
    handleSortStories,
    handleClearFilters,
    handleFilterStories,
    handleUpdateFilters,
    handleFetchStories,
    handleToggleFiltersPanel,
    handleUpdateUrlByFilters,
  };
};
