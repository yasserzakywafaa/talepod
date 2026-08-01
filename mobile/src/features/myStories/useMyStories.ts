import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { useApplicationContext } from "src/application/store/Provider";
import { getRequestErrorKind } from "src/shared/api/getRequestErrorKind";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";
import { queryKeys } from "src/shared/api/queryKeys";
import type { ApiRequestParams, ApiResponseWithPaging } from "src/shared/types/api";
import { countActiveFilters } from "src/shared/utils/countActiveFilters";
import type { Story } from "src/features/storyCreator/store/state";

export interface MyStoriesFilters {
  name: string | undefined;
  gender: string | undefined;
  age: number[];
  language: string[];
  moral: string[];
  tone: string[];
  environment: string[];
  createdByAdmin: boolean | undefined;
  audio: boolean | undefined;
}

export const emptyMyStoriesFilters = (): MyStoriesFilters => ({
  name: "",
  gender: "",
  age: [],
  language: [],
  moral: [],
  tone: [],
  environment: [],
  createdByAdmin: false,
  audio: false,
});

const PAGE_SIZE = 20;

const fetchMyStoriesPage = async (
  userId: string,
  filters: MyStoriesFilters,
  pageNumber: number,
): Promise<ApiResponseWithPaging<Story[]>> => {
  const { data } = await api.get<ApiResponseWithPaging<Story[]>>(
    END_POINTS.STORIES.GET_ALL_USER_STORIES,
    {
      params: {
        filters: JSON.stringify({ ...filters, pageNumber, pageSize: PAGE_SIZE }),
        hasActiveFilters: countActiveFilters(filters) > 0,
        userId,
      } as ApiRequestParams & { userId: string },
    },
  );
  return data;
};

export interface UseMyStories {
  stories: Story[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  loadError: RequestErrorKind | null;
  loadMore: () => void;
  retry: () => void;

  draftFilters: MyStoriesFilters;
  updateDraftFilter: <K extends keyof MyStoriesFilters>(
    key: K,
    value: MyStoriesFilters[K],
  ) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  activeFiltersCount: number;

  isFiltersPanelOpen: boolean;
  setFiltersPanelOpen: (isOpen: boolean) => void;
}

/**
 * The current user's own stories. Same shape as `useLibraryStories` — same
 * paged endpoint family, same filter-draft-vs-applied split — with one
 * difference: this list is keyed to `auth.user._id` and simply does not run
 * until a user is loaded, since "my stories" has no meaning signed out.
 */
export const useMyStories = (): UseMyStories => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const userId = auth.user?._id;

  const [draftFilters, setDraftFilters] = useState<MyStoriesFilters>(
    emptyMyStoriesFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<MyStoriesFilters>(
    emptyMyStoriesFilters,
  );
  const [isFiltersPanelOpen, setFiltersPanelOpen] = useState(false);

  const query = useInfiniteQuery({
    queryKey: queryKeys.stories.mine(appliedFilters),
    queryFn: ({ pageParam }) =>
      fetchMyStoriesPage(userId as string, appliedFilters, pageParam),
    initialPageParam: 1,
    enabled: Boolean(userId),
    getNextPageParam: (lastPage) => {
      const { pageNumber, totalPagesCount } = lastPage.paging;
      if (!totalPagesCount || pageNumber >= totalPagesCount) return undefined;
      return pageNumber + 1;
    },
  });

  const stories = useMemo(
    () => query.data?.pages.flatMap((page) => page.results) ?? [],
    [query.data],
  );

  const updateDraftFilter = useCallback(
    <K extends keyof MyStoriesFilters>(key: K, value: MyStoriesFilters[K]) => {
      setDraftFilters((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setFiltersPanelOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const cleared = emptyMyStoriesFilters();
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
    loadError:
      query.isError && stories.length === 0
        ? getRequestErrorKind(query.error)
        : null,
    loadMore,
    retry: () => void query.refetch(),

    draftFilters,
    updateDraftFilter,
    applyFilters,
    clearFilters,
    activeFiltersCount: countActiveFilters(appliedFilters),

    isFiltersPanelOpen,
    setFiltersPanelOpen,
  };
};
