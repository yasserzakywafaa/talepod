import {
  Authentication,
  getApplicationInitialState,
  getThemePreference,
} from "./state";
import axios, { AxiosResponse } from "axios";
import i18n from "i18next";

import APP_CONSTANTS from "../shared/app_constants";
import { syncI18nWithUser } from "@yasserzakywafaa/client-core";
import { ApplicationStore } from "./store";
import END_POINTS from "../shared/endpoints";
import { User } from "src/shared/types/user";
import { getAxiosError } from "src/shared/utils/getAxiosError";
import { getClientIdFromGoogleAnalyticsCookie } from "src/shared/utils/cookies";
import { getLocalStorageAuthItems } from "src/shared/utils/localstorage";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleToggleThemeMode: () => void;
  handleSetAuthInfo: (authInfo: Authentication) => void;
  /** Current session user (cookies + GET user-info). */
  handleFetchUserInfo: () => Promise<User | null>;
  /** Public profile for another user (e.g. story author). */
  handleFetchUserById: (userId: string) => Promise<User | null>;
  handleInitialAuthentication: () => Promise<void>;
  handleUpdateUserInfoInApplication: (
    userInfoToUpdate: Partial<User>,
  ) => Promise<void>;
}

export const useApplicationManager = (
  store: ApplicationStore,
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  const handleToggleThemeMode = async () => {
    store.toggleThemeMode();

    if (store.state.auth.isAuthenticated && store.state.auth.user) {
      await handleUpdateUserInfoInApplication({
        preferences: {
          ...store.state.auth.user.preferences,
          theme: store.state.themeMode === "dark" ? "light" : "dark",
        },
      });
    }
  };

  const handleSetAuthInfo = (authInfo: Authentication) => {
    const { USER, AUTHENTICATED: IS_AUTHENTICATED } =
      APP_CONSTANTS.LOCAL_STORAGE;
    localStorage.setItem(
      IS_AUTHENTICATED,
      authInfo.isAuthenticated ? "true" : "false",
    );
    localStorage.setItem(USER, JSON.stringify(authInfo.user));
    store.updateAuthInfo(authInfo);
    syncI18nWithUser(i18n, authInfo.user ?? undefined);
  };

  const handleFetchUserInfo = async (): Promise<User | null> => {
    try {
      const response: AxiosResponse<User> = await axios.get(
        END_POINTS.AUTH.USER_INFO,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get session user:", error);
      return null;
    }
  };

  const handleFetchUserById = async (
    userId: string,
  ): Promise<User | null> => {
    if (!userId) return null;
    try {
      const response: AxiosResponse<User> = await axios.get(
        END_POINTS.AUTH.USER_PROFILE(userId),
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      getAxiosError(error);
      return null;
    }
  };

  const handleInitialAuthentication = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    syncI18nWithUser(i18n, storedAuthInfo.user ?? undefined);

    const initialTheme = getThemePreference(storedAuthInfo.user);
    document.body.classList.remove(
      APP_CONSTANTS.APP_THEME_CLASS.DARK,
      APP_CONSTANTS.APP_THEME_CLASS.LIGHT,
    );
    document.body.classList.add(
      initialTheme === "dark"
        ? APP_CONSTANTS.APP_THEME_CLASS.DARK
        : APP_CONSTANTS.APP_THEME_CLASS.LIGHT,
    );

    if (!storedAuthInfo.isAuthenticated || storedAuthInfo.user === null) {
      handleSetAuthInfo(getApplicationInitialState().auth);
      store.handleIsFetchingUserInfo(false);
      const gaClientId = getClientIdFromGoogleAnalyticsCookie();
      if (gaClientId) {
        store.setTrackingInfo({ clientId: gaClientId });
      }
      return;
    }

    const fetchedUser = await handleFetchUserInfo();
    if (fetchedUser) {
      handleSetAuthInfo({
        isAuthenticated: true,
        user: fetchedUser,
      });
      localStorage.setItem(
        APP_CONSTANTS.LOCAL_STORAGE.USER,
        JSON.stringify(fetchedUser),
      );
    } else {
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "false");
      localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.USER, "null");
      handleSetAuthInfo(getApplicationInitialState().auth);
    }

    store.handleIsFetchingUserInfo(false);

    const gaClientId = getClientIdFromGoogleAnalyticsCookie();
    if (gaClientId) {
      store.setTrackingInfo({
        clientId: gaClientId,
      });
    }
  };

  const handleUpdateUserInfoInApplication = async (
    userInfoToUpdate: Partial<User>,
  ) => {
    if (!store.state.auth.user) return;

    try {
      const updatedUser: AxiosResponse<User> = await axios.post(
        END_POINTS.AUTH.UPDATE_USER_INFO,
        {
          userId: store.state.auth.user._id,
          userInfoToUpdate,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );

      handleSetAuthInfo({
        isAuthenticated: true,
        user: updatedUser.data,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    handleIsFetching,
    handleToggleThemeMode,
    handleSetAuthInfo,
    handleFetchUserInfo,
    handleFetchUserById,
    handleInitialAuthentication,
    handleUpdateUserInfoInApplication,
  };
};
