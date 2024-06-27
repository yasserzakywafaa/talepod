import { Story } from "src/components/StoryCreator/store/state";

export interface ExploreInitialState {
  isFetching: boolean;
  stories: Story[];
}

export const getExploreInitialState = (): ExploreInitialState => {
  return {
    isFetching: false,
    stories: [],
  };
};
