const END_POINTS = {
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
