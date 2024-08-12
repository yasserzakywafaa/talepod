const END_POINTS = {
  TESTING: {
    ROUTE_ONE: "/api/v1/test-route-one",
    ROUTE_TWO: "/api/v1/test-route-two",
    HELLO: "/api/v1/hello",
  },
  GOOGLE_GEMINI: {
    CREATE: {
      STORY: "/api/v1/gemini/create/story",
    },
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
  },
  CONTACT: {
    SUPPORT: "/api/v1/contact-support",
  },
  AUTH: {
    GOOGLE: `/api/v1/auth/google-auth`,
    USER_INFO: `/api/v1/auth/user-info`,
  },
};

export default END_POINTS;
