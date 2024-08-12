import { ApiRequestParams, ApiResponseWithPaging } from "src/shared/types";
import { MyStoriesStoryFilters, getMyStoriesInitialState } from "./state";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";
import { parseQueryString, replaceUrl } from "src/shared/utils/url";

import END_POINTS from "src/application/shared/endpoints";
import { MyStoriesStore } from "./store";
import { Story } from "src/components/StoryCreator/store/state";
import { scrollToTop } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import { useFiltersPanel } from "../features/MyStoriesFiltersPanel/useMyStoriesFiltersPanel";

export interface MyStoriesManager {
  setUp: () => Promise<void>;
  handleSortStories: () => void;
  handleClearFilters: () => void;
  handleResetFilters: () => void;
  handleFilterStories: () => void;
  handleUpdateUrlByFilters: () => void;
  handleGetStoriesByPage: (pageNumber: number) => Promise<void>;
  handleFetchStories: (filters?: MyStoriesStoryFilters) => Promise<void>;
  handleToggleFiltersPanel: (isOpen: boolean) => void;
  handleUpdateFilters: (
    name: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof name]
  ) => void;
}

interface UpdateUrlByFiltersResults {
  parsedFilters: MyStoriesStoryFilters;
  newActiveFiltersCount: number;
}

export const useMyStoriesManager = (
  store: MyStoriesStore
): MyStoriesManager => {
  const { stories, filters, pagingInfo } = store.state;
  const { filters: initialFilters, pagingInfo: initialPagingInfo } =
    getMyStoriesInitialState();
  const initialFiltersWithPaging: MyStoriesStoryFilters = {
    ...initialFilters,
    ...initialPagingInfo,
  };
  const { activeFiltersCount, getActiveFiltersCount } =
    useFiltersPanel(filters);

  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const setUp = async () => {
    store.isMyStoriesFetching(true);
    const { parsedFilters, newActiveFiltersCount } = handleUpdateUrlByFilters();
    await handleFetchStories(parsedFilters, !!newActiveFiltersCount);
    store.isMyStoriesFetching(false);
  };

  const handleUpdateUrlByFilters = (): UpdateUrlByFiltersResults => {
    if (!window.location.search.length) {
      const activeFiltersCount = getActiveFiltersCount(
        initialFiltersWithPaging
      );
      // Append empty filters to URL
      replaceUrl(initialFiltersWithPaging);
      const newFilters = {
        parsedFilters: initialFiltersWithPaging,
        newActiveFiltersCount: activeFiltersCount,
      };
      store.setActiveFiltersCount(activeFiltersCount);

      return newFilters;
    }

    // Update current filters from URL (if any)
    const urlParams = window.location.search.replace("?", "");
    const parsedFilters: MyStoriesStoryFilters = parseQueryString(urlParams);
    const newActiveFiltersCount = getActiveFiltersCount(parsedFilters);

    Object.keys(parsedFilters).forEach((key: keyof MyStoriesStoryFilters) => {
      const value = parsedFilters[key];
      store.updateFilters(key, value);
    });
    store.setActiveFiltersCount(getActiveFiltersCount(parsedFilters));

    const newFilters = {
      parsedFilters,
      newActiveFiltersCount,
    };

    return newFilters;
  };

  const handleToggleFiltersPanel = (isOpen: boolean) => {
    store.toggleFiltersPanel(isOpen);
  };

  const handleSortStories = () => {
    store.sortStories();
  };

  const handleUpdateFilters = (
    name: keyof MyStoriesStoryFilters,
    value: MyStoriesStoryFilters[typeof name]
  ) => {
    store.updateFilters(name, value);
  };

  const handleFilterStories = async () => {
    store.applyFilters(stories);
    store.setActiveFiltersCount(activeFiltersCount);
    replaceUrl(filters);
    const updatedFiltersWithPaging = {
      ...filters,
      ...initialPagingInfo,
    };
    await handleFetchStories(updatedFiltersWithPaging, !!activeFiltersCount);
  };

  const handleGetStoriesByPage = async (pageNumber: number) => {
    store.updatePageNumber(pageNumber);
    const updatedFilters = {
      ...filters,
      pageNumber,
      pageSize: pagingInfo.pageSize,
    };
    replaceUrl(updatedFilters);
    await handleFetchStories(updatedFilters, !!activeFiltersCount);
    scrollToTop();
  };

  const handleClearFilters = async () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
    store.toggleFiltersPanel(false);
    replaceUrl(initialFiltersWithPaging);
    // replaceUrl({
    //   ...initialFiltersWithPaging,
    //   language: [],
    // });
    await handleFetchStories(initialFiltersWithPaging, false);
  };

  const handleResetFilters = () => {
    store.clearFilters();
    store.setActiveFiltersCount(0);
  };

  const handleFetchStories = async (
    newFilters: MyStoriesStoryFilters,
    hasActiveFilters?: boolean
  ): Promise<void> => {
    const updatedFilters = newFilters ?? filters;
    store.isMyStoriesFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Story[]>> =
        await axios.get(END_POINTS.STORIES.GET_ALL_USER_STORIES, {
          params: {
            filters: JSON.stringify(updatedFilters),
            hasActiveFilters,
            userId: auth.user && auth.user._id,
          } as ApiRequestParams,
        });
      store.updatePagingInfo(response.data.paging);
      store.updateStories(response.data.results);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: `Oops, something went wrong!`,
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.isMyStoriesFetching(false);
    }
  };

  // // FOR DEVELOPMENT USE ONLY
  //   useEffect(() => {
  //     if (stories.length) {
  //       let count = 0;
  //       stories.forEach(async (story) => {
  //         if (!story.seo) {
  //         // const storySeoPrompt = getStorySeoPrompt(story);
  //         // await handleCreateStorySeoRequest(story._id, storySeoPrompt);
  //           console.log("storySlug:>>>", { slug: story.slug });
  //         }
  //         count++;
  //       });

  //       console.log("count:>>>", { count });
  //     }
  //   }, [store.state.stories]);

  return {
    setUp,
    handleSortStories,
    handleClearFilters,
    handleResetFilters,
    handleFilterStories,
    handleUpdateFilters,
    handleFetchStories,
    handleGetStoriesByPage,
    handleToggleFiltersPanel,
    handleUpdateUrlByFilters,
  };
};
