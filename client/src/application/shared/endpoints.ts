import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string | undefined => {
  if (APP_CONSTANTS.IS_DEV) {
    if (APP_CONSTANTS.IS_DEV_LOCAL_SERVER) {
      return `http://localhost:${APP_CONSTANTS.DEV_SERVER_PORT}`;
    }

    return APP_CONSTANTS.DEV_API_URL;
  }

  if (APP_CONSTANTS.DEV_API_URL) {
    return APP_CONSTANTS.DEV_API_URL;
  }

  return APP_CONSTANTS.PROD_API_URL;
};

const publicApiUrl = getPublicURL();

const END_POINTS = {
  TESTING: {
    ROUTE_ONE: `${publicApiUrl}/api/v1/test-route-one`,
    ROUTE_TWO: `${publicApiUrl}/api/v1/test-route-two`,
  },
  GOOGLE_GEMINI: {
    CREATE: {
      STORY: `${publicApiUrl}/api/v1/gemini/create/story`,
    },
  },
  OPENAI: {
    GENERATE: {
      STORY: `${publicApiUrl}/api/v1/openai/create/story`,
      STORY_SEO: `${publicApiUrl}/api/v1/story-seo`,
      STORY_AUDIO: `${publicApiUrl}/api/v1/openai/create/story-audio`,
      IMAGES: `${publicApiUrl}/api/v1/openai/create/images`,
    },
  },
  STORIES: {
    GET_ALL_STORIES: `${publicApiUrl}/api/v1/stories`,
    GET_STORY_BY_ID: (storyId: string) =>
      `${publicApiUrl}/api/v1/story/${storyId}`,
  },
};

export default END_POINTS;
