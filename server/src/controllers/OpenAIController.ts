import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { IMAGES_SIZES } from "../models/openaiModel";
import OpenAi from "openai";

const openai = new OpenAi();

export const generateText = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;
  // OpenAI Text Generation API Call
  try {
    const generateRequest = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
      max_tokens: 1000,
    });

    console.log("OpenAIController:>>> GENERATE TEXT", {
      request,
      response: generateRequest,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });

    response.json(generateRequest.choices[0].message.content);
  } catch (error) {
    console.log("OpenAIController:>>> GENERATE TEXT Error", {
      error,
    });
    next(error);
  }
};

export const generateImages = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;

  // OpenAI Image Generation API Call
  try {
    const imageRequest = await openai.images.generate({
      n: 1,
      prompt: userPrompt,
      size: IMAGES_SIZES["1024x1024"],
      model: CONFIG.OPENAI_IMAGES_MODEL_NAME,
    });

    console.log("OpenAIController:>>> GENERATE IMAGES", {
      request,
      response: imageRequest,
      MODEL_NAME: CONFIG.OPENAI_IMAGES_MODEL_NAME,
    });
    response.json(imageRequest.data[0].url);
  } catch (error) {
    console.log("OpenAIController:>>> GENERATE IMAGES Error", {
      error,
    });
    next(error);
  }
};

const OpenAIController = {
  generateText,
  generateImages,
};

export default OpenAIController;
