import axios, { AxiosResponse } from "axios";

import END_POINTS from "src/application/shared/endpoints";
import { MyProfileStore } from "./store";
import { User } from "src/shared/user";
import { useApplicationContext } from "src/application/store/Provider";

export interface MyProfileManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleUpdateUserInfo: (userInfoToUpdate: Partial<User>) => Promise<void>;
}

export const useMyProfileManager = (
  store: MyProfileStore
): MyProfileManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const handleIsFetching = (isFetching: boolean): void => {
    store.setIsFetching(isFetching);
  };

  const handleUpdateUserInfo = async (userInfoToUpdate: Partial<User>) => {
    if (!auth.user) return;

    try {
      const response: AxiosResponse<void> = await axios.post(
        END_POINTS.AUTH.UPDATE_USER_INFO,
        {
          userId: auth.user._id,
          userInfoToUpdate,
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        }
      );

      console.log("handleUpdateUserInfo:", response);

      handleIsFetching(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleIsFetching(false);
    }
  };

  return {
    handleIsFetching,
    handleUpdateUserInfo,
  };
};
