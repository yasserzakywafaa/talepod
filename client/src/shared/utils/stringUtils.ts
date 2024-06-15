/**
 * Get available space size
 */
export const getAvailableSpace = (element: Element) => {
  const style = window.getComputedStyle(element, null),
    calc = (property: string) =>
      style
        .getPropertyValue(property)
        .split(/\D+/g)
        .map((num) => Number(num));

  const [pt, pr, pb, pl] = calc("padding"),
    [height] = calc("height"),
    [width] = calc("width");

  return {
    width: width - (pl + pr) * 2,
    height: height - pt - pb,
  };
};

/**
 * Generate random string
 */
export const getRandomString = (length = 8, prefix = "") => {
  let str = "";

  while (str.length <= length) {
    const [character] = Math.random().toString(36).substr(2),
      isTrue = Math.floor(Math.random() * 2) === 0;

    str += character[isTrue ? "toLowerCase" : "toUpperCase"]();
  }

  return `${prefix}_${str}`;
};

/**
 * Get query params
 */
export const getQueryParams = (params: string) => {
  return String(params)
    .split(/\?|&/g)
    .filter((str) => str)
    .map((str) => {
      const [key, value] = str.split("=");
      return { [key]: value };
    })
    .reduce((p, n) => ({ ...p, ...n }), {});
};

/**
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
  return string.split(" ").join("-");
};

/**
 * Replace spaces in a string with underscore
 */
export const replaceSpaceWithUnderscore = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
  return string.split(" ").join("_");
};

/**
 * Convert bytes into Megabytes
 */
export const convertToMB = (bytes: number) => (bytes / 1000000).toFixed(0);
