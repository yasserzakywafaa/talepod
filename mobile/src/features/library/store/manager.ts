import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import type { Story } from "src/features/storyCreator/store/state";
import type {
  ApiRequestParams,
  ApiResponseWithPaging,
} from "src/shared/types/api";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";

import type { LibraryStore } from "./store";
import {
  getLibraryInitialState,
  type LibraryStoriesSource,
  type LibraryStoryFilters,
} from "./state";

export interface LibraryManager {
  setUp: () => Promise<void>;
  handleSortStories: () => void;
  handleClearFilters: () => Promise<void>;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleSetStoriesSource: (source: LibraryStoriesSource) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof name],
  ) => void;
  handleFilterStories: () => Promise<void>;
  handleFetchStories: (
    newFilters?: FetchStoryFilters,
    hasActiveFilters?: boolean,
    source?: LibraryStoriesSource,
  ) => Promise<void>;
}

type FetchStoryFilters = LibraryStoryFilters & {
  pageNumber?: number;
  pageSize?: number;
};

const getSourceEndpoint = (source: LibraryStoriesSource) => {
  if (source === "talepod") return END_POINTS.STORIES.GET_ORIGINAL_STORIES;
  return END_POINTS.STORIES.GET_COMMUNITY_STORIES;
};

export const useLibraryManager = (store: LibraryStore): LibraryManager => {
  const { filters, pagingInfo, storiesSource } = store.state;
  const { pagingInfo: initialPagingInfo } = getLibraryInitialState();

  const handleFetchStories = async (
    newFilters: FetchStoryFilters = filters,
    hasActiveFilters?: boolean,
    source: LibraryStoriesSource = storiesSource,
  ): Promise<void> => {
    store.isLibraryFetching(true);

    const endpoint = getSourceEndpoint(source);
    const requestFilters = {
      ...newFilters,
      pageNumber: newFilters.pageNumber ?? pagingInfo.pageNumber,
      pageSize: newFilters.pageSize ?? pagingInfo.pageSize,
    };

    try {
      const { data } = await api.get<ApiResponseWithPaging<Story[]>>(endpoint, {
        params: {
          filters: JSON.stringify(requestFilters),
          hasActiveFilters,
        } as ApiRequestParams,
      });

      store.updatePagingInfo(data.paging);
      const page = requestFilters.pageNumber ?? 1;
      const previous = store.state.stories;
      store.updateStories(
        page > 1 ? [...previous, ...data.results] : data.results,
      );
    } finally {
      store.isLibraryFetching(false);
    }
  };

  const setUp = async () => {
    await handleFetchStories(
      {
        ...filters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: initialPagingInfo.pageSize,
      },
      false,
      storiesSource,
    );
  };

  const handleSortStories = () => {
    store.sortStories();
  };

  const handleClearFilters = async () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
    store.toggleFiltersPanel(false);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    const resetFilters = getLibraryInitialState().filters;
    await handleFetchStories(
      {
        ...resetFilters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: initialPagingInfo.pageSize,
      },
      false,
      storiesSource,
    );
  };

  const handleGetStoriesByPage = async (pageNumber: number) => {
    store.updatePageNumber(pageNumber);
    await handleFetchStories(
      {
        ...filters,
        pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      store.state.activeFiltersCount > 0,
      storiesSource,
    );
  };

  const handleToggleFiltersPanel = (isOpen: boolean) => {
    store.toggleFiltersPanel(isOpen);
  };

  const handleUpdateFilters = (
    name: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof name],
  ) => {
    store.updateFilters(name, value);
  };

  /** Applies the pending filter selection and reloads from page one. */
  const handleFilterStories = async () => {
    const activeFiltersCount = countActiveFilters(filters);
    store.setActiveFiltersCount(activeFiltersCount);
    store.toggleFiltersPanel(false);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    await handleFetchStories(
      {
        ...filters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      activeFiltersCount > 0,
      storiesSource,
    );
  };

  const handleSetStoriesSource = async (newSource: LibraryStoriesSource) => {
    if (newSource === storiesSource) return;
    store.setStoriesSource(newSource);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    await handleFetchStories(
      {
        ...filters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      store.state.activeFiltersCount > 0,
      newSource,
    );
  };

  return {
    setUp,
    handleSortStories,
    handleClearFilters,
    handleGetStoriesByPage,
    handleSetStoriesSource,
    handleToggleFiltersPanel,
    handleUpdateFilters,
    handleFilterStories,
    handleFetchStories,
  };
};
