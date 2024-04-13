// node --version # Should be >= 18

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import CONFIG from "../../config";

const googleGeminiRequests = (expressApp) => {
  // Access your API key as an environment variable
  const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY_1 ?? "");
  const genAiModel = genAI.getGenerativeModel({
    model: CONFIG.GEMINI_MODEL_NAME ?? "",
  });
  const generationConfig = {
    topK: 1,
    topP: 1,
    temperature: 0.9,
    maxOutputTokens: 2048,
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  console.log("GEMINI_MODEL_NAME:>>>", CONFIG.GEMINI_MODEL_NAME);

  // Generate API
  expressApp.post(
    "/api/gemini/generate/:userPrompt",
    async (request, response) => {
      console.log("expressApp.post:>>>", {
        params: request.params,
      });
      const userPrompt = request.params.userPrompt;
      // Google Gemini Complete API Call
      try {
        const generateContentRequest = await genAiModel.generateContent(
          userPrompt
        );
        const generateContentResponseText =
          generateContentRequest.response.text();

        response.status(200).json(generateContentResponseText);
      } catch (error) {
        console.log("expressApp.post:>>> Error", {
          error,
        });

        response.status(error.status).json(error.message);
      }
    }
  );

  // Chat API
  expressApp.post("/api/gemini/chat/:userPrompt", async (request, response) => {
    console.log("expressApp.post:>>> CHAT", {
      params: request.params,
    });
    const chat = genAiModel.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });
    const userPrompt = request.params.userPrompt;
    // Google Gemini Complete API Call
    try {
      const chatRequest = await chat.sendMessage(userPrompt);
      const chatResponseText = chatRequest.response.text();

      response.status(200).json(chatResponseText);
    } catch (error) {
      console.log("expressApp.post:>>> Error", {
        error,
      });

      response.status(error.status).json(error.message);
    }
  });

  // expressApp.get("/api/v1/:answer", async (request, response) => {
  //   console.log("expressApp.get:>>>", {
  //     answer: request.params.answer,
  //   });
  // });
};

export default googleGeminiRequests;
