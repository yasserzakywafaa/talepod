import { BlogsInitialState, getBlogsInitialState } from "./state";

import { Blog } from "src/Pages/Blog/store/state";
import { PagingInfo } from "src/shared/types";
import { useState } from "react";

export interface BlogsStore {
  state: BlogsInitialState;
  isBlogsFetching: (isFetching: boolean) => void;
  updateBlogs: (stories: Blog[]) => void;
  updatePageNumber: (pageNumber: number) => void;
  updatePagingInfo: (pagingInfo: PagingInfo) => void;
}

const useBlogsStore = (): BlogsStore => {
  const initialState = getBlogsInitialState();
  const [state, setState] = useState<BlogsInitialState>(initialState);

  const isBlogsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updateBlogs = (blogs: Blog[]) => {
    setState((prev) => ({
      ...prev,
      blogs,
    }));
  };

  const updatePageNumber = (pageNumber: number) => {
    setState((prev) => ({
      ...prev,
      pagingInfo: {
        ...prev.pagingInfo,
        pageNumber,
      },
    }));
  };

  const updatePagingInfo = (pagingInfo: PagingInfo) => {
    setState((prev) => ({
      ...prev,
      pagingInfo,
    }));
  };

  return {
    state,
    isBlogsFetching,
    updateBlogs,
    updatePageNumber,
    updatePagingInfo,
  };
};

export default useBlogsStore;
