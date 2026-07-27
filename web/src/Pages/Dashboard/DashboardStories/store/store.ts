import {
  DashboardStoriesState,
  getDashboardStoriesInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";
import { useState } from "react";

export interface DashboardStoriesStore {
  state: DashboardStoriesState;
  setIsFetching: (isFetching: boolean) => void;
  setStories: (stories: Story[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardStoriesStore = (): DashboardStoriesStore => {
  const initialState = getDashboardStoriesInitialState();
  const [state, setState] = useState<DashboardStoriesState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setStories = (stories: Story[]) => {
    setState((prev) => ({
      ...prev,
      stories,
    }));
  };

  const setPaging = (paging: PagingInfo) => {
    setState((prev) => ({
      ...prev,
      paging,
    }));
  };

  return {
    state,
    setIsFetching,
    setStories,
    setPaging,
  };
};

export default useDashboardStoriesStore;
