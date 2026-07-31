/* =========================================================================
   TalePod mobile — design tokens.

   This is the native mirror of the web V2 design system:
     • colors      → web/src/application/shared/themes.ts
     • non-colors  → web/src/assets/scss/tokens.scss

   Keep the two in sync. Values are copied verbatim from the web so that a
   screen rendered here is the same screen rendered in the browser.
   ========================================================================= */

export const white = "#FFFFFF";

/** Brand ramps — verbatim from web `themes.ts`. */
export const brand = {
  honey: {
    200: "#FADA99",
    300: "#F5C66D", // PRIMARY (dark)
    400: "#F0B648", // PRIMARY (light)
    500: "#DD9812",
    600: "#BB7400",
    700: "#915200",
  },
  twilight: {
    200: "#D0CAFD",
    300: "#A7A0EC",
    400: "#827CD4",
    500: "#6664C0", // SECONDARY
    600: "#4C4C9E",
  },
  plum: {
    300: "#6D6F89",
    400: "#464B68",
    600: "#171C3B", // card bg (dark)
    700: "#0A0E2B", // page bg (dark)
    800: "#03051B",
  },
  parchment: {
    100: "#FAF4EA", // page bg (light)
    200: "#F2EADD", // card bg (light)
    300: "#E4D9C9", // border (light)
  },
} as const;

/** Semantic colors, resolved per theme mode — verbatim from web `themes.ts`. */
export const semanticColors = {
  light: {
    fg: brand.plum[700],
    fg2: brand.plum[400],
    fg3: brand.plum[300],
    surface: white,
    surface2: brand.parchment[200],
    border: brand.parchment[300],
    borderStrong: "#C7B49C",
    divider: "#ECE3D6",
    bgSunken: "#F7EDDC",
    background: brand.parchment[100],
    primary: brand.honey[400],
    onPrimary: white,
    accent: brand.twilight[500],
    onAccent: white,
    /** Soft honey wash — selected-but-not-filled states. */
    primarySoft: "#FBEED5",
    onPrimarySoft: brand.honey[700],
    error: "#B3261E",
  },
  dark: {
    fg: "#F9F4EE",
    fg2: "#BEB6A9",
    fg3: "#8A7F6C",
    surface: brand.plum[600],
    surface2: "#202646",
    border: "#2A3051",
    borderStrong: "#454A6E",
    divider: "#212741",
    bgSunken: brand.plum[800],
    background: brand.plum[700],
    primary: brand.honey[300],
    onPrimary: brand.plum[800],
    accent: brand.twilight[300],
    onAccent: brand.plum[800],
    primarySoft: "#33305A",
    onPrimarySoft: brand.honey[200],
    error: "#F2B8B5",
  },
} as const;

export type ThemeMode = keyof typeof semanticColors;
export type SemanticColors = (typeof semanticColors)[ThemeMode];

/** Radius scale — mirrors `--r-*` in web `tokens.scss`. */
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  /** Fully rounded pill. */
  pill: 999,
} as const;

/** Spacing — 4px grid, same rhythm the web layout uses. */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

/** Type scale — mirrors `--fs-*` in web `tokens.scss`. */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,
} as const;

export const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  body: 1.55,
  loose: 1.75,
} as const;

/** Font families — the files loaded in `useAppFonts`. */
export const fontFamily = {
  /** Yeseva One — headings, card titles, hero copy. */
  display: "YesevaOne-Regular",
  light: "LexendDeca-Light",
  regular: "LexendDeca-Regular",
  medium: "LexendDeca-Medium",
  semiBold: "LexendDeca-SemiBold",
  bold: "LexendDeca-Bold",
} as const;

/**
 * Warm-toned elevation — the RN equivalent of `--shadow-*`. React Native has
 * no multi-layer shadows, so each level is the dominant layer of the web
 * token. `elevation` keeps parity on Android.
 */
export const shadow = {
  xs: {
    shadowColor: "#6B4F1F",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#6B4F1F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#6B4F1F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  lg: {
    shadowColor: "#5A4116",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;

/** Signature honey focus glow — the RN read of web's `glowHoney`. */
export const glowHoney = {
  shadowColor: brand.honey[500],
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 8,
} as const;

/**
 * Gradient stop lists (top → bottom / start → end), mirroring the web
 * gradients. Rendered by `src/components/shared/Gradient.tsx`.
 */
export const gradients = {
  /** Web `bgTwilight` — hero: night sky into warm dawn. */
  twilight: ["#111034", "#262B65", "#B14F42"],
  /** Web `gradCover` — story-cover placeholder. */
  cover: ["#FFE6A8", "#C9B6E8"],
  /** Web `gradScene` — comic/format preview placeholder. */
  scene: ["#343470", "#B14F42"],
  /** Honey → twilight "magic" CTA. */
  magic: [brand.honey[400], brand.twilight[500]],
} as const;

/** Motion — mirrors `--dur-*` in web `tokens.scss`. */
export const duration = {
  fast: 200,
  base: 320,
} as const;
