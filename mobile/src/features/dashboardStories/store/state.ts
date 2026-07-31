import type { StoryFilterValues } from "src/components/brand/StoryFiltersSheet";
import type { Story } from "src/features/storyCreator/store/state";
import type { PagingInfo } from "src/shared/types/api";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";

export interface DashboardStoriesState {
  isFetching: boolean;
  isMutating: boolean;
  stories: Story[];
  paging: PagingInfo;
  feedback: AdminFeedback | null;
  /** Same filter shape the Library and My Stories lists use. */
  filters: StoryFilterValues;
  isFiltersPanelOpen: boolean;
  activeFiltersCount: number;
}

export const getDashboardStoriesInitialFilters = (): StoryFilterValues => ({
  name: "",
  gender: "",
  age: [],
  language: [],
  moral: [],
  tone: [],
  environment: [],
  audio: undefined,
  createdByAdmin: undefined,
});

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
  filters: getDashboardStoriesInitialFilters(),
  isFiltersPanelOpen: false,
  activeFiltersCount: 0,
});
