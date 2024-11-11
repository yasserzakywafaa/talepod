import { BlogInitialState, getBlogInitialState } from "./state";

import { useState } from "react";

export interface BlogStore {
  state: BlogInitialState;
  isFetching: (isFetching: boolean) => void;
}

const useBlogStore = (): BlogStore => {
  const initialState = getBlogInitialState();
  const [state, setState] = useState<BlogInitialState>(initialState);

  const isFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  return {
    state,
    isFetching,
  };
};

export default useBlogStore;
