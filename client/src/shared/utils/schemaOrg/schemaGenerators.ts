import APP_CONSTANTS from "src/application/shared/app_constants";

export const getBaseUrl = (): string => {
  return APP_CONSTANTS.APP_URL || "https://www.talepod.com";
};

export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const getImageUrl = (
  imagePath: string | undefined,
): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return getAbsoluteUrl(imagePath);
};
