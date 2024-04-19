// const END_POINTS = (param?: string) => {
//   return {
//     OPENAI: {
//       USER_PROMPT: `/api/openai/${param}`,
//     },
//     GOOGLE_GEMINI: {
//       GENERATE: `/api/gemini/generate/${param}`,
//       CHAT: `/api/gemini/chat/${param}`,
//     },
//   };
// };

const END_POINTS = {
  OPENAI: {
    USER_PROMPT: `/api/openai/:userPrompt`,
  },
  GOOGLE_GEMINI: {
    GENERATE: `/api/gemini/generate/:userPrompt`,
    CHAT: `/api/gemini/chat/:userPrompt`,
  },
};

export default END_POINTS;
