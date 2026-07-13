/**
 * Shared string utilities re-exported from @yasserzakywafaa/server-core.
 * TalePod-specific utilities are defined below.
 */
export {
  replaceSpaceWithDash,
  getSlugFromText,
  getRandomString,
} from "@yasserzakywafaa/server-core";

/**
 * Generate full audio file url (TalePod-specific)
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
 * Counts words in a text (whitespace-delimited). Good enough for the
 * space-separated languages TalePod supports; used to report story length.
 */
export const countWords = (text: string): number =>
  (text || "").trim().split(/\s+/).filter(Boolean).length;