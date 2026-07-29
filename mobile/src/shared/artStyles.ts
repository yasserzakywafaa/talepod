export interface ClientArtStyle {
  id: string;
  label: string;
  description: string;
  swatchColor: string;
}

export const DEFAULT_ART_STYLE_ID = "watercolor";

export const ArtStyles: ClientArtStyle[] = [
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Soft dreamy colors",
    swatchColor: "#A7C7E7",
  },
  {
    id: "oil2d",
    label: "2D Oil Painting",
    description: "Hand-painted cartoon",
    swatchColor: "#F0B648",
  },
  {
    id: "pixar3d",
    label: "3D Pixar",
    description: "Bright 3D adventure",
    swatchColor: "#6664C0",
  },
];
