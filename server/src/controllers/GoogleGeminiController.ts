// node --version # Should be >= 18

import {
  ChatSession,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";

// import isError from "../utils/isError";

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

// Generative AI
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY_1 ?? "");
const genAiModel = genAI.getGenerativeModel({
  model: CONFIG.GEMINI_MODEL_NAME ?? "",
  generationConfig,
  safetySettings,
});

export const generateAnswer = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("GEMINI_MODEL_NAME:>>>", CONFIG.GEMINI_MODEL_NAME);

  const userPrompt = request.params.userPrompt;
  // Google Gemini Complete API Call
  try {
    const generateContentRequest = await genAiModel.generateContent(userPrompt);
    const generateContentResponseText = generateContentRequest.response.text();

    console.log("GoogleGeminiController:>>> GENERATE", {
      requestParams: request.params,
      response: generateContentResponseText,
    });

    // response.status(200).json(generateContentResponseText);
    next(generateContentResponseText);
  } catch (error) {
    // if (isError(error)) {
    //   let statusCode = 400;
    //   if (error.message.indexOf("400") > -1) {
    //     statusCode = 400;
    //   }
    //   console.error("GoogleGeminiController:>>> GENERATE Error", {
    //     error,
    //     message: error.message,
    //     statusCode,
    //   });

    //   response.status(statusCode).json({
    //     statusCode,
    //     message: error.message,
    //   });
    // }

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
    CONFIG.GEMINI_API_KEY_1 ?? "",
    CONFIG.GEMINI_MODEL_NAME ?? "",
    {
      history: [],
      generationConfig,
      safetySettings,
    }
  );
  const chat = genAiModel.startChat();
  const userPrompt = request.params.userPrompt;
  // Google Gemini Complete API Call
  try {
    const chatResponse = await chat.sendMessage(userPrompt);
    const chatResponseText = chatResponse.response.text();

    console.log("GoogleGeminiController:>>> CHAT", {
      requestParams: request.params,
      response: chatResponseText,
    });

    response.status(200).json(chatResponseText);
  } catch (error) {
    console.log("GoogleGeminiController:>>> CHAT Error", {
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
