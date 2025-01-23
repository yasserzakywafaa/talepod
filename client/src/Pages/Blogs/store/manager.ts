import {
  ApiRequestParams,
  ApiResponseWithPaging,
  PagingInfo,
} from "src/shared/types";
import axios, { AxiosResponse } from "axios";

import { Blog } from "src/Pages/Blog/store/state";
import { BlogsStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { scrollToTop } from "src/shared/utils/scrollTo";

export interface BlogsManager {
  setUp: () => void;
  handleGetBlogsByPage: (pageNumber: number) => Promise<void>;
  handleFetchBlogs: (pagingInfo: PagingInfo) => Promise<void>;
}

export const useBlogsManager = (store: BlogsStore): BlogsManager => {
  const { pagingInfo } = store.state;

  const setUp = async () => {
    store.isBlogsFetching(true);
    await handleFetchBlogs(pagingInfo);
    store.isBlogsFetching(false);
  };

  const handleGetBlogsByPage = async (pageNumber: number) => {
    store.updatePageNumber(pageNumber);
    const updatedFilters = {
      pageNumber,
      pageSize: pagingInfo.pageSize,
    };
    // replaceUrl(updatedFilters);
    await handleFetchBlogs(updatedFilters);
    scrollToTop();
  };

  const handleFetchBlogs = async (pagingInfo: PagingInfo): Promise<void> => {
    store.isBlogsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Blog[]>> =
        await axios.get(END_POINTS.BLOGS.GET_ALL_BLOGS, {
          params: {
            pagingInfo: JSON.stringify(pagingInfo),
          } as ApiRequestParams,
        });
      store.updatePagingInfo(response.data.paging);
      store.updateBlogs(response.data.results);
    } catch (error) {
      throw new Error(`❌ Failed to fetch Blogs :>>> ${error}`);
    } finally {
      store.isBlogsFetching(false);
    }
  };

  return {
    setUp,
    handleGetBlogsByPage,
    handleFetchBlogs,
  };
};
