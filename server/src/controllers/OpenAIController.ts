import { NextFunction, Request, Response } from "express";

import OpenAi from "openai";
import CONFIG from "../config";

const openai = new OpenAi();

export const generateText = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("OpenAIController:>>> GENERATE TEXT", {
    params: request.params,
  });
  const userPrompt = request.params.userPrompt;

  // OpenAI Text Generation API Call
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
      max_tokens: 1000,
    });

    response.json(completion.choices[0].message.content);
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
  console.log("OpenAIController:>>> GENERATE IMAGES", {
    params: request.params,
  });
  const userPrompt = request.params.userPrompt;

  // OpenAI Image Generation API Call
  try {
    const imageRequest = await openai.images.generate({
      model: "dall-e-3",
      prompt: userPrompt,
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
