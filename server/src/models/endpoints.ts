const END_POINTS = {
  TESTING: {
    ROUTE_ONE: "/api/test-route-one",
    ROUTE_TWO: "/api/test-route-two",
  },
  GOOGLE_GEMINI: {
    GENERATE: `/api/gemini/generate`,
    CHAT: `/api/gemini/chat`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `/api/openai/generate/text`,
      TEXT_TO_SPEECH: `/api/openai/generate/text-to-speech`,
      IMAGES: `/api/openai/generate/images`,
    },
  },
};

export default END_POINTS;
