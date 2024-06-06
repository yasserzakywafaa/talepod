import { NextFunction, Request, Response } from "express";

import AwsLogger from "../aws-logger";
import CONFIG from "../config";
import { GoogleGenerativeAI } from "@google/generative-ai"; // node --version # Should be >= 18
import { requestParams } from "../models/googleGeminiModel";

// Generative API
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_GEMINI_API_KEY_1 ?? "");
const genAiModel = genAI.getGenerativeModel(requestParams);

export const generateText = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;

  AwsLogger.info("API request received", { userPrompt });

  try {
    const generateRequest = await genAiModel.generateContent(userPrompt);
    const generateResponseText = generateRequest.response.text();

    console.log("ℹ️ GoogleGemini:>>> GENERATE", {
      path: request.path,
      MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
    });
    AwsLogger.info("ℹ️ AWS Logger GoogleGemini:>>> GENERATE", {
      path: request.path,
      MODEL_NAME: CONFIG.GOOGLE_GEMINI_MODEL_NAME,
    });
    response.json(generateResponseText);
  } catch (error) {
    console.error("❌ GoogleGeminiController:>>> GENERATE Error", {
      error,
    });
    AwsLogger.error("❌ GoogleGemini:>>> GENERATE Error", { error });
    next(error);
  }
};

const GoogleGeminiController = {
  generateText,
};

export default GoogleGeminiController;
