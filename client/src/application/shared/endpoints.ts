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
  CREATE: {
    GENERATE: {
      STORY: `${publicApiUrl}/api/v1/create/story`,
      STORY_SEO: `${publicApiUrl}/api/v1/create/story-seo`,
      STORY_AUDIO: `${publicApiUrl}/api/v1/create/story-audio`,
      IMAGES: `${publicApiUrl}/api/v1/create/images`,
      BLOG: `${publicApiUrl}/api/v1/create/blog`,
    },
  },
  STORIES: {
    GET_ALL_STORIES: `${publicApiUrl}/api/v1/bedtime-stories`,
    GET_STORY_BY_SLUG: (slug: string) =>
      `${publicApiUrl}/api/v1/bedtime-story/${slug}`,
    GET_ALL_USER_STORIES: `${publicApiUrl}/api/v1/user-bedtime-stories`,
    GET_COMMUNITY_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/community`,
    GET_ORIGINAL_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/originals`,
    GET_USERS_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/users`,
    EXPORT_STORY_PDF: (slug: string) =>
      `${publicApiUrl}/api/v1/bedtime-story/${slug}/pdf`,
    EMAIL_STORY_PDF: (slug: string) =>
      `${publicApiUrl}/api/v1/bedtime-story/${slug}/email-pdf`,
  },
  AVATARS: {
    LIST: `${publicApiUrl}/api/v1/avatars`,
    CREATE: `${publicApiUrl}/api/v1/avatars`,
    GET: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
    UPDATE: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
    DELETE: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
  },
  CONTACT: {
    SUPPORT: `${publicApiUrl}/api/v1/contact-support`,
  },
  AUTH: {
    USER_INFO: `${publicApiUrl}/api/v1/auth/user-info`,
    USER_PROFILE: (userId: string) =>
      `${publicApiUrl}/api/v1/auth/user-profile/${userId}`,
    UPDATE_USER_INFO: `${publicApiUrl}/api/v1/auth/update-user-info`,
    LOGOUT: `${publicApiUrl}/api/v1/auth/logout`,
    GOOGLE: `${publicApiUrl}/api/v1/auth/google`,
    GOOGLE_CALLBACK: `${publicApiUrl}/api/v1/auth/google/callback`,
    REFRESH_TOKEN: `${publicApiUrl}/api/v1/auth/refresh-token`,
    PHONE_REGISTER_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/register/send-otp`,
    PHONE_REGISTER_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/register/verify-otp`,
    PHONE_LOGIN_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/login/send-otp`,
    PHONE_LOGIN_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/login/verify-otp`,
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
  DASHBOARD: {
    OVERVIEW: {
      GET_USERS_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/users-count`,
      GET_STORIES_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/stories-count`,
    },
    USERS: {
      GET_ALL_USERS: `${publicApiUrl}/api/v1/dashboard/users`,
      GET_USER_BY_ID: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}`,
      GET_USER_STORIES_COUNT: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/stories/count`,
      UPDATE_USER_ROLE: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/role`,
      BLOCK_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/block/${userId}`,
      DELETE_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/delete/${userId}`,
    },
    STORIES: {
      GET_ALL_STORIES: `${publicApiUrl}/api/v1/dashboard/stories`,
      DELETE_STORY: (storyId: string) =>
        `${publicApiUrl}/api/v1/dashboard/stories/delete/${storyId}`,
    },
  },
  BLOGS: {
    GET_ALL_BLOGS: `${publicApiUrl}/api/v1/blogs/blogs-list`,
    GET_BLOG_BY_SLUG: (slug: string) => `${publicApiUrl}/api/v1/blogs/${slug}`,
  },
};

export default END_POINTS;
