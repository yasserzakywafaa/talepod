import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { GoogleGenerativeAI } from "@google/generative-ai"; // node --version # Should be >= 18
import { requestParams } from "../models/googleGeminiModel";

// Generative API
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_GEMINI_API_KEY_1 ?? "");
const genAiModel = genAI.getGenerativeModel(requestParams);

export const createStory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;

  try {
    const createStoryRequest = await genAiModel.generateContent(userPrompt);
    const createStoryResponseText = createStoryRequest.response.text();

    console.log("ℹ️  GoogleGeminiController:>>> CREATE", {
      request: request.path,
      MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
    });
    response.json(createStoryResponseText);
  } catch (error) {
    console.error("❌ GoogleGeminiController:>>> CREATE Error", {
      error,
    });
    next(error);
  }
};

const GoogleGeminiController = {
  createStory,
};

export default GoogleGeminiController;
