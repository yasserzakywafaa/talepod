import type { StoryFilterValues } from "src/components/brand/StoryFiltersSheet";
import type { Story } from "src/features/storyCreator/store/state";
import type { PagingInfo } from "src/shared/types/api";
import type { AdminFeedback } from "src/features/dashboardShared/adminFeedback";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

export interface DashboardStoriesState {
  isFetching: boolean;
  isMutating: boolean;
  stories: Story[];
  paging: PagingInfo;
  feedback: AdminFeedback | null;
  /** Set when the list could not load at all, so the screen can explain why. */
  loadError: RequestErrorKind | null;
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
  loadError: null,
  filters: getDashboardStoriesInitialFilters(),
  isFiltersPanelOpen: false,
  activeFiltersCount: 0,
});
