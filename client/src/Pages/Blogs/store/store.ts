import { BlogsInitialState, getBlogsInitialState } from "./state";

import { useState } from "react";

export interface BlogsStore {
  state: BlogsInitialState;
  isFetching: (isFetching: boolean) => void;
}

const useBlogsStore = (): BlogsStore => {
  const initialState = getBlogsInitialState();
  const [state, setState] = useState<BlogsInitialState>(initialState);

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

export default useBlogsStore;
