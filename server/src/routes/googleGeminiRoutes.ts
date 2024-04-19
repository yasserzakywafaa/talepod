import express from "express";
import GoogleGeminiController from "../controllers/GoogleGeminiController";
import END_POINTS from "src/models/endpoints";

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
