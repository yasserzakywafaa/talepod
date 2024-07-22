import { ExploreStoryFilters } from "src/Pages/Explore/store/state";

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

/**
 * Parse query string to filter object
 */
export const parseQueryString = (queryString: string) => {
  const params = new URLSearchParams(queryString);
  const filters: any = {};
  for (const [key, value] of params.entries()) {
    try {
      filters[key] = JSON.parse(value);
    } catch (e) {
      filters[key] = value;
    }
  }

  return filters;
};

/**
 * Create Query Params to URL
 */
export const createQueryString = (filters: ExploreStoryFilters) => {
  const params = new URLSearchParams();

  Object.keys(filters).forEach((key: keyof ExploreStoryFilters) => {
    const filter = filters[key];
    if (Array.isArray(filter)) {
      if (filter.length > 0) {
        params.append(key, JSON.stringify(filter));
      } else {
        params.append(key, JSON.stringify([]));
      }
    } else if (filter !== undefined && filter !== null) {
      params.append(key, filter as string);
    } else {
      params.append(key, "");
    }
  });

  return params.toString();
};

/**
 * Replace URL with given parameters
 */
export const replaceUrl = (filters: ExploreStoryFilters) => {
  const queryString = createQueryString(filters);
  const urlWithQuery = `${window.location.origin}${window.location.pathname}?${queryString}`;
  history.replaceState(null, "", urlWithQuery);
};
