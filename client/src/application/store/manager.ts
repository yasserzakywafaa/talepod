import { ApplicationStore } from "./store";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
}

export const useApplicationManager = (
  store: ApplicationStore
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  return {
    handleIsFetching,
  };
};
