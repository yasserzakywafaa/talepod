import { MD3LightTheme, configureFonts } from "react-native-paper";

import { fontFamily } from "src/application/theme/tokens";

type FontVariant = {
  fontFamily: string;
  fontWeight?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
};

/**
 * React Native selects a weight by *font file*, not by `fontWeight`, so every
 * MD3 variant is remapped onto the matching Lexend Deca face. The weight is
 * then pinned to "400" so the platform does not synthesise a second bolding
 * pass on top of an already-bold face.
 */
const faceForWeight = (weight?: string): string => {
  switch (weight) {
    case "100":
    case "200":
    case "300":
      return fontFamily.light;
    case "500":
      return fontFamily.medium;
    case "600":
      return fontFamily.semiBold;
    case "700":
    case "800":
    case "900":
      return fontFamily.bold;
    default:
      return fontFamily.regular;
  }
};

/**
 * Web V2 sets buttons, labels and section headings at `fontWeight: 600`.
 * MD3 ships those variants at 500, so they are nudged to SemiBold here.
 */
const SEMI_BOLD_VARIANTS = [
  "labelLarge",
  "labelMedium",
  "labelSmall",
  "titleLarge",
  "titleMedium",
  "titleSmall",
];

const baseVariants = MD3LightTheme.fonts as unknown as Record<
  string,
  FontVariant
>;

const brandVariants: Record<string, FontVariant> = {};

for (const [variant, spec] of Object.entries(baseVariants)) {
  brandVariants[variant] = {
    ...spec,
    fontFamily: SEMI_BOLD_VARIANTS.includes(variant)
      ? fontFamily.semiBold
      : faceForWeight(spec.fontWeight),
    // `configureFonts` merges over the MD3 typescale, so this has to be an
    // explicit value — omitting it would let Material's weight come back.
    fontWeight: "400",
  };
}

/** Lexend Deca typography for every Paper component. */
export const brandFonts = configureFonts({
  config: brandVariants,
} as Parameters<typeof configureFonts>[0]);

/** Fallback used until the bundled font files finish loading. */
export const systemFonts = MD3LightTheme.fonts;
