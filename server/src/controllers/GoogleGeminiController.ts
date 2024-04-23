// node --version # Should be >= 18
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";
import { NextFunction, Request, Response } from "express";
import {
  generationConfig,
  requestParams,
  safetySettings,
} from "../models/googleGeminiModel";

import CONFIG from "../config";

// Generative API
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_GEMINI_API_KEY_1 ?? "");
const genAiModel = genAI.getGenerativeModel(requestParams);

export const generateAnswer = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;
  try {
    const generateRequest = await genAiModel.generateContent(userPrompt);
    const generateResponseText = generateRequest.response.text();

    console.log("GoogleGeminiController:>>> GENERATE", {
      request,
      response: generateResponseText,
      MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
    });
    response.json(generateResponseText);
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
  const userPrompt = request.body.userPrompt;
  try {
    const chatResponse = await chat.sendMessage(userPrompt);
    const chatResponseText = chatResponse.response.text();

    console.log("GoogleGeminiController:>>> CHAT", {
      request,
      response: chatResponse.response,
      MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
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
