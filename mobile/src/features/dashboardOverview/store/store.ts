import { useCallback, useState } from "react";

export interface DashboardOverviewState {
  storiesCount: number | null;
  usersCount: number | null;
  isFetching: boolean;
}

export const getDashboardOverviewInitialState = (): DashboardOverviewState => ({
  storiesCount: null,
  usersCount: null,
  isFetching: false,
});

export interface DashboardOverviewStore {
  state: DashboardOverviewState;
  setStoriesCount: (count: number | null) => void;
  setUsersCount: (count: number | null) => void;
  setIsFetching: (isFetching: boolean) => void;
}

export const useDashboardOverviewStore = (): DashboardOverviewStore => {
  const [state, setState] = useState<DashboardOverviewState>(
    getDashboardOverviewInitialState(),
  );

  const setStoriesCount = useCallback((count: number | null) => {
    setState((prev) => ({ ...prev, storiesCount: count }));
  }, []);

  const setUsersCount = useCallback((count: number | null) => {
    setState((prev) => ({ ...prev, usersCount: count }));
  }, []);

  const setIsFetching = useCallback((isFetching: boolean) => {
    setState((prev) => ({ ...prev, isFetching }));
  }, []);

  return {
    state,
    setStoriesCount,
    setUsersCount,
    setIsFetching,
  };
};
