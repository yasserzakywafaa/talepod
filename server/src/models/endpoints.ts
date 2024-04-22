const END_POINTS = {
  GOOGLE_GEMINI: {
    GENERATE: `/api/gemini/generate/:userPrompt`,
    CHAT: `/api/gemini/chat/:userPrompt`,
  },
  OPENAI: {
    GENERATE: {
      TEXT: `/api/openai/generate/text/:userPrompt`,
      IMAGES: `/api/openai/generate/images/:userPrompt`,
    }
  },
};

export default END_POINTS;
