import { User } from "src/shared/types/user";

export interface DashboardUserState {
  isFetching: boolean;
  user: User | null;
  storiesCount: number;
}

export const getDashboardUserInitialState = (): DashboardUserState => {
  return {
    isFetching: false,
    user: null,
    storiesCount: 0,
  };
};
