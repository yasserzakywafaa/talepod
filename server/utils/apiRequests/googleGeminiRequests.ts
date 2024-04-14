// node --version # Should be >= 18

import {
  GoogleGenerativeAI,
  ChatSession,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import CONFIG from "../../config";

const googleGeminiRequests = (expressApp) => {
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

  // Generative AI
  const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY_1 ?? "");
  const genAiModel = genAI.getGenerativeModel({
    model: CONFIG.GEMINI_MODEL_NAME ?? "",
    generationConfig,
    safetySettings,
  });

  // Chat Session with the model
  new ChatSession(
    CONFIG.GEMINI_API_KEY_1 ?? "",
    CONFIG.GEMINI_MODEL_NAME ?? "",
    {
      history: [],
      generationConfig,
      safetySettings,
    }
  );

  console.log("GEMINI_MODEL_NAME:>>>", CONFIG.GEMINI_MODEL_NAME);

  // Generate API
  expressApp.post(
    "/api/gemini/generate/:userPrompt",
    async (request, response) => {
      const userPrompt = request.params.userPrompt;
      // Google Gemini Complete API Call
      try {
        const generateContentRequest = await genAiModel.generateContent(
          userPrompt
        );
        const generateContentResponseText =
          generateContentRequest.response.text();

        console.log("expressApp.post:>>> GENERATE", {
          requestParams: request.params,
          response: generateContentResponseText,
        });

        response.status(200).json(generateContentResponseText);
      } catch (error) {
        let statusCode = 400;
        if (error.message.indexOf("400") > -1) {
          statusCode = 400;
        }
        console.log("expressApp.post:>>> Error", {
          error,
          message: error.message,
          statusCode,
        });

        response.status(statusCode).json({
          statusCode,
          message: error.message,
        });
      }
    }
  );

  // Chat API
  expressApp.post("/api/gemini/chat/:userPrompt", async (request, response) => {
    const chat = genAiModel.startChat();
    const userPrompt = request.params.userPrompt;
    // Google Gemini Complete API Call
    try {
      const chatResponse = await chat.sendMessage(userPrompt);
      const chatResponseText = chatResponse.response.text();

      console.log("expressApp.post:>>> CHAT", {
        requestParams: request.params,
        response: chatResponseText,
      });

      response.status(200).json(chatResponseText);
    } catch (error) {
      console.log("expressApp.post:>>> CHAT Error", {
        error,
      });

      response.status(error).json(error);
    }
  });

  // expressApp.get("/api/v1/:answer", async (request, response) => {
  //   console.log("expressApp.get:>>>", {
  //     answer: request.params.answer,
  //   });
  // });
};

export default googleGeminiRequests;
