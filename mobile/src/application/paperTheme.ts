import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
} from "react-native-paper";

/** Mirrors web `themes.ts`: honey primary, twilight secondary, plum dark surfaces */
export const DRAWER_WIDTH = 240;

const fontConfig = configureFonts({ config: { fontFamily: "System" } });

const honey = {
  lightPrimary: "#F0B648",
  darkPrimary: "#F5C66D",
};

const twilightSecondary = "#6664C0";

export const paperDarkTheme = {
  ...MD3DarkTheme,
  fonts: fontConfig,
  colors: {
    ...MD3DarkTheme.colors,
    primary: honey.darkPrimary,
    onPrimary: "#0A0E2B",
    secondary: twilightSecondary,
    onSecondary: "#FFFFFF",
    background: "#0A0E2B",
    surface: "#171C3B",
    surfaceVariant: "#464B68",
    onSurface: "#FFFFFF",
    onSurfaceVariant: "#D0CAFD",
    outline: "#6D6F89",
    elevation: {
      level0: "transparent",
      level1: "#171C3B",
      level2: "#1e2245",
      level3: "#252a52",
      level4: "#2c325e",
      level5: "#33396a",
    },
  },
};

export const paperLightTheme = {
  ...MD3LightTheme,
  fonts: fontConfig,
  colors: {
    ...MD3LightTheme.colors,
    primary: honey.lightPrimary,
    onPrimary: "#0A0E2B",
    secondary: twilightSecondary,
    onSecondary: "#FFFFFF",
    background: "#f8f6f2",
    surface: "#ffffff",
    surfaceVariant: "#f0ebe3",
    onSurface: "#171C3B",
    onSurfaceVariant: "#464B68",
    outline: "#cccccc",
  },
};
