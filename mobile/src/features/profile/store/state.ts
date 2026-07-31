export interface DashboardProfileState {
  isDeletingAccount: boolean;
}

export const getDashboardProfileInitialState = (): DashboardProfileState => ({
  isDeletingAccount: false,
});
