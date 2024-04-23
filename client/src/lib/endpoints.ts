import APP_CONSTANTS from "./app_constants";

const publicURL = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_BACKEND_SERVER_PORT}`
  : "";

const END_POINTS = {
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
