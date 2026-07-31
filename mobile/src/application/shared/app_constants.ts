const rawEnv = process.env.EXPO_PUBLIC_ENV?.trim().toLowerCase();

const APP_CONSTANTS = {
  DEV_SERVER_PORT: process.env.EXPO_PUBLIC_SERVER_PORT,
  DEV_API_URL: process.env.EXPO_PUBLIC_DEV_API_URL,
  PROD_API_URL: process.env.EXPO_PUBLIC_PROD_API_URL,

  /** App tier: local | dev | prod (set EXPO_PUBLIC_ENV). */
  IS_LOCAL: rawEnv === "local" || rawEnv === undefined || rawEnv === "",
  IS_DEV: rawEnv === "dev" || rawEnv === "development",
  IS_PROD: rawEnv === "prod" || rawEnv === "production",

  /** Mirrors `web/src/application/shared/app_constants.ts`. */
  MAX_STORIES_LIMIT_FREE: 4,
  MAX_STORIES_LIMIT_PREMIUM: 50,
  MAX_STORIES_LIMIT_ADVANCED: 999,

  MOBILE_CLIENT_HEADER: "X-Client-Platform",
  MOBILE_CLIENT_VALUE: "mobile",

  DESIGN: {
    LOCAL_STORAGE_APP_THEME: "appTheme",
  },

  LOCAL_STORAGE: {
    TOKEN: "token",
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "user",
    AUTHENTICATED: "isAuthenticated",
    LANGUAGE: "appLanguage",
    APP_THEME: "appTheme",
    ACTIVE_GENERATION: "activeGeneration",
  },
};

export default APP_CONSTANTS;
