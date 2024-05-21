const APP_CONSTANTS = {
  DESIGN: {},
  DEV_CLIENT_PORT: process.env.REACT_APP_PORT,
  DEV_SERVER_PORT: process.env.REACT_APP_SERVER_PORT,
  PUBLIC_URL: process.env.REACT_APP_PROD_API_PUBLIC_URL,
  IS_DEV:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("development") > -1,
  IS_PROD:
    process.env.NODE_ENV && process.env.NODE_ENV.indexOf("production") > -1,

  // Auth
  GOOGLE_AUTH_CLIENT_ID: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
};

export default APP_CONSTANTS;
