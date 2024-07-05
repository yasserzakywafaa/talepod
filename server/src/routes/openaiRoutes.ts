import END_POINTS from "../models/endpoints";
import OpenAIController from "../controllers/OpenAIController";
import { Router } from "express";

const openAIRouter = Router();

// Define API routes
openAIRouter.post(END_POINTS.OPENAI.CREATE.STORY, OpenAIController.createStory);

openAIRouter.post(
  END_POINTS.OPENAI.CREATE.STORY_SEO,
  OpenAIController.createStorySeo
);

openAIRouter.post(
  END_POINTS.OPENAI.CREATE.STORY_AUDIO,
  OpenAIController.createStoryAudio
);

openAIRouter.post(
  END_POINTS.OPENAI.CREATE.IMAGES,
  OpenAIController.createImages
);

export default openAIRouter;
