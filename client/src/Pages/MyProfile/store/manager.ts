import { MyProfileStore } from "./store";

export interface MyProfileManager {
  handleIsFetching: (isFetching: boolean) => void;
}

export const useMyProfileManager = (
  store: MyProfileStore
): MyProfileManager => {
  const handleIsFetching = (isFetching: boolean): void => {
    store.setIsFetching(isFetching);
  };

  return {
    handleIsFetching,
  };
};
