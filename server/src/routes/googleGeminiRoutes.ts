import END_POINTS from "../models/endpoints";
import GoogleGeminiController from "../controllers/GoogleGeminiController";
import { Router } from "express";

const googleGeminiRouter = Router();

// Define API routes
googleGeminiRouter.post(
  END_POINTS.GOOGLE_GEMINI.CREATE.STORY,
  GoogleGeminiController.createStory
);

export default googleGeminiRouter;
