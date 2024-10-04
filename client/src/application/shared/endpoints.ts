import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string | undefined => {
  if (APP_CONSTANTS.IS_DEV) {
    if (APP_CONSTANTS.IS_DEV_LOCAL_SERVER) {
      return `http://localhost:${APP_CONSTANTS.DEV_SERVER_PORT}`;
    }

    return APP_CONSTANTS.DEV_API_URL;
  }

  if (APP_CONSTANTS.DEV_API_URL) {
    return APP_CONSTANTS.DEV_API_URL;
  }

  return APP_CONSTANTS.PROD_API_URL;
};

const publicApiUrl = getPublicURL();

const END_POINTS = {
  TESTING: {
    ROUTE_ONE: `${publicApiUrl}/api/v1/test-route-one`,
    ROUTE_TWO: `${publicApiUrl}/api/v1/test-route-two`,
  },
  OPENAI: {
    GENERATE: {
      STORY: `${publicApiUrl}/api/v1/openai/create/story`,
      STORY_SEO: `${publicApiUrl}/api/v1/story-seo`,
      STORY_AUDIO: `${publicApiUrl}/api/v1/openai/create/story-audio`,
      IMAGES: `${publicApiUrl}/api/v1/openai/create/images`,
    },
  },
  STORIES: {
    GET_ALL_STORIES: `${publicApiUrl}/api/v1/bedtime-stories`,
    GET_STORY_BY_SLUG: (slug: string) =>
      `${publicApiUrl}/api/v1/bedtime-story/${slug}`,
    GET_ALL_USER_STORIES: `${publicApiUrl}/api/v1/user-bedtime-stories`,
    GET_ORIGINAL_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/originals`,
    GET_USERS_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/users`,
  },
  CONTACT: {
    SUPPORT: `${publicApiUrl}/api/v1/contact-support`,
  },
  AUTH: {
    GOOGLE: `${publicApiUrl}/api/v1/auth/google-auth`,
    USER_INFO: `${publicApiUrl}/api/v1/auth/user-info`,
  },
  PAYMENTS: {
    CONFIG: `${publicApiUrl}/api/v1/payments/config`,
    GET_PRICES_LIST: `${publicApiUrl}/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `${publicApiUrl}/api/v1/payments/products-list-with-prices`,
    CREATE_CHECKOUT_SESSION: `${publicApiUrl}/api/v1/payments/create-checkout-session`,
    CHECKOUT_SESSION_WEBHOOK: `${publicApiUrl}/api/v1/payments/checkout-session-webhook`,
    GET_CHECKOUT_SESSION_DATA: `${publicApiUrl}/api/v1/payments/checkout-session-data`,
  },
};

export default END_POINTS;
