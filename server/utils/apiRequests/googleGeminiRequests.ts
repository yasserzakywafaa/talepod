import { GoogleGenerativeAI } from "@google/generative-ai";
import CONFIG from "../../config";

const googleGeminiRequests = (expressApp) => {
  // Access your API key as an environment variable
  const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY_1 ?? "");

  console.log("GEMINI_API_KEY_1:>>>", CONFIG.GEMINI_API_KEY_1);

  expressApp.post("/api/gemini/:userPrompt", async (request, response) => {
    console.log("expressApp.post:>>>", {
      params: request.params,
    });

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const userPrompt = request.params.userPrompt;

    // Google Gemini Complete API Call
    try {
      const geminiRequest = await model.generateContent(userPrompt);
      const geminiResponse = await geminiRequest.response;
      const responseText = geminiResponse.text();

      response.status(200).json(responseText);
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
