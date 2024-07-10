import APP_CONSTANTS from "../shared/app_constants";
import { PaletteMode } from "@mui/material";

export interface ApplicationInitialState {
  isFetching: boolean;
  themeMode: PaletteMode;
}

export const getApplicationInitialState = (): ApplicationInitialState => {
  const appThemMode =
    (localStorage.getItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME
    ) as PaletteMode) || "dark";

  return {
    isFetching: false,
    themeMode: appThemMode,
  };
};
