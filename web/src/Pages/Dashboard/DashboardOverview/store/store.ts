import {
  DashboardOverviewState,
  getDashboardOverviewInitialState,
} from "./state";

import { useState } from "react";

export interface DashboardOverviewStore {
  state: DashboardOverviewState;
  setIsFetching: (isFetching: boolean) => void;
  setUsersCount: (usersCount: number) => void;
  setStoriesCount: (storiesCount: number) => void;
}

const useDashboardOverviewStore = (): DashboardOverviewStore => {
  const initialState = getDashboardOverviewInitialState();
  const [state, setState] = useState<DashboardOverviewState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setUsersCount = (usersCount: number) => {
    setState((prev) => ({
      ...prev,
      usersCount,
    }));
  };

  const setStoriesCount = (storiesCount: number) => {
    setState((prev) => ({
      ...prev,
      storiesCount,
    }));
  };

  return {
    state,
    setIsFetching,
    setUsersCount,
    setStoriesCount,
  };
};

export default useDashboardOverviewStore;
