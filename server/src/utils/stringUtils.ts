/**
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
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
