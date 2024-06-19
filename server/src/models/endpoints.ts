const END_POINTS = {
  TESTING: {
    ROUTE_ONE: "/api/v1/test-route-one",
    ROUTE_TWO: "/api/v1/test-route-two",
    HELLO: "/api/v1/hello",
  },
  GOOGLE_GEMINI: {
    CREATE: {
      STORY: `/api/v1/gemini/create/story`,
    },
  },
  OPENAI: {
    CREATE: {
      STORY: `/api/v1/openai/create/story`,
      STORY_AUDIO: `/api/v1/openai/create/story-audio`,
      IMAGES: `/api/v1/openai/create/images`,
    },
  },
  STORIES: {
    GET_ALL_STORIES: `/api/v1/stories`,
    GET_STORY_BY_ID: (storyId: string) => `/api/v1/story/${storyId}`,
  },
};

export default END_POINTS;
