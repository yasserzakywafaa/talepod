import { BlogsStore } from "./store";

export interface BlogsManager {
  setUp: () => void;
}

export const useBlogsManager = (store: BlogsStore): BlogsManager => {
  const setUp = (): void => {
    store.isFetching(false);
  };

  return {
    setUp,
  };
};
