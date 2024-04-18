import { Request, Response, NextFunction } from "express";
import OpenAi from "openai";

const openai = new OpenAi();

export const generateAnswer = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("expressApp.post:>>>", {
    params: request.params,
  });

  const userPrompt = request.params.userPrompt;

  // OpenAI Complete API Call
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
    });

    // response.status(200).json(completion.choices[0].message.content);
    response.json(completion.choices[0].message.content);
  } catch (error) {
    console.log("expressApp.post:>>> Error", {
      error,
    });

    // response.status(error.status).json(error.message);
    next(error);
  }
};

const OpenAIController = {
  generateAnswer,
};

export default OpenAIController;

// const OpenAIController = (expressApp) => {
//   const openai = new OpenAi();

//   expressApp.post("/api/openai/:userQuestion", async (request, response) => {
//     console.log("expressApp.post:>>>", {
//       params: request.params,
//     });

//     const userQuestion = request.params.userQuestion;

//     // OpenAI Complete API Call
//     try {
//       const completion = await openai.chat.completions.create({
//         messages: [{ role: "user", content: userQuestion }],
//         model: "gpt-3.5-turbo",
//         temperature: 0,
//         max_tokens: 1000,
//       });

//       response.status(200).json(completion.choices[0].message.content);
//     } catch (error) {
//       console.log("expressApp.post:>>> Error", {
//         error,
//       });

//       response.status(error.status).json(error.message);
//     }
//   });

//   // expressApp.get("/api/v1/:answer", async (request, response) => {
//   //   console.log("expressApp.get:>>>", {
//   //     answer: request.params.answer,
//   //   });
//   // });
// };

// export default OpenAIController;
