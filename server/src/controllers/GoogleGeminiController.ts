// node --version # Should be >= 18
import {
  ChatSession,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";

const generationConfig = {
  topK: 1,
  topP: 1,
  temperature: 0.9,
  maxOutputTokens: 2048,
};
const safetySettings = [
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

// Generative API
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_GEMINI_API_KEY_1 ?? "");
const genAiModel = genAI.getGenerativeModel({
  model: CONFIG.GOOGLE_GEMINI_MODEL_NAME ?? "",
  generationConfig,
  safetySettings,
});

// console.log("GOOGLE_GEMINI:>>>", {
//   MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
// });

export const generateAnswer = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.params.userPrompt;
  try {
    const generateContentRequest = await genAiModel.generateContent(userPrompt);
    const generateContentResponseText = generateContentRequest.response.text();

    console.log("GoogleGeminiController:>>> GENERATE", {
      requestParams: request.params,
      response: generateContentResponseText,
    });
    next(generateContentResponseText);
  } catch (error) {
    console.error("GoogleGeminiController:>>> GENERATE Error", {
      error,
    });
    next(error);
  }
};

// Chat API
export const generateChat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Chat Session with the model
  new ChatSession(
    CONFIG.GOOGLE_GEMINI_API_KEY_1 ?? "",
    CONFIG.GOOGLE_GEMINI_MODEL_NAME ?? "",
    {
      history: [],
      generationConfig,
      safetySettings,
    }
  );
  const chat = genAiModel.startChat();
  const userPrompt = request.params.userPrompt;
  try {
    const chatResponse = await chat.sendMessage(userPrompt);
    const chatResponseText = chatResponse.response.text();

    console.log("GoogleGeminiController:>>> CHAT", {
      requestParams: request.params,
      response: chatResponseText,
    });
    next(chatResponseText);
  } catch (error) {
    console.error("GoogleGeminiController:>>> CHAT Error", {
      error,
    });
    next(error);
  }
};

const GoogleGeminiController = {
  generateAnswer,
  generateChat,
};

export default GoogleGeminiController;
