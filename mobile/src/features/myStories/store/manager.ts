import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { useApplicationContext } from "src/application/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";
import type {
  ApiRequestParams,
  ApiResponseWithPaging,
} from "src/shared/types/api";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";

import type { MyStoriesStore } from "./store";
import { getMyStoriesInitialState, type MyStoriesStoryFilters } from "./state";

export interface MyStoriesManager {
  setUp: () => Promise<void>;
  handleClearFilters: () => Promise<void>;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof name],
  ) => void;
  handleFilterStories: () => Promise<void>;
  handleFetchStories: (filters?: MyStoriesStoryFilters) => Promise<void>;
}

export const useMyStoriesManager = (store: MyStoriesStore): MyStoriesManager => {
  const { filters, pagingInfo } = store.state;
  const { pagingInfo: initialPagingInfo } = getMyStoriesInitialState();

  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const handleFetchStories = async (
    newFilters: MyStoriesStoryFilters = filters,
    hasActiveFilters = false,
  ): Promise<void> => {
    if (!user?._id) {
      store.isMyStoriesFetching(false);
      return;
    }

    store.isMyStoriesFetching(true);

    const requestFilters = {
      ...newFilters,
      pageNumber: newFilters.pageNumber ?? pagingInfo.pageNumber,
      pageSize: newFilters.pageSize ?? pagingInfo.pageSize,
    };

    try {
      const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
        END_POINTS.STORIES.GET_ALL_USER_STORIES,
        {
          params: {
            filters: JSON.stringify(requestFilters),
            hasActiveFilters,
            userId: user._id,
          } as ApiRequestParams & { userId: string },
        },
      );

      store.updatePagingInfo(data.paging);
      const page = requestFilters.pageNumber ?? 1;
      const previous = store.state.stories;
      store.updateStories(
        page > 1 ? [...previous, ...data.results] : data.results,
      );
    } finally {
      store.isMyStoriesFetching(false);
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
    );
  };

  const handleToggleFiltersPanel = (isOpen: boolean) => {
    store.toggleFiltersPanel(isOpen);
  };

  const handleUpdateFilters = (
    name: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof name],
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
    );
  };

  const handleClearFilters = async () => {
    store.clearFilters();
    store.toggleFiltersPanel(false);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    const resetFilters = getMyStoriesInitialState().filters;
    await handleFetchStories(
      {
        ...resetFilters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: initialPagingInfo.pageSize,
      },
      false,
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
    );
  };

  return {
    setUp,
    handleClearFilters,
    handleGetStoriesByPage,
    handleToggleFiltersPanel,
    handleUpdateFilters,
    handleFilterStories,
    handleFetchStories,
  };
};
