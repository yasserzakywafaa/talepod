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
  BLOGS: {
    GET_ALL_BLOGS: "/api/v1/blogs/blogs-list",
    GET_BLOG_BY_SLUG: (slug: string) => `/api/v1/blogs/${slug}`,
  },
  WEBHOOKS: {
    N8N: {
      NEW_STORY_ADDED:
        "https://n8n.yasserzaky.com/webhook/talepod-new-story-added",
    },
  },
  DASHBOARD: {
    OVERVIEW: {
      GET_USERS_COUNT: "/api/v1/dashboard/overview/users-count",
      GET_STORIES_COUNT: "/api/v1/dashboard/overview/stories-count",
    },
    USERS: {
      GET_ALL_USERS: "/api/v1/dashboard/users",
      GET_USER_BY_ID: (userId: string) => `/api/v1/dashboard/users/${userId}`,
      GET_USER_STORIES_COUNT: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/stories/count`,
      UPDATE_USER_ROLE: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/role`,
      BLOCK_USER: (userId: string) => `/api/v1/dashboard/users/block/${userId}`,
      UNBLOCK_USER: (userId: string) =>
        `/api/v1/dashboard/users/unblock/${userId}`,
      DELETE_USER: (userId: string) =>
        `/api/v1/dashboard/users/delete/${userId}`,
    },
    STORIES: {
      GET_ALL_STORIES: "/api/v1/dashboard/stories",
      DELETE_STORY: (storyId: string) =>
        `/api/v1/dashboard/stories/delete/${storyId}`,
    },
  },
};

export default END_POINTS;
