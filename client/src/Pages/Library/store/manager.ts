import {
  ApiRequestParams,
  ApiResponseWithPaging,
} from "src/shared/types/types";
import {
  LibraryStoriesSource,
  LibraryStoryFilters,
  getLibraryInitialState,
} from "./state";
import axios, { AxiosResponse } from "axios";
import { parseQueryString, replaceUrl } from "src/shared/utils/url";

import END_POINTS from "src/application/shared/endpoints";
import { LibraryStore } from "./store";
import { Story } from "src/components/StoryCreator/store/state";
import { scrollToTop } from "src/shared/utils/scrollTo";
import { useFiltersPanel } from "../features/FiltersPanel/useFiltersPanel";

export interface LibraryManager {
  handleSortStories: () => void;
  handleClearFilters: () => void;
  handleResetFilters: () => void;
  handleFilterStories: () => void;
  handleUpdateUrlByFilters: (initialSource: LibraryStoriesSource) => {
    parsedFilters: LibraryStoryFilters;
    newActiveFiltersCount: number;
    source: LibraryStoriesSource;
    pageNumber: number;
    pageSize: number;
  };
  setUp: (storiesSource: LibraryStoriesSource) => Promise<void>;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleSetStoriesSource: (storiesSource: LibraryStoriesSource) => Promise<void>;
  handleFetchStories: (
    filters?: FetchStoryFilters,
    hasActiveFilters?: boolean,
    storiesSource?: LibraryStoriesSource,
  ) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof name],
  ) => void;
}

type ParsedLibrarySearchParams = Partial<LibraryStoryFilters> & {
  pageNumber?: number;
  pageSize?: number;
  source?: LibraryStoriesSource;
};

type FetchStoryFilters = LibraryStoryFilters & {
  pageNumber?: number;
  pageSize?: number;
};

export const useLibraryManager = (store: LibraryStore): LibraryManager => {
  const { stories, filters, pagingInfo, storiesSource } = store.state;
  const { filters: initialFilters, pagingInfo: initialPagingInfo } =
    getLibraryInitialState(false);
  const { activeFiltersCount, getActiveFiltersCount } = useFiltersPanel(filters);

  const getSourceEndpoint = (source: LibraryStoriesSource) => {
    if (source === "users") return END_POINTS.STORIES.GET_USERS_STORIES;
    if (source === "talepod") return END_POINTS.STORIES.GET_ORIGINAL_STORIES;
    return END_POINTS.STORIES.GET_COMMUNITY_STORIES;
  };

  const getUrlPayload = (
    updatedFilters: LibraryStoryFilters,
    source: LibraryStoriesSource,
    pageNumber: number,
    pageSize: number,
  ) => {
    return {
      ...updatedFilters,
      source,
      pageNumber,
      pageSize,
    };
  };

  const setUp = async (initialSource: LibraryStoriesSource) => {
    store.isLibraryFetching(true);
    const { parsedFilters, newActiveFiltersCount, source, pageNumber, pageSize } =
      handleUpdateUrlByFilters(initialSource);
    await handleFetchStories(
      {
        ...parsedFilters,
        pageNumber,
        pageSize,
      },
      !!newActiveFiltersCount,
      source,
    );
    store.isLibraryFetching(false);
  };

  const handleUpdateUrlByFilters = (initialSource: LibraryStoriesSource) => {
    const fallbackSource = initialSource === "users" ? "users" : "community";
    if (!window.location.search.length) {
      const activeFiltersCount = getActiveFiltersCount(initialFilters);
      const source = initialSource || fallbackSource;
      store.setStoriesSource(source);
      replaceUrl(
        getUrlPayload(
          initialFilters,
          source,
          initialPagingInfo.pageNumber,
          initialPagingInfo.pageSize,
        ),
      );

      store.setActiveFiltersCount(activeFiltersCount);
      store.updatePagingInfo(initialPagingInfo);

      return {
        parsedFilters: initialFilters,
        newActiveFiltersCount: activeFiltersCount,
        source,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: initialPagingInfo.pageSize,
      };
    }

    const urlParams = window.location.search.replace("?", "");
    const parsedParams: ParsedLibrarySearchParams = parseQueryString(urlParams);
    const source =
      initialSource === "users"
        ? "users"
        : parsedParams.source || fallbackSource || "community";

    const parsedFilters: LibraryStoryFilters = {
      name:
        typeof parsedParams.name === "string"
          ? parsedParams.name
          : initialFilters.name,
      gender:
        typeof parsedParams.gender === "string"
          ? parsedParams.gender
          : initialFilters.gender,
      age: Array.isArray(parsedParams.age) ? parsedParams.age : initialFilters.age,
      language: Array.isArray(parsedParams.language)
        ? parsedParams.language
        : initialFilters.language,
      moral: Array.isArray(parsedParams.moral)
        ? parsedParams.moral
        : initialFilters.moral,
      tone: Array.isArray(parsedParams.tone)
        ? parsedParams.tone
        : initialFilters.tone,
      environment: Array.isArray(parsedParams.environment)
        ? parsedParams.environment
        : initialFilters.environment,
      audio:
        typeof parsedParams.audio === "boolean"
          ? parsedParams.audio
          : initialFilters.audio,
    };

    const pageNumber = parsedParams.pageNumber || initialPagingInfo.pageNumber;
    const pageSize = parsedParams.pageSize || initialPagingInfo.pageSize;

    Object.keys(parsedFilters).forEach((key) => {
      const typedKey = key as keyof LibraryStoryFilters;
      store.updateFilters(typedKey, parsedFilters[typedKey]);
    });

    store.setStoriesSource(source);
    store.updatePagingInfo({
      ...initialPagingInfo,
      pageNumber,
      pageSize,
    });

    replaceUrl(getUrlPayload(parsedFilters, source, pageNumber, pageSize));

    const newActiveFiltersCount = getActiveFiltersCount(parsedFilters);
    store.setActiveFiltersCount(newActiveFiltersCount);

    return {
      parsedFilters,
      newActiveFiltersCount,
      source,
      pageNumber,
      pageSize,
    };
  };

  const handleToggleFiltersPanel = (isOpen: boolean) => {
    store.toggleFiltersPanel(isOpen);
  };

  const handleSortStories = () => {
    store.sortStories();
  };

  const handleUpdateFilters = (
    name: keyof LibraryStoryFilters,
    value: LibraryStoryFilters[typeof name],
  ) => {
    store.updateFilters(name, value);
  };

  const handleFilterStories = async () => {
    store.applyFilters(stories);
    store.setActiveFiltersCount(activeFiltersCount);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    const updatedFilters = { ...filters };
    const urlPayload = getUrlPayload(
      updatedFilters,
      storiesSource,
      initialPagingInfo.pageNumber,
      pagingInfo.pageSize,
    );
    replaceUrl(urlPayload);
    await handleFetchStories(
      {
        ...updatedFilters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      !!activeFiltersCount,
      storiesSource,
    );
  };

  const handleGetStoriesByPage = async (pageNumber: number) => {
    store.updatePageNumber(pageNumber);
    const urlPayload = getUrlPayload(
      filters,
      storiesSource,
      pageNumber,
      pagingInfo.pageSize,
    );
    replaceUrl(urlPayload);
    await handleFetchStories(
      {
        ...filters,
        pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      !!activeFiltersCount,
      storiesSource,
    );
    scrollToTop();
  };

  const handleSetStoriesSource = async (newSource: LibraryStoriesSource) => {
    if (newSource === storiesSource) return;
    store.setStoriesSource(newSource);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    const urlPayload = getUrlPayload(
      filters,
      newSource,
      initialPagingInfo.pageNumber,
      pagingInfo.pageSize,
    );
    replaceUrl(urlPayload);
    await handleFetchStories(
      {
        ...filters,
        pageNumber: initialPagingInfo.pageNumber,
        pageSize: pagingInfo.pageSize,
      },
      !!activeFiltersCount,
      newSource,
    );
  };

  const handleClearFilters = async () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
    store.toggleFiltersPanel(false);
    store.updatePageNumber(initialPagingInfo.pageNumber);
    const resetFilters = getLibraryInitialState().filters;
    replaceUrl(
      getUrlPayload(
        resetFilters,
        storiesSource,
        initialPagingInfo.pageNumber,
        initialPagingInfo.pageSize,
      ),
    );
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

  const handleResetFilters = () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
    store.setStoriesSource("community");
    store.updatePagingInfo(initialPagingInfo);
  };

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
      const response: AxiosResponse<ApiResponseWithPaging<Story[]>> =
        await axios.get(endpoint, {
          params: {
            filters: JSON.stringify(requestFilters),
            hasActiveFilters,
          } as ApiRequestParams,
        });

      store.updatePagingInfo(response.data.paging);
      store.updateStories(response.data.results);
    } catch (error) {
      throw new Error(`❌ Failed to fetch Stories :>>> ${error}`);
    } finally {
      store.isLibraryFetching(false);
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
    handleGetStoriesByPage,
    handleSetStoriesSource,
    handleToggleFiltersPanel,
    handleUpdateUrlByFilters,
  };
};
