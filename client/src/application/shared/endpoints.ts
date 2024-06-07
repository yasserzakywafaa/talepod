import APP_CONSTANTS from "./app_constants";

const publicApiUrl = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_SERVER_PORT}`
  : // : window.location.origin;
    APP_CONSTANTS.PUBLIC_API_URL;

const END_POINTS = {
  TESTING: {
    ROUTE_ONE: `${publicApiUrl}/api/test-route-one`,
    ROUTE_TWO: `${publicApiUrl}/api/test-route-two`,
  },
  GOOGLE_GEMINI: {
    GENERATE: `${publicApiUrl}/api/gemini/generate`,
    CHAT: `${publicApiUrl}/api/gemini/chat`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `${publicApiUrl}/api/openai/generate/text`,
      TEXT_TO_SPEECH: `${publicApiUrl}/api/openai/generate/text-to-speech`,
      IMAGES: `${publicApiUrl}/api/openai/generate/images`,
    },
  },
};

export default END_POINTS;
