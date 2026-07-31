import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

import { brandFonts, systemFonts } from "src/application/theme/paperFonts";
import {
  brand,
  fontFamily,
  gradients,
  glowHoney,
  radius,
  semanticColors,
  shadow,
  spacing,
  white,
  type SemanticColors,
  type ThemeMode,
} from "src/application/theme/tokens";

export const DRAWER_WIDTH = 240;

/**
 * Every MD3 color role is spelled out below. Material's baseline scheme is
 * purple, and any role left at its default (`secondaryContainer`,
 * `surfaceVariant`, `elevation.*`, …) leaks lavender into chips, segmented
 * buttons, dialogs and the tab bar — which is exactly what made the app look
 * unlike the web. Values come from `src/application/theme/tokens.ts`, the
 * mirror of web `themes.ts`.
 */
const lightColors = {
  ...MD3LightTheme.colors,

  primary: brand.honey[400],
  onPrimary: white,
  primaryContainer: semanticColors.light.primarySoft,
  onPrimaryContainer: brand.honey[700],

  secondary: brand.twilight[600],
  onSecondary: white,
  secondaryContainer: "#E7E5F8",
  onSecondaryContainer: brand.twilight[600],

  tertiary: brand.honey[600],
  onTertiary: white,
  tertiaryContainer: brand.parchment[200],
  onTertiaryContainer: brand.honey[700],

  error: semanticColors.light.error,
  onError: white,
  errorContainer: "#F9DEDC",
  onErrorContainer: "#8C1D18",

  background: semanticColors.light.background,
  onBackground: semanticColors.light.fg,
  surface: semanticColors.light.surface,
  onSurface: semanticColors.light.fg,
  surfaceVariant: semanticColors.light.surface2,
  onSurfaceVariant: semanticColors.light.fg2,
  surfaceDisabled: "rgba(10, 14, 43, 0.12)",
  onSurfaceDisabled: "rgba(10, 14, 43, 0.38)",

  outline: semanticColors.light.borderStrong,
  outlineVariant: semanticColors.light.border,

  inverseSurface: brand.plum[700],
  inverseOnSurface: brand.parchment[100],
  inversePrimary: brand.honey[300],

  shadow: "#6B4F1F",
  scrim: "rgba(10, 14, 43, 0.45)",
  backdrop: "rgba(10, 14, 43, 0.35)",

  /** Parchment-tinted surfaces — MD3 tints these purple by default. */
  elevation: {
    level0: "transparent",
    level1: white,
    level2: "#FDFAF5",
    level3: brand.parchment[200],
    level4: "#F0E7D8",
    level5: "#ECE1CF",
  },
};

const darkColors = {
  ...MD3DarkTheme.colors,

  primary: brand.honey[300],
  onPrimary: brand.plum[800],
  primaryContainer: semanticColors.dark.primarySoft,
  onPrimaryContainer: brand.honey[200],

  secondary: brand.twilight[300],
  onSecondary: brand.plum[800],
  secondaryContainer: "#343163",
  onSecondaryContainer: brand.twilight[200],

  tertiary: brand.honey[200],
  onTertiary: brand.plum[800],
  tertiaryContainer: semanticColors.dark.surface2,
  onTertiaryContainer: brand.honey[200],

  error: semanticColors.dark.error,
  onError: "#601410",
  errorContainer: "#8C1D18",
  onErrorContainer: "#F9DEDC",

  background: semanticColors.dark.background,
  onBackground: semanticColors.dark.fg,
  surface: semanticColors.dark.surface,
  onSurface: semanticColors.dark.fg,
  surfaceVariant: semanticColors.dark.surface2,
  onSurfaceVariant: semanticColors.dark.fg2,
  surfaceDisabled: "rgba(249, 244, 238, 0.12)",
  onSurfaceDisabled: "rgba(249, 244, 238, 0.38)",

  outline: semanticColors.dark.borderStrong,
  outlineVariant: semanticColors.dark.border,

  inverseSurface: brand.parchment[100],
  inverseOnSurface: brand.plum[700],
  inversePrimary: brand.honey[500],

  shadow: "#000000",
  scrim: "rgba(3, 5, 27, 0.6)",
  backdrop: "rgba(3, 5, 27, 0.55)",

  elevation: {
    level0: "transparent",
    level1: semanticColors.dark.surface,
    level2: "#1B2043",
    level3: semanticColors.dark.surface2,
    level4: "#252B4E",
    level5: "#2A3057",
  },
};

/** Non-color design tokens, reachable from any component via `useAppTheme()`. */
const sharedTokens = {
  radius,
  spacing,
  shadow,
  glowHoney,
  gradients,
  fontFamily,
  brand,
} as const;

const buildTheme = (mode: ThemeMode, fontsLoaded: boolean) => {
  const base = mode === "light" ? MD3LightTheme : MD3DarkTheme;

  return {
    ...base,
    dark: mode === "dark",
    /** Web `shape.borderRadius` is 12; V2 cards/buttons round harder. */
    roundness: radius.md,
    fonts: fontsLoaded ? brandFonts : systemFonts,
    colors: mode === "light" ? lightColors : darkColors,
    tokens: { ...sharedTokens, mode, semantic: semanticColors[mode] },
  };
};

export type AppTheme = Omit<ReturnType<typeof buildTheme>, "colors" | "tokens"> & {
  colors: typeof lightColors;
  tokens: typeof sharedTokens & { mode: ThemeMode; semantic: SemanticColors };
};

export const paperLightTheme = buildTheme("light", true);
export const paperDarkTheme = buildTheme("dark", true);

/** System-font variants used for the first frames, before fonts resolve. */
export const paperLightThemeSystemFonts = buildTheme("light", false);
export const paperDarkThemeSystemFonts = buildTheme("dark", false);

export const getPaperTheme = (mode: ThemeMode, fontsLoaded: boolean) => {
  if (mode === "light") {
    return fontsLoaded ? paperLightTheme : paperLightThemeSystemFonts;
  }
  return fontsLoaded ? paperDarkTheme : paperDarkThemeSystemFonts;
};
