import { Blog, BlogInitialState, getBlogInitialState } from "./state";

import { useState } from "react";

export interface BlogStore {
  state: BlogInitialState;
  setIsFetching: (isFetching: boolean) => void;
  updateBlog: (blog: Blog | undefined) => void;
}

const useBlogStore = (): BlogStore => {
  const initialState = getBlogInitialState();
  const [state, setState] = useState<BlogInitialState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updateBlog = (blog: Blog) => {
    setState((prev) => ({
      ...prev,
      blog,
    }));
  };

  return {
    state,
    setIsFetching,
    updateBlog,
  };
};

export default useBlogStore;
