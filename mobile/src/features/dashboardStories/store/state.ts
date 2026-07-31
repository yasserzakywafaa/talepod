import type { Story } from "src/features/storyCreator/store/state";
import type { PagingInfo } from "src/shared/types/api";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

export interface DashboardStoriesState {
  isFetching: boolean;
  isMutating: boolean;
  stories: Story[];
  paging: PagingInfo;
  feedback: AdminFeedback | null;
}

export const getDashboardStoriesInitialState = (): DashboardStoriesState => ({
  isFetching: true,
  isMutating: false,
  stories: [],
  paging: {
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
  },
  feedback: null,
});
