/**
 * Selectable illustration art styles for the create form. The `id`s MUST match
 * the server registry keys in `server/src/services/create/imageStyles.ts`; the
 * chosen id is sent on the create request and persisted on `Story.artStyle`.
 *
 * `swatch` is a placeholder preview background until real per-style thumbnails
 * are supplied (the 2D oil-painting reference is pending from the user).
 */
export interface ClientArtStyle {
  id: string;
  label: string;
  description: string;
  swatch: string;
}

export const DEFAULT_ART_STYLE_ID = "watercolor";

// Order here is the order shown in the picker; keep the default first.
export const ArtStyles: ClientArtStyle[] = [
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft dreamy washes of color",
    swatch: "linear-gradient(160deg,#A7C7E7,#C9A7E7)",
  },
  {
    id: "oil2d",
    label: "2D Oil Painting",
    description: "Hand-painted storybook cartoon",
    swatch: "linear-gradient(160deg,#F0B648,#C9622F)",
  },
  {
    id: "pixar3d",
    label: "3D Pixar",
    description: "Glossy 3D animation render",
    swatch: "linear-gradient(160deg,#5AA9E6,#3A5BA0)",
  },
];
