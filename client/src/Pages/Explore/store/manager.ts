import { ApiRequestParams, ApiResponseWithPaging } from "src/shared/types";
import { ExploreStoryFilters, getExploreInitialState } from "./state";
import axios, { AxiosResponse } from "axios";
import { parseQueryString, replaceUrl } from "src/shared/utils/url";

import END_POINTS from "src/application/shared/endpoints";
import { ExploreStore } from "./store";
import { Story } from "src/components/StoryCreator/store/state";
import { useFiltersPanel } from "../features/FiltersPanel/useFiltersPanel";

export interface ExploreManager {
  setUp: () => Promise<void>;
  handleSortStories: () => void;
  handleClearFilters: () => void;
  handleResetFilters: () => void;
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
  const { filters: initFilters, pagingInfo: initPagingInfo } =
    getExploreInitialState();
  const initialFilters = { ...initFilters, ...initPagingInfo };
  const { activeFiltersCount, getActiveFiltersCount } =
    useFiltersPanel(filters);

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
    store.applyFilters(stories);
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

  const handleResetFilters = () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
  };

  const handleFetchStories = async (
    newFilters?: ExploreStoryFilters
  ): Promise<void> => {
    const updatedFilters = newFilters ?? filters;
    // const pageSize = parseInt(getUrlParams("pageSize")) || 20;
    // const pageNumber = parseInt(getUrlParams("pageNumber")) || 1;

    store.isExploreFetching(true);
    try {
      const response: AxiosResponse<ApiResponseWithPaging<Story[]>> =
        await axios.get(END_POINTS.STORIES.GET_ALL_STORIES, {
          params: {
            filters: JSON.stringify(updatedFilters),
            // pageSize,
            // pageNumber,
          } as ApiRequestParams,
        });
      store.updateStories(response.data.results);
    } catch (error) {
      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    } finally {
      store.isExploreFetching(false);
    }
  };

  return {
    setUp,
    handleSortStories,
    handleClearFilters,
    handleResetFilters,
    handleFilterStories,
    handleUpdateFilters,
    handleFetchStories,
    handleToggleFiltersPanel,
    handleUpdateUrlByFilters,
  };
};
