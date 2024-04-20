import END_POINTS from "../models/endpoints";
import GoogleGeminiController from "../controllers/GoogleGeminiController";
import express from "express";

const googleGeminiRouter = express.Router();

// Define API routes
googleGeminiRouter.post(
  END_POINTS.GOOGLE_GEMINI.GENERATE,
  GoogleGeminiController.generateAnswer
);
googleGeminiRouter.post(
  END_POINTS.GOOGLE_GEMINI.CHAT,
  GoogleGeminiController.generateChat
);

export default googleGeminiRouter;
