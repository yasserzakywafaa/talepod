import oil2dThumb from "src/assets/images/art-styles/oil2d.jpg";
import pixar3dThumb from "src/assets/images/art-styles/pixar3d.jpg";
import watercolorThumb from "src/assets/images/art-styles/watercolor.jpg";

/**
 * Selectable illustration art styles for the create form. The `id`s MUST match
 * the server registry keys in `server/src/services/create/imageStyles.ts`; the
 * chosen id is sent on the create request and persisted on `Story.artStyle`.
 *
 * `thumbnail` is a real sample of the same scene rendered in that style
 * (generated via `server/src/scripts/generateArtStyleSamples.ts`); `swatch` is
 * the gradient fallback shown if the image can't load.
 */
export interface ClientArtStyle {
  id: string;
  label: string;
  description: string;
  swatch: string;
  thumbnail?: string;
}

export const DEFAULT_ART_STYLE_ID = "watercolor";

// Order here is the order shown in the picker; keep the default first.
export const ArtStyles: ClientArtStyle[] = [
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft dreamy washes of color",
    swatch: "linear-gradient(160deg,#A7C7E7,#C9A7E7)",
    thumbnail: watercolorThumb,
  },
  {
    id: "oil2d",
    label: "2D Oil Painting",
    description: "Hand-painted storybook cartoon",
    swatch: "linear-gradient(160deg,#F0B648,#C9622F)",
    thumbnail: oil2dThumb,
  },
  {
    id: "pixar3d",
    label: "3D Pixar",
    description: "Glossy 3D animation render",
    swatch: "linear-gradient(160deg,#5AA9E6,#3A5BA0)",
    thumbnail: pixar3dThumb,
  },
];
