import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "../shared/app_constants";
import { ApplicationStore } from "./store";
import { Authentication } from "./state";
import END_POINTS from "../shared/endpoints";
import { User } from "src/shared/user";

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
    const { USER, IS_AUTHENTICATED } = APP_CONSTANTS.LOCAL_STORAGE;
    localStorage.setItem(USER, JSON.stringify(authInfo.user));
    localStorage.setItem(IS_AUTHENTICATED, JSON.stringify(!!authInfo.user));
    // store.updateAuthInfo(authInfo);
    store.updateAuthInfo();
  };

  const handleFetchUserInfo = async (userId: string): Promise<User> => {
    try {
      const response: AxiosResponse<User, User> = await axios.get(
        END_POINTS.AUTH.USER_INFO,
        {
          params: {
            userId,
          },
        }
      );
      handleSetAuthInfo({
        isAuthenticated: true,
        user: response.data,
      });

      return response.data;
    } catch (error) {
      throw new Error(`❌  Failed to create story SEO!  ${error}`);
    }
  };

  return {
    handleIsFetching,
    handleSetAuthInfo,
    handleFetchUserInfo,
  };
};
