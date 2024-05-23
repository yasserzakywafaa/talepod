import APP_CONSTANTS from "./app_constants";

const publicURL = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_SERVER_PORT}`
  : APP_CONSTANTS.PUBLIC_URL;

const END_POINTS = {
  TESTING: {
    ROUTE_ONE: `${publicURL}/api/test-route-one`,
    ROUTE_TWO: `${publicURL}/api/test-route-two`,
  },
  GOOGLE_GEMINI: {
    GENERATE: `${publicURL}/api/gemini/generate`,
    CHAT: `${publicURL}/api/gemini/chat`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `${publicURL}/api/openai/generate/text`,
      TEXT_TO_SPEECH: `${publicURL}/api/openai/generate/text-to-speech`,
      IMAGES: `${publicURL}/api/openai/generate/images`,
    },
  },
};

export default END_POINTS;
