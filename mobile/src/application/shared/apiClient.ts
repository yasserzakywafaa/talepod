import axios from "axios";
import { setupAuthAxios } from "./setupAuthAxios";

import APP_CONSTANTS from "./app_constants";
import END_POINTS from "./endpoints";
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredTokens,
} from "../../shared/storage/authStorage";

export const api = axios.create();

const mobileHeaders = () => ({
  [APP_CONSTANTS.MOBILE_CLIENT_HEADER]: APP_CONSTANTS.MOBILE_CLIENT_VALUE,
});

const isExcludedAuthUrl = (
  requestUrl: string | undefined,
  authUrl: string,
): boolean => Boolean(requestUrl?.includes(authUrl));

let authSetupDone = false;

export const setupMobileAxios = (): void => {
  if (authSetupDone) {
    return;
  }
  authSetupDone = true;

  api.interceptors.request.use(async (config) => {
    const { accessToken } = await getStoredAuth();
    config.headers = config.headers ?? {};

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers[APP_CONSTANTS.MOBILE_CLIENT_HEADER] =
      APP_CONSTANTS.MOBILE_CLIENT_VALUE;

    return config;
  });

  setupAuthAxios({
    instance: api,
    withCredentials: false,
    refreshUrl: END_POINTS.AUTH.REFRESH_TOKEN,
    logoutUrl: END_POINTS.AUTH.LOGOUT,
    loginUrl: END_POINTS.AUTH.USER_INFO,
    storage: {
      clearAuth: () => {
        void clearStoredAuth();
      },
    },
    redirectToLogin: () => {
      /* Mobile keeps session in storage; AppContent reacts to auth state */
    },
    onLogout: () => {
      void clearStoredAuth();
    },
    isExcludedAuthUrl,
    requestRefresh: async (_instance, refreshUrl) => {
      const { refreshToken } = await getStoredAuth();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const refreshResponse = await axios.post<{
        accessToken?: string;
        refreshToken?: string;
      }>(refreshUrl, { refreshToken }, { headers: mobileHeaders() });

      const newAccessToken = refreshResponse.data.accessToken;
      const newRefreshToken = refreshResponse.data.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Refresh response missing tokens");
      }

      await setStoredTokens(newAccessToken, newRefreshToken);
    },
  });
};
