const APP_CONSTANTS = {
  DESIGN: {
    LOCAL_STORAGE_APP_THEME: "appTheme",
  },
  // Variables
  DEV_CLIENT_PORT: process.env.REACT_APP_PORT,
  DEV_SERVER_PORT: process.env.REACT_APP_SERVER_PORT,
  DEV_API_URL: process.env.REACT_APP_DEV_API_URL,
  PROD_API_URL: process.env.REACT_APP_PROD_API_URL,
  // Environment
  IS_DEV_LOCAL_SERVER: process.env.REACT_APP_IS_DEV_LOCAL_SERVER === "true",
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
  // Auth
  GOOGLE_AUTH_CLIENT_ID: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
};

export default APP_CONSTANTS;
