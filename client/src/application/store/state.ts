import APP_CONSTANTS from "../shared/app_constants";
import { PaletteMode } from "@mui/material";
import { User } from "src/shared/user";

export interface ApplicationInitialState {
  isFetching: boolean;
  isFetchingUserInfo: boolean;
  themeMode: PaletteMode;
  auth: Authentication;
  previousUrl: string;
}

export interface Authentication {
  isAuthenticated: boolean;
  user: AuthenticateUser | null;
}

export type AuthenticateUser = User;

export const getApplicationInitialState = (): ApplicationInitialState => {
  const appThemMode =
    (localStorage.getItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME
    ) as PaletteMode) || "dark";

  return {
    isFetching: false,
    isFetchingUserInfo: true,
    themeMode: appThemMode,
    previousUrl: "",
    auth: {
      user: null,
      isAuthenticated: false,
    },
  };
};
