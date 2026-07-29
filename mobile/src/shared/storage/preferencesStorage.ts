import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseThemePreference } from "@yasserzakywafaa/client-core";

import APP_CONSTANTS from "src/application/shared/app_constants";
import type { ThemePreference } from "src/application/store/state";

const { APP_THEME, LANGUAGE } = APP_CONSTANTS.LOCAL_STORAGE;

export const getStoredThemePreference =
  async (): Promise<ThemePreference | null> => {
    const value = await AsyncStorage.getItem(APP_THEME);
    return parseThemePreference(value);
  };

export const setStoredThemePreference = async (
  preference: ThemePreference,
): Promise<void> => {
  await AsyncStorage.setItem(APP_THEME, preference);
};

export const getStoredLanguage = async (): Promise<string | null> => {
  return AsyncStorage.getItem(LANGUAGE);
};

export const setStoredLanguage = async (lang: string): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE, lang);
};
