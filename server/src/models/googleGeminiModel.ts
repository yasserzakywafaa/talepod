import {
  GenerationConfig,
  HarmBlockThreshold,
  HarmCategory,
  ModelParams,
  SafetySetting,
} from "@google/generative-ai";

import CONFIG from "../config";

export const generationConfig: GenerationConfig = {
  topK: 1,
  topP: 1,
  temperature: 0.9,
  maxOutputTokens: 2048,
};
export const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
export const requestParams: ModelParams = {
  model: CONFIG.GOOGLE_GEMINI_MODEL_NAME ?? "",
  generationConfig,
  safetySettings,
};
