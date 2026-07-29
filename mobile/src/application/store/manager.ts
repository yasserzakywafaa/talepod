import { useCallback, useMemo, useRef } from "react";
import type { AxiosResponse } from "axios";
import * as WebBrowser from "expo-web-browser";
import { syncI18nWithAppLanguage } from "src/shared/i18n/syncI18nWithAppLanguage";
import type { SupportedLang } from "@yasserzakywafaa/client-core";

import END_POINTS from "../shared/endpoints";
import { queueUserPreferencesUpdate } from "../shared/userPreferencesUpdateQueue";
import type { User } from "src/shared/types/user";
import { dedupedGet } from "src/shared/api/dedupedGet";
import { logApiError } from "src/shared/api/logApiError";
import { normalizeUserFromApi } from "src/shared/utils/normalizeUserFromApi";
import i18n from "src/i18n/init";
import { ensureNativeLtrForTouches } from "src/shared/utils/layoutDirection";
import { setStoredLanguage } from "src/shared/storage/preferencesStorage";
import {
  getStoredThemePreference,
  setStoredThemePreference,
} from "src/shared/storage/preferencesStorage";
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "src/shared/storage/authStorage";
import { api } from "../shared/apiClient";

import type { Authentication, ThemePreference } from "./state";
import { getApplicationInitialState, getThemePreference } from "./state";
import type { ApplicationStore } from "./store";

export interface ApplicationManager {
  handleSetAuthInfo: (
    authInfo: Authentication,
    tokens?: { accessToken: string; refreshToken: string },
  ) => Promise<void>;
  handleFetchUserInfo: () => Promise<User | null>;
  handleInitialAuthentication: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleThemePreferenceChange: (preference: ThemePreference) => Promise<void>;
  handleUpdateUserInfoInApplication: (
    userInfoToUpdate: Partial<User>,
  ) => Promise<void>;
  handleLanguageChange: (lang: SupportedLang) => Promise<void>;
}

export const useApplicationManager = (
  store: ApplicationStore,
): ApplicationManager => {
  const storeRef = useRef(store);
  storeRef.current = store;

  const handleSetAuthInfo = useCallback(
    async (
      authInfo: Authentication,
      tokens?: { accessToken: string; refreshToken: string },
    ) => {
      const stored = await getStoredAuth();
      const user = authInfo.user
        ? normalizeUserFromApi(authInfo.user)
        : authInfo.user;

      await setStoredAuth({
        isAuthenticated: authInfo.isAuthenticated,
        user,
        accessToken: tokens?.accessToken ?? stored.accessToken,
        refreshToken: tokens?.refreshToken ?? stored.refreshToken,
      });

      storeRef.current.updateAuthInfo({
        ...authInfo,
        user,
      });

      if (user) {
        const storedTheme = await getStoredThemePreference();
        storeRef.current.setThemePreference(
          storedTheme ?? getThemePreference(user) ?? "system",
        );
      }

      await syncI18nWithAppLanguage(user ?? undefined);
    },
    [],
  );

  const handleFetchUserInfo = useCallback(async (): Promise<User | null> => {
    try {
      const response: AxiosResponse<User> = await dedupedGet<User>(
        END_POINTS.AUTH.USER_INFO,
      );
      return normalizeUserFromApi(response.data);
    } catch (error) {
      logApiError("Failed to get user information", error);
      return null;
    }
  }, []);

  const handleUpdateUserInfoInApplication = useCallback(
    async (userInfoToUpdate: Partial<User>) => {
      const userId = storeRef.current.state.auth.user?._id;
      if (!userId) {
        return;
      }

      try {
        const response = await api.post<User>(
          END_POINTS.AUTH.UPDATE_USER_INFO,
          {
            userId,
            userInfoToUpdate,
          },
        );

        const updatedUser = normalizeUserFromApi(response.data);
        await handleSetAuthInfo({
          isAuthenticated: true,
          user: updatedUser,
        });
      } catch (error) {
        logApiError("Failed to update user info", error);
      }
    },
    [handleSetAuthInfo],
  );

  const syncPreferencesToServer = useCallback(
    (preferencesPatch: NonNullable<Partial<User>["preferences"]>) => {
      queueUserPreferencesUpdate(preferencesPatch, async (merged) => {
        const user = storeRef.current.state.auth.user;
        if (!user) {
          return;
        }

        await handleUpdateUserInfoInApplication({
          preferences: {
            ...(user.preferences ?? {}),
            ...merged,
          },
        });
      });
    },
    [handleUpdateUserInfoInApplication],
  );

  const handleThemePreferenceChange = useCallback(
    async (preference: ThemePreference) => {
      storeRef.current.setThemePreference(preference);
      await setStoredThemePreference(preference);

      if (storeRef.current.state.auth.user) {
        syncPreferencesToServer({ theme: preference });
      }
    },
    [syncPreferencesToServer],
  );

  const handleLanguageChange = useCallback(
    async (lang: SupportedLang) => {
      await setStoredLanguage(lang);

      const user = storeRef.current.state.auth.user;
      if (user) {
        storeRef.current.updateAuthInfo({
          isAuthenticated: true,
          user: {
            ...user,
            preferences: {
              ...(user.preferences ?? {}),
              languagePreference: lang,
            },
          },
        });
        syncPreferencesToServer({ languagePreference: lang });
      }

      await i18n.changeLanguage(lang);
      ensureNativeLtrForTouches();
    },
    [syncPreferencesToServer],
  );

  const handleInitialAuthentication = useCallback(async () => {
    const storedAuth = await getStoredAuth();
    const storedTheme = await getStoredThemePreference();
    const themePreference =
      storedTheme ?? getThemePreference(storedAuth.user) ?? "system";
    storeRef.current.setThemePreference(themePreference);

    await syncI18nWithAppLanguage(storedAuth.user ?? undefined);

    if (!storedAuth.isAuthenticated || !storedAuth.user) {
      await handleSetAuthInfo(getApplicationInitialState().auth);
      storeRef.current.handleIsFetchingUserInfo(false);
      return;
    }

    const storedUser = normalizeUserFromApi(storedAuth.user);
    const fetchedUser = await handleFetchUserInfo();

    if (fetchedUser) {
      await handleSetAuthInfo({
        isAuthenticated: true,
        user: fetchedUser,
      });
    } else if (storedAuth.accessToken) {
      await handleSetAuthInfo({
        isAuthenticated: true,
        user: storedUser,
      });
    } else {
      await clearStoredAuth();
      await handleSetAuthInfo(getApplicationInitialState().auth);
    }

    storeRef.current.handleIsFetchingUserInfo(false);
  }, [handleFetchUserInfo, handleSetAuthInfo]);

  const handleLogout = useCallback(async () => {
    try {
      const { refreshToken } = await getStoredAuth();
      if (refreshToken) {
        await api.post(END_POINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      logApiError("Logout request failed", error);
    } finally {
      await clearStoredAuth();
      await handleSetAuthInfo(getApplicationInitialState().auth);
      void WebBrowser.coolDownAsync();
    }
  }, [handleSetAuthInfo]);

  return useMemo(
    () => ({
      handleSetAuthInfo,
      handleFetchUserInfo,
      handleInitialAuthentication,
      handleLogout,
      handleThemePreferenceChange,
      handleUpdateUserInfoInApplication,
      handleLanguageChange,
    }),
    [
      handleFetchUserInfo,
      handleInitialAuthentication,
      handleLanguageChange,
      handleLogout,
      handleSetAuthInfo,
      handleThemePreferenceChange,
      handleUpdateUserInfoInApplication,
    ],
  );
};
