import APP_CONSTANTS from "../shared/app_constants";
import { PaletteMode } from "@mui/material";

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

export interface AuthenticateUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

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
