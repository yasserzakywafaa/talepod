import type { User } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

export interface DashboardUserState {
  isFetching: boolean;
  isMutating: boolean;
  user: User | null;
  storiesCount: number;
  feedback: AdminFeedback | null;
  /**
   * Distinguishes "this account does not exist" from "we could not ask" —
   * without it a dead API renders as "User Not Found".
   */
  loadError: RequestErrorKind | null;
}

export const getDashboardUserInitialState = (): DashboardUserState => ({
  isFetching: true,
  isMutating: false,
  user: null,
  storiesCount: 0,
  feedback: null,
  loadError: null,
});
