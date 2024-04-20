import END_POINTS from "../models/endpoints";
import OpenAIController from "../controllers/OpenAIController";
import express from "express";
// import END_POINTS from 'server/src/models/endpoints'
const openAIRouter = express.Router();

// Define API routes
openAIRouter.post(
  END_POINTS.OPENAI.USER_PROMPT,
  OpenAIController.generateAnswer
);
// openAIRouter.post('/api/openai/:userQuestion', openAIController.generateStory);

export default openAIRouter;
