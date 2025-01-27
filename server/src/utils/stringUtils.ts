/**
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  return string.split(" ").join("-");
};

/**
 * Generate full audio file url
 */
export const getAudioFileUrl = (
  protocol: string,
  host: string,
  path: string,
  fileName: string
) => {
  return `${protocol}://${host}/${path}/${fileName}`;
};

/**
 * Create a slug from a text
 */
export const getSlugFromText = (text: string) => {
  let slug: string = "";
  const latinChars = /[A-Za-z]/;
  const nonLatinChars = /[^A-Za-z\s]/;

  if (nonLatinChars.test(text)) {
    // For non-Latin languages, only replace spaces with hyphens
    slug = text.trim().replace(/\s+/g, "-");
  }

  if (latinChars.test(text)) {
    // For Latin-based languages, do full slugification
    slug = text.trim().toLowerCase();

    // Replace accents and diacritics
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Replace special characters with hyphens
    slug = slug.replace(/[\s\W-]+/g, "-");

    // Remove leading and trailing hyphens
    slug = slug.replace(/^-+|-+$/g, "");
  }

  return slug;
};
