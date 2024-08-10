import APP_CONSTANTS from "../shared/app_constants";
import { PaletteMode } from "@mui/material";
import { User } from "src/shared/user";

export interface ApplicationInitialState {
  isFetching: boolean;
  themeMode: PaletteMode;
  auth: Authentication;
}

export interface Authentication {
  token: string;
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
    themeMode: appThemMode,
    auth: {
      token: "",
      user: null,
      isAuthenticated: false,
    },
  };
};
