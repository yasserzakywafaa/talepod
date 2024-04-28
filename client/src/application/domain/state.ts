import { PaletteMode } from "@mui/material";

export interface ApplicationInitialState {
  isFetching: boolean;
  themeMode: PaletteMode;
}

export const getApplicationInitialState = (): ApplicationInitialState => {
  return {
    isFetching: false,
    themeMode: "light",
  };
};
