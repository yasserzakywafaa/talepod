import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string | undefined => {
  const {
    IS_LOCAL,
    IS_DEV,
    IS_PROD,
    DEV_SERVER_PORT,
    DEV_API_URL,
    PROD_API_URL,
  } = APP_CONSTANTS;

  if (!IS_LOCAL && IS_DEV && !IS_PROD) return DEV_API_URL; // DEV env
  if (!IS_LOCAL && !IS_DEV && IS_PROD) return PROD_API_URL; // PROD env

  return `http://localhost:${DEV_SERVER_PORT}`; // LOCAL env
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
      BLOG: `${publicApiUrl}/api/v1/openai/create/blog`,
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
    UPDATE_USER_INFO: `${publicApiUrl}/api/v1/auth/update-user-info`,
  },
  PAYMENTS: {
    CONFIG: `${publicApiUrl}/api/v1/payments/config`,
    WEBHOOK: `${publicApiUrl}/api/v1/payments/webhook`,
    GET_PRICES_LIST: `${publicApiUrl}/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `${publicApiUrl}/api/v1/payments/products-list-with-prices`,
    CREATE_CHECKOUT_SESSION: `${publicApiUrl}/api/v1/payments/create-checkout-session`,
    GET_CHECKOUT_SESSION_DATA: `${publicApiUrl}/api/v1/payments/checkout-session-data`,
    GET_SUBSCRIPTION_DETAILS: `${publicApiUrl}/api/v1/auth/get-subscription-details`,
    CANCEL_SUBSCRIPTION: `${publicApiUrl}/api/v1/payments/cancel-subscription`,
  },
  BLOGS: {
    GET_ALL_BLOGS: `${publicApiUrl}/api/v1/blogs/blogs-list`,
    GET_BLOG_BY_SLUG: (slug: string) => `${publicApiUrl}/api/v1/blogs/${slug}`,
  },
};

export default END_POINTS;
