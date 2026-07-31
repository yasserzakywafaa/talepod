import type { PagingInfo } from "src/shared/types/api";
import type { User, UserRole, UserStatus } from "src/shared/types/user";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

/**
 * What an admin actually needs to find someone: a name, an email, a phone
 * number, or a whole class of account. `""` means "any" for role and status.
 */
export interface DashboardUsersFilters {
  search: string;
  role: UserRole | "";
  status: UserStatus | "";
}

export interface DashboardUsersState {
  isFetching: boolean;
  /** A row-level action is running; the list stays visible while it does. */
  isMutating: boolean;
  users: User[];
  paging: PagingInfo;
  feedback: AdminFeedback | null;
  /** Set when the list could not load at all, so the screen can explain why. */
  loadError: RequestErrorKind | null;
  filters: DashboardUsersFilters;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
}

export const getDashboardUsersInitialFilters = (): DashboardUsersFilters => ({
  search: "",
  role: "",
  status: "",
});

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
  loadError: null,
  filters: getDashboardUsersInitialFilters(),
  isFiltersPanelOpen: false,
  activeFiltersCount: 0,
});
