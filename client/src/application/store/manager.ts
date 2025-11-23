import {
  Authentication,
  getApplicationInitialState,
  getThemePreference,
} from "./state";
import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "../shared/app_constants";
import { ApplicationStore } from "./store";
import END_POINTS from "../shared/endpoints";
import { User } from "src/shared/types/user";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { getClientIdFromGoogleAnalyticsCookie } from "src/shared/utils/cookies";
import { getLocalStorageAuthItems } from "src/shared/utils/localstorage";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleSetAuthInfo: (authInfo: Authentication) => void;
  handleFetchUserInfo: (userId: string) => Promise<User>;
  handleInitialAuthentication: () => Promise<void>;
}

export const useApplicationManager = (
  store: ApplicationStore
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  const handleSetAuthInfo = (authInfo: Authentication) => {
    const { USER, AUTHENTICATED: IS_AUTHENTICATED } =
      APP_CONSTANTS.LOCAL_STORAGE;
    localStorage.setItem(USER, JSON.stringify(authInfo.user));
    localStorage.setItem(IS_AUTHENTICATED, JSON.stringify(!!authInfo.user));
    store.updateAuthInfo(authInfo);
  };

  const handleFetchUserInfo = async (userId: string): Promise<User> => {
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
    }
  };

  const handleInitialAuthentication = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    // Apply initial theme (will be updated if user is authenticated)
    const initialTheme = getThemePreference(storedAuthInfo.user);
    document.body.classList.remove(
      APP_CONSTANTS.APP_THEME_CLASS.DARK,
      APP_CONSTANTS.APP_THEME_CLASS.LIGHT
    );
    document.body.classList.add(
      initialTheme === "dark"
        ? APP_CONSTANTS.APP_THEME_CLASS.DARK
        : APP_CONSTANTS.APP_THEME_CLASS.LIGHT
    );

    if (!storedAuthInfo.isAuthenticated) {
      // User is not logged in, set initial auth state
      handleSetAuthInfo(getApplicationInitialState().auth);
    } else {
      // User is already logged in, update auth state
      const userId = storedAuthInfo.user?._id;
      if (userId) {
        const fetchedUser = await handleFetchUserInfo(userId);

        handleSetAuthInfo({
          isAuthenticated: true,
          user: fetchedUser,
        });

        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser)
        );
      }
    }
    store.handleIsFetchingUserInfo(false);

    // Google Analytics Tracking
    const gaClientId = getClientIdFromGoogleAnalyticsCookie();
    if (gaClientId) {
      store.setTrackingInfo({
        clientId: gaClientId,
      });
    }
  };

  return {
    handleIsFetching,
    handleSetAuthInfo,
    handleFetchUserInfo,
    handleInitialAuthentication,
  };
};
