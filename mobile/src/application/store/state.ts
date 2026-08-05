import type { User } from "src/shared/types/user";
import {
  getThemePreferenceFromUser,
  type ThemeMode,
  type ThemePreference,
} from "@yasserzakywafaa/client-core";

export type { ThemeMode, ThemePreference };

export interface Authentication {
  isAuthenticated: boolean;
  user: User | null;
}

export interface ApplicationInitialState {
  isFetchingUserInfo: boolean;
  themePreference: ThemePreference;
  auth: Authentication;
}

/** Brand default for first launch — night-sky storytelling, not OS scheme. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

export const getApplicationInitialState = (): ApplicationInitialState => ({
  isFetchingUserInfo: true,
  themePreference: DEFAULT_THEME_PREFERENCE,
  auth: {
    isAuthenticated: false,
    user: null,
  },
});

export const getThemePreference = getThemePreferenceFromUser;
