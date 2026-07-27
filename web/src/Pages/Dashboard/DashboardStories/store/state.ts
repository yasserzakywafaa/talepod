import { PagingInfo } from "src/shared/types/types";
import { Story } from "src/components/StoryCreator/store/state";

export interface DashboardStoriesState {
  isFetching: boolean;
  stories: Story[];
  paging: PagingInfo;
}

export const getDashboardStoriesInitialState = (): DashboardStoriesState => {
  return {
    isFetching: false,
    stories: [],
    paging: {
      pageNumber: 1,
      pageSize: 20,
      totalCount: 0,
    },
  };
};
