import { MyProfileStore } from "./store";

export interface MyProfileManager {
  handleUpdateMyProfileForm: (key: string, value: string) => void;
}

export const useMyProfileManager = (
  store: MyProfileStore
): MyProfileManager => {
  const handleUpdateMyProfileForm = (key: string, value: string): void => {
    store.updateMyProfileForm(key, value);
  };

  return {
    handleUpdateMyProfileForm,
  };
};
