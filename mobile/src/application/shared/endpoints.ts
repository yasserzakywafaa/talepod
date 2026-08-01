import { getLocalApiOrigin } from "./getLocalApiOrigin";
import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string => {
  const { IS_DEV, IS_PROD, DEV_SERVER_PORT, DEV_API_URL, PROD_API_URL } =
    APP_CONSTANTS;

  if (IS_DEV) return DEV_API_URL ?? "";
  if (IS_PROD) return PROD_API_URL ?? "";

  return getLocalApiOrigin(DEV_SERVER_PORT || "16000");
};

const publicApiUrl = getPublicURL();

const END_POINTS = {
  AUTH: {
    USER_INFO: `${publicApiUrl}/api/v1/auth/user-info`,
    UPDATE_USER_INFO: `${publicApiUrl}/api/v1/auth/update-user-info`,
    REFRESH_TOKEN: `${publicApiUrl}/api/v1/auth/refresh-token`,
    LOGOUT: `${publicApiUrl}/api/v1/auth/logout`,
    GOOGLE: `${publicApiUrl}/api/v1/auth/google`,
    GOOGLE_MOBILE_EXCHANGE: `${publicApiUrl}/api/v1/auth/google/mobile/exchange`,
    PHONE_LOGIN_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/login/send-otp`,
    PHONE_LOGIN_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/login/verify-otp`,
    PHONE_REGISTER_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/register/send-otp`,
    PHONE_REGISTER_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/register/verify-otp`,
    DELETE_ACCOUNT: `${publicApiUrl}/api/v1/auth/delete-account`,
  },
  CREATE: {
    GENERATE: {
      STORY: `${publicApiUrl}/api/v1/create/story`,
      STORY_STATUS: (storyId: string) =>
        `${publicApiUrl}/api/v1/create/story/${storyId}/status`,
      STORY_SEO: `${publicApiUrl}/api/v1/create/story-seo`,
      STORY_AUDIO: `${publicApiUrl}/api/v1/create/story-audio`,
    },
  },
  STORIES: {
    GET_STORY_BY_SLUG: (slug: string) =>
      `${publicApiUrl}/api/v1/bedtime-story/${slug}`,
    GET_COMMUNITY_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/community`,
    GET_ORIGINAL_STORIES: `${publicApiUrl}/api/v1/bedtime-stories/originals`,
    GET_ALL_USER_STORIES: `${publicApiUrl}/api/v1/user-bedtime-stories`,
    DELETE_MY_STORY: (storyId: string) =>
      `${publicApiUrl}/api/v1/user-bedtime-stories/${storyId}`,
  },
  AVATARS: {
    LIST: `${publicApiUrl}/api/v1/avatars`,
    CREATE: `${publicApiUrl}/api/v1/avatars`,
    GET: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
    UPDATE: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
    DELETE: (avatarId: string) => `${publicApiUrl}/api/v1/avatars/${avatarId}`,
  },
  PAYMENTS: {
    GET_SUBSCRIPTION_DETAILS: `${publicApiUrl}/api/v1/auth/get-subscription-details`,
    GET_PRICES_LIST: `${publicApiUrl}/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `${publicApiUrl}/api/v1/payments/products-list-with-prices`,
  },
  CONTACT: {
    SUPPORT: `${publicApiUrl}/api/v1/contact-support`,
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
      UNBLOCK_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/unblock/${userId}`,
      DELETE_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/delete/${userId}`,
    },
    STORIES: {
      GET_ALL_STORIES: `${publicApiUrl}/api/v1/dashboard/stories`,
      DELETE_STORY: (storyId: string) =>
        `${publicApiUrl}/api/v1/dashboard/stories/delete/${storyId}`,
    },
  },
};

export default END_POINTS;
