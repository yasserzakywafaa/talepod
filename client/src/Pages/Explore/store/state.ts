import { Story } from "src/application/shared/interfaces";

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
