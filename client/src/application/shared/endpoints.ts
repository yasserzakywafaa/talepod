import APP_CONSTANTS from "./app_constants";

const publicApiUrl = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_SERVER_PORT}`
  : // : window.location.origin;
    APP_CONSTANTS.PUBLIC_API_URL;
// : "https://api.talepod.com";

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
      STORY_AUdio: `${publicApiUrl}/api/v1/openai/create/story-audio`,
      IMAGES: `${publicApiUrl}/api/v1/openai/create/images`,
    },
  },
  STORIES: {
    GET_ALL_STORIES: `${publicApiUrl}/api/v1/stories`,
    GET_STORY_BY_ID: (storyId: string) =>
      `${publicApiUrl}/api/v1/story/${storyId}`,
    // GET_STORY_BY_ID: `${publicApiUrl}/api/v1/story/:storyId`,
  },
};

export default END_POINTS;
