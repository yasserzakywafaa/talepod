import APP_CONSTANTS from "./app_constants";

const publicURL = APP_CONSTANTS.IS_DEV
  ? `http://localhost:${APP_CONSTANTS.DEV_BACKEND_SERVER_PORT}`
  : "";

const END_POINTS = (param?: string) => {
  return {
    OPENAI: {
      USER_PROMPT: `${publicURL}/api/openai/${param}`,
    },
    GOOGLE_GEMINI: {
      GENERATE: `${publicURL}/api/gemini/generate/${param}`,
      CHAT: `${publicURL}/api/gemini/chat/${param}`,
    },
  };
};

export default END_POINTS;
