/**
 * Art-style registry for generated illustrations. Each style supplies:
 *  - `base`:   the long descriptive clause appended to every image prompt
 *              (this is what swaps the whole rendered look).
 *  - `medium`: a short label injected into the prompt builders' body text
 *              (e.g. "Create one full-bleed {medium} children's comic scene")
 *              so the wording matches the chosen medium, not just the suffix.
 *
 * The user picks a style in the create form; it is persisted on `Story.artStyle`
 * and resolved here at image-generation time. `oil2d` is the default look.
 */
export interface ArtStyle {
  id: string;
  label: string;
  base: string;
  medium: string;
}

export interface StyleSuffixes {
  cover: string;
  longInterior: string;
  comic: string;
}

export const DEFAULT_ART_STYLE = "watercolor";

export const ART_STYLES: Record<string, ArtStyle> = {
  // NOTE: refine this base string + medium with the user's reference asset.
  oil2d: {
    id: "oil2d",
    label: "2D Oil Painting",
    medium: "2D oil-painting cartoon",
    base:
      " 2D hand-painted oil-painting cartoon illustration, classic children's storybook style, soft visible brush strokes, warm painterly textures, gentle rounded shapes, expressive friendly characters, cozy warm lighting, rich saturated colors, completely text-free artwork in every language.",
  },
  // Preserves the previous app-wide look so existing-style stories still match.
  pixar3d: {
    id: "pixar3d",
    label: "3D Pixar",
    medium: "3D CGI Pixar",
    base:
      " premium 3D CGI children's animation render, Pixar Disney style, smooth rounded forms, highly detailed textures, expressive large eyes, soft cinematic volumetric lighting, warm golden glow, whimsical friendly atmosphere, vibrant saturated colors, completely text-free artwork in every language.",
  },
  watercolor: {
    id: "watercolor",
    label: "Watercolor",
    medium: "soft watercolor",
    base:
      " soft watercolor children's storybook illustration, gentle washes of color, delicate hand-painted textures, warm golden bedtime light, soft rounded shapes, cozy and dreamy atmosphere, completely text-free artwork in every language.",
  },
};

/** Resolve a stored style id to a style object, falling back to the default. */
export const resolveArtStyle = (id?: string): ArtStyle =>
  (id && ART_STYLES[id]) || ART_STYLES[DEFAULT_ART_STYLE];

/** Build the per-format style suffixes for a given art style. */
export const getStyleSuffixes = (style: ArtStyle): StyleSuffixes => ({
  cover: ` --${style.base} wide 16:9 landscape cover composition, edge-to-edge cinematic framing.`,
  longInterior: ` --${style.base} full-bleed 16:9 landscape scene illustration.`,
  comic: ` --${style.base} full-bleed 4:3 landscape scene, polished printable storybook quality, consistent art direction, completely free of any speech bubbles.`,
});

/** Default suffixes (used by callers that don't pass an explicit style). */
export const DEFAULT_STYLE_SUFFIXES = getStyleSuffixes(
  ART_STYLES[DEFAULT_ART_STYLE],
);
