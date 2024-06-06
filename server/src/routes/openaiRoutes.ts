import END_POINTS from "../models/endpoints";
import OpenAIController from "../controllers/OpenAIController";
import { Router } from "express";

const openAIRouter = Router();

// Define API routes
openAIRouter.post(
  END_POINTS.OPENAI.GENERATE.TEXT,
  OpenAIController.generateText
);

openAIRouter.post(
  END_POINTS.OPENAI.GENERATE.TEXT_TO_SPEECH,
  OpenAIController.generateTextToSpeech
);

openAIRouter.post(
  END_POINTS.OPENAI.GENERATE.IMAGES,
  OpenAIController.generateImages
);

export default openAIRouter;
