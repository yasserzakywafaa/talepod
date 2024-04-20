const END_POINTS = {
  GOOGLE_GEMINI: {
    GENERATE: `/api/gemini/generate/:userPrompt`,
    CHAT: `/api/gemini/chat/:userPrompt`,
  },
  OPENAI: {
    USER_PROMPT: `/api/openai/:userPrompt`,
  },
};

export default END_POINTS;
