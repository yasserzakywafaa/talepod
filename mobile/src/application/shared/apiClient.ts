import axios from "axios";
import { setupAuthAxios } from "./setupAuthAxios";

import APP_CONSTANTS from "./app_constants";
import END_POINTS from "./endpoints";
import {
  clearStoredAuth,
  getCachedAccessToken,
  getStoredAuth,
  setStoredTokens,
} from "../../shared/storage/authStorage";
import { emitSessionExpired } from "./authEvents";

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
    config.headers = config.headers ?? {};

    // Hot path: the token is in memory, so only a cold start falls through
    // to storage, and that read is coalesced.
    const accessToken = getCachedAccessToken() ?? (await getStoredAuth()).accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers[APP_CONSTANTS.MOBILE_CLIENT_HEADER] =
      APP_CONSTANTS.MOBILE_CLIENT_VALUE;

    return config;
  });

  // A 401 from an exchange means the sign-in failed, not that the session
  // expired — letting the refresh interceptor see it would wipe stored auth.
  const oauthExchangeUrls = [
    END_POINTS.AUTH.GOOGLE_MOBILE_EXCHANGE,
    END_POINTS.AUTH.APPLE_MOBILE_EXCHANGE,
    END_POINTS.AUTH.APPLE_NATIVE_EXCHANGE,
  ];

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
    // Clear storage first, then notify: the listener rebuilds auth state
    // from storage, and clearing alone left the UI signed-in but 401ing.
    redirectToLogin: () => {
      void clearStoredAuth().finally(emitSessionExpired);
    },
    onLogout: () => {
      void clearStoredAuth().finally(emitSessionExpired);
    },
    isExcludedAuthUrl: (requestUrl, authUrl) =>
      isExcludedAuthUrl(requestUrl, authUrl) ||
      oauthExchangeUrls.some((exchangeUrl) =>
        Boolean(requestUrl?.includes(exchangeUrl)),
      ),
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
