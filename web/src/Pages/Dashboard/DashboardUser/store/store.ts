import { DashboardUserState, getDashboardUserInitialState } from "./state";

import { User } from "src/shared/types/user";
import { useState } from "react";

export interface DashboardUserStore {
  state: DashboardUserState;
  setIsFetching: (isFetching: boolean) => void;
  setUser: (user: User | null) => void;
  setStoriesCount: (count: number) => void;
}

const useDashboardUserStore = (): DashboardUserStore => {
  const initialState = getDashboardUserInitialState();
  const [state, setState] = useState<DashboardUserState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  const setStoriesCount = (count: number) => {
    setState((prev) => ({
      ...prev,
      storiesCount: count,
    }));
  };

  return {
    state,
    setIsFetching,
    setUser,
    setStoriesCount,
  };
};

export default useDashboardUserStore;
