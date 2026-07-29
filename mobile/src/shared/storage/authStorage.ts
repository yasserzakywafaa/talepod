import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import APP_CONSTANTS from "../../application/shared/app_constants";
import type { User } from "../types/user";

const { AUTHENTICATED, USER, ACCESS_TOKEN, REFRESH_TOKEN } =
  APP_CONSTANTS.LOCAL_STORAGE;

export type StoredAuth = {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const readSecureToken = async (key: string): Promise<string | null> => {
  try {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue) {
      return secureValue;
    }

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
    // ignore
  }
  await AsyncStorage.removeItem(key);
};

export const getStoredAuth = async (): Promise<StoredAuth> => {
  const [isAuthenticatedRaw, userRaw, accessToken, refreshToken] =
    await Promise.all([
      AsyncStorage.getItem(AUTHENTICATED),
      AsyncStorage.getItem(USER),
      readSecureToken(ACCESS_TOKEN),
      readSecureToken(REFRESH_TOKEN),
    ]);

  const isAuthenticated = isAuthenticatedRaw === "true";
  const user = userRaw ? (JSON.parse(userRaw) as User) : null;

  return {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
  };
};

export const setStoredAuth = async (auth: StoredAuth): Promise<void> => {
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
  await writeSecureToken(ACCESS_TOKEN, accessToken);
  await writeSecureToken(REFRESH_TOKEN, refreshToken);
};

export const clearStoredAuth = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    AUTHENTICATED,
    USER,
    APP_CONSTANTS.LOCAL_STORAGE.TOKEN,
  ]);
  await deleteSecureToken(ACCESS_TOKEN);
  await deleteSecureToken(REFRESH_TOKEN);
};
