import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import APP_CONSTANTS from "../../application/shared/app_constants";
import type { User } from "../types/user";

const { AUTHENTICATED, USER, ACCESS_TOKEN, REFRESH_TOKEN, TOKEN } =
  APP_CONSTANTS.LOCAL_STORAGE;

export type StoredAuth = {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

/**
 * In-memory mirror of disk: every request needs the token, and two keychain
 * reads each time is visibly slow on Android. Every write below updates it.
 */
let cache: StoredAuth | null = null;
/** Coalesces concurrent cold reads into a single hydration. */
let hydration: Promise<StoredAuth> | null = null;

const readSecureToken = async (key: string): Promise<string | null> => {
  try {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue) {
      return secureValue;
    }

    // Migration path: tokens used to live in AsyncStorage. Move any leftover
    // value into the keychain once, then read from the keychain from then on.
    const legacyValue = await AsyncStorage.getItem(key);
    if (legacyValue) {
      await SecureStore.setItemAsync(key, legacyValue);
      await AsyncStorage.removeItem(key);
      return legacyValue;
    }

    return null;
  } catch {
    return AsyncStorage.getItem(key);
  }
};

const writeSecureToken = async (key: string, value: string): Promise<void> => {
  try {
    if (value) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch {
    await AsyncStorage.setItem(key, value);
  }
};

const deleteSecureToken = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Nothing stored under this key — already the desired state.
  }
  await AsyncStorage.removeItem(key);
};

const hydrateFromStorage = async (): Promise<StoredAuth> => {
  const [isAuthenticatedRaw, userRaw, accessToken, refreshToken] =
    await Promise.all([
      AsyncStorage.getItem(AUTHENTICATED),
      AsyncStorage.getItem(USER),
      readSecureToken(ACCESS_TOKEN),
      readSecureToken(REFRESH_TOKEN),
    ]);

  let user: User | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User;
    } catch {
      // A truncated record must not brick the launch — treat it as "no cached
      // user" and let the app re-fetch from the API.
      user = null;
    }
  }

  return {
    isAuthenticated: isAuthenticatedRaw === "true",
    user,
    accessToken,
    refreshToken,
  };
};

export const getStoredAuth = async (): Promise<StoredAuth> => {
  if (cache) {
    return cache;
  }

  // Several callers hit this at once on a cold start (the axios interceptor
  // and the initial-auth effect). Share one hydration rather than racing.
  hydration ??= hydrateFromStorage().finally(() => {
    hydration = null;
  });

  cache = await hydration;
  return cache;
};

// Synchronous read for the interceptor's hot path. Null only before the
// first `getStoredAuth()`, which the app gates its first screen on.
export const getCachedAccessToken = (): string | null =>
  cache?.accessToken ?? null;

export const setStoredAuth = async (auth: StoredAuth): Promise<void> => {
  cache = auth;

  await AsyncStorage.multiSet([
    [AUTHENTICATED, auth.isAuthenticated ? "true" : "false"],
    [USER, JSON.stringify(auth.user)],
  ]);
  await writeSecureToken(ACCESS_TOKEN, auth.accessToken ?? "");
  await writeSecureToken(REFRESH_TOKEN, auth.refreshToken ?? "");
};

export const setStoredTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  // Refresh replaces only the tokens; the cached user and auth flag stand.
  const current = await getStoredAuth();
  cache = { ...current, accessToken, refreshToken };

  await writeSecureToken(ACCESS_TOKEN, accessToken);
  await writeSecureToken(REFRESH_TOKEN, refreshToken);
};

export const clearStoredAuth = async (): Promise<void> => {
  cache = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  };

  // `TOKEN` is a pre-SecureStore key. Nothing writes it any more, but a user
  // upgrading from an old build can still have one on disk — clear it out.
  await AsyncStorage.multiRemove([AUTHENTICATED, USER, TOKEN]);
  await deleteSecureToken(ACCESS_TOKEN);
  await deleteSecureToken(REFRESH_TOKEN);
};
