const END_POINTS = {
  TESTING: {
    ROUTE_1: '/api/test-route/1',
    ROUTE_2: '/api/test-route/2',
  },
  GOOGLE_GEMINI: {
    GENERATE: `/api/gemini/generate`,
    CHAT: `/api/gemini/chat`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `/api/openai/generate/text`,
      IMAGES: `/api/openai/generate/images`,
    }
  },
};

export default END_POINTS;
