const APP_CONSTANTS = {
  DESIGN: {},
  DEV_FRONTEND_SERVER_PORT: 4000,
  DEV_BACKEND_SERVER_PORT: 4001,
  // DEV_FRONTEND_SERVER_PORT: process.env.FRONTEND_PORT,
  // DEV_BACKEND_SERVER_PORT: process.env.BACKEND_PORT,
  PUBLIC_URL: "https://ai-story-creator-api.onrender.com",
  IS_DEV:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("development") > -1,
  IS_PROD:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") > -1,
};

export default APP_CONSTANTS;
