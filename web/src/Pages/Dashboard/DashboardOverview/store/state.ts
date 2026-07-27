export interface DashboardOverviewState {
  isFetching: boolean;
  usersCount: number | null;
  storiesCount: number | null;
}

export const getDashboardOverviewInitialState = (): DashboardOverviewState => {
  return {
    isFetching: false,
    usersCount: null,
    storiesCount: null,
  };
};
