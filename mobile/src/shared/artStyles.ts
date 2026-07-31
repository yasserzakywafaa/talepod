import type { ImageSourcePropType } from "react-native";

/**
 * Selectable illustration art styles for the create form. Mirrors
 * `web/src/shared/artStyles.ts` — the `id`s MUST match the server registry
 * keys in `server/src/services/create/imageStyles.ts`.
 *
 * `thumbnail` is the same sample scene the web shows, rendered in that style;
 * `swatch` is the gradient fallback painted behind it while it decodes.
 */
export interface ClientArtStyle {
  id: string;
  label: string;
  description: string;
  /** Gradient stops, matching the web `linear-gradient(160deg, …)` swatches. */
  swatch: readonly [string, string];
  thumbnail: ImageSourcePropType;
}

export const DEFAULT_ART_STYLE_ID = "watercolor";

// Order here is the order shown in the picker; keep the default first.
export const ArtStyles: ClientArtStyle[] = [
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft dreamy colors",
    swatch: ["#A7C7E7", "#C9A7E7"],
    thumbnail: require("../../assets/images/art-styles/watercolor.jpg"),
  },
  {
    id: "oil2d",
    label: "2D Oil Painting",
    description: "Hand-painted cartoon",
    swatch: ["#F0B648", "#C9622F"],
    thumbnail: require("../../assets/images/art-styles/oil2d.jpg"),
  },
  {
    id: "pixar3d",
    label: "3D Pixar",
    description: "Glossy 3D animation",
    swatch: ["#5AA9E6", "#3A5BA0"],
    thumbnail: require("../../assets/images/art-styles/pixar3d.jpg"),
  },
];
