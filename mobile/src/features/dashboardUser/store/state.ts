import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

export interface DashboardUserState {
  isFetching: boolean;
  isMutating: boolean;
  user: User | null;
  storiesCount: number;
  feedback: AdminFeedback | null;
}

export const getDashboardUserInitialState = (): DashboardUserState => ({
  isFetching: true,
  isMutating: false,
  user: null,
  storiesCount: 0,
  feedback: null,
});
