import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { getRequestErrorKind } from "src/shared/api/getRequestErrorKind";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { queryKeys } from "src/shared/api/queryKeys";
import type { ApiRequestParams, ApiResponseWithPaging } from "src/shared/types/api";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";
import type { Story } from "src/features/storyCreator/store/state";

export type LibraryStoriesSource = "community" | "talepod" | "users";

export interface LibraryStoryFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  audio: boolean | undefined;
}

export const emptyLibraryFilters = (): LibraryStoryFilters => ({
  name: "",
  gender: "",
  age: [],
  language: [],
  moral: [],
  tone: [],
  environment: [],
  audio: false,
});

const PAGE_SIZE = 20;

const getSourceEndpoint = (source: LibraryStoriesSource): string =>
  source === "talepod"
    ? END_POINTS.STORIES.GET_ORIGINAL_STORIES
    : END_POINTS.STORIES.GET_COMMUNITY_STORIES;

const fetchStoriesPage = async (
  source: LibraryStoriesSource,
  filters: LibraryStoryFilters,
  pageNumber: number,
): Promise<ApiResponseWithPaging<Story[]>> => {
  const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
    getSourceEndpoint(source),
    {
      params: {
        filters: JSON.stringify({ ...filters, pageNumber, pageSize: PAGE_SIZE }),
        hasActiveFilters: countActiveFilters(filters) > 0,
      } as ApiRequestParams,
    },
  );
  return data;
};

export interface UseLibraryStories {
  stories: Story[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  loadError: RequestErrorKind | null;
  loadMore: () => void;
  retry: () => void;

  source: LibraryStoriesSource;
  setSource: (source: LibraryStoriesSource) => void;

  /** The values bound to the filter sheet, before the user applies them. */
  draftFilters: LibraryStoryFilters;
  updateDraftFilter: <K extends keyof LibraryStoryFilters>(
    key: K,
    value: LibraryStoryFilters[K],
  ) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  activeFiltersCount: number;

  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (isOpen: boolean) => void;
}

/**
 * The library list.
 *
 * The split here is the point of the whole migration: **server** state — the
 * pages, whether a fetch is in flight, whether it failed — belongs to React
 * Query, which already handles caching, deduplication, retry and refetch on
 * reconnect. **Client** state — the unapplied filter draft, whether the sheet
 * is open — is plain `useState`, because nothing outside this screen needs it.
 *
 * What this replaced: a `store`/`manager`/`state`/`Provider` quartet that
 * hand-rolled `isFetching` flags, manual page merging, and a bespoke
 * in-flight-request dedupe, and refetched the whole list from scratch on
 * every visit.
 */
export const useLibraryStories = (): UseLibraryStories => {
  const [source, setSourceState] = useState<LibraryStoriesSource>("community");
  const [draftFilters, setDraftFilters] = useState<LibraryStoryFilters>(
    emptyLibraryFilters,
  );
  // Only applied filters are part of the query key. Typing in the sheet must
  // not fire a request on every keystroke.
  const [appliedFilters, setAppliedFilters] = useState<LibraryStoryFilters>(
    emptyLibraryFilters,
  );
  const [isFiltersPanelOpen, setFiltersPanelOpen] = useState(false);

  const query = useInfiniteQuery({
    queryKey: queryKeys.stories.library(source, appliedFilters),
    queryFn: ({ pageParam }) =>
      fetchStoriesPage(source, appliedFilters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageNumber, totalPagesCount } = lastPage.paging;
      if (!totalPagesCount || pageNumber >= totalPagesCount) return undefined;
      return pageNumber + 1;
    },
  });

  // Pages arrive separately and are flattened for the list. `useMemo` keeps
  // FlatList's `data` reference stable so it does not re-render every row on
  // an unrelated state change.
  const stories = useMemo(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );

  const setSource = useCallback((nextSource: LibraryStoriesSource) => {
    // Switching source swaps the query key; any previously loaded pages for
    // the other source stay cached and come back instantly.
    setSourceState(nextSource);
  }, []);

  const updateDraftFilter = useCallback(
    <K extends keyof LibraryStoryFilters>(
      key: K,
      value: LibraryStoryFilters[K],
    ) => {
      setDraftFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setFiltersPanelOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const cleared = emptyLibraryFilters();
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
    setFiltersPanelOpen(false);
  }, []);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  return {
    stories,
    isLoading: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: Boolean(query.hasNextPage),
    // Only a total failure is worth taking over the screen. If some pages
    // loaded, the list still shows and the error stays out of the way.
    loadError:
      query.isError && stories.length === 0
        ? getRequestErrorKind(query.error)
        : null,
    loadMore,
    retry: () => void query.refetch(),

    source,
    setSource,

    draftFilters,
    updateDraftFilter,
    applyFilters,
    clearFilters,
    activeFiltersCount: countActiveFilters(appliedFilters),

    isFiltersPanelOpen,
    setFiltersPanelOpen,
  };
};
