import { BlogStore } from "./store";

export interface BlogManager {
  setUp: () => void;
}

export const useBlogManager = (store: BlogStore): BlogManager => {
  const setUp = (): void => {
    store.isFetching(false);
  };

  return {
    setUp,
  };
};
