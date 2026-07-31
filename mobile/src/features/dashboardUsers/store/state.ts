import type { PagingInfo } from "src/shared/types/api";
import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

export interface DashboardUsersState {
  isFetching: boolean;
  /** A row-level action is running; the list stays visible while it does. */
  isMutating: boolean;
  users: User[];
  paging: PagingInfo;
  feedback: AdminFeedback | null;
}

export const getDashboardUsersInitialState = (): DashboardUsersState => ({
  isFetching: true,
  isMutating: false,
  users: [],
  paging: {
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
  },
  feedback: null,
});
