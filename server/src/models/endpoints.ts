const END_POINTS = {
  TESTING: {
    ROUTE_ONE: "/api/v1/test-route-one",
    ROUTE_TWO: "/api/v1/test-route-two",
    HELLO: "/api/v1/hello",
  },
  OPENAI: {
    CREATE: {
      STORY: "/api/v1/openai/create/story",
      STORY_SEO: "/api/v1/story-seo",
      STORY_AUDIO: "/api/v1/openai/create/story-audio",
      IMAGES: "/api/v1/openai/create/images",
    },
  },
  STORIES: {
    GET_ALL_STORIES: "/api/v1/bedtime-stories",
    GET_STORY_BY_ID: (storyId: string) => `/api/v1/bedtime-story/${storyId}`,
    GET_ALL_USER_STORIES: "/api/v1/user-bedtime-stories",
    GET_ORIGINAL_STORIES: "/api/v1/bedtime-stories/originals",
    GET_USERS_STORIES: "/api/v1/bedtime-stories/users",
  },
  CONTACT: {
    SUPPORT: "/api/v1/contact-support",
  },
  AUTH: {
    GOOGLE: `/api/v1/auth/google-auth`,
    USER_INFO: `/api/v1/auth/user-info`,
    UPDATE_USER_INFO: `/api/v1/auth/update-user-info`,
  },
  PAYMENTS: {
    CONFIG: `/api/v1/payments/config`,
    WEBHOOK: `/api/v1/payments/webhook`,
    GET_PRICES_LIST: `/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `/api/v1/payments/products-list-with-prices`,
    CREATE_CHECKOUT_SESSION: `/api/v1/payments/create-checkout-session`,
    GET_CHECKOUT_SESSION_DATA: `/api/v1/payments/checkout-session-data`,
    GET_SUBSCRIPTION_DETAILS: `/api/v1/auth/get-subscription-details`,
    CANCEL_SUBSCRIPTION: `/api/v1/payments/cancel-subscription`,
  },
};

export default END_POINTS;
