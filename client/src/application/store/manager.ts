import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "../shared/app_constants";
import { ApplicationStore } from "./store";
import { Authentication } from "./state";
import END_POINTS from "../shared/endpoints";
import { User } from "src/shared/user";
import { getAxiosError } from "src/shared/utils/getAxiosError";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleSetAuthInfo: (authInfo: Authentication) => void;
  handleFetchUserInfo: (userId: string) => Promise<User>;
}

export const useApplicationManager = (
  store: ApplicationStore
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  const handleSetAuthInfo = (authInfo: Authentication) => {
    const { USER, AUTHENTICATED } = APP_CONSTANTS.LOCAL_STORAGE;
    localStorage.setItem(USER, JSON.stringify(authInfo.user));
    localStorage.setItem(AUTHENTICATED, JSON.stringify(!!authInfo.user));
    // store.updateAuthInfo(authInfo);
    store.updateAuthInfo();
  };

  const handleFetchUserInfo = async (userId: string): Promise<User> => {
    // store.handleIsFetchingUserInfo(true);
    try {
      const response: AxiosResponse<User, User> = await axios.get(
        END_POINTS.AUTH.USER_INFO,
        {
          params: {
            _id: userId,
          },
        }
      );

      return response.data;
    } catch (error) {
      getAxiosError(error);
      throw new Error(`❌  Failed to get User Information!  ${error}`);
    } finally {
      // store.handleIsFetchingUserInfo(false);
    }
  };

  return {
    handleIsFetching,
    handleSetAuthInfo,
    handleFetchUserInfo,
  };
};
