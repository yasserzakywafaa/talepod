import APP_CONSTANTS from "./app_constants";

const publicURL = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_BACKEND_SERVER_PORT}`
  : "https://ai-story-creator-api.onrender.com";

const END_POINTS = {
  TESTING: {
    ROUTE_1: `${publicURL}/api/test-route/1`,
    ROUTE_2: `${publicURL}/api/test-route/2`,
  },
  GOOGLE_GEMINI: {
    GENERATE: `${publicURL}/api/gemini/generate`,
    CHAT: `${publicURL}/api/gemini/chat`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `${publicURL}/api/openai/generate/text`,
      IMAGES: `${publicURL}/api/openai/generate/images`,
    },
  },
};

export default END_POINTS;
