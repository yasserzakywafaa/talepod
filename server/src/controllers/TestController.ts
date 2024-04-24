import { NextFunction, Request, Response } from "express";

export const testRoutOne = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;
  try {
    const request = {
      response: {
        data: "Testing Route ONE was successfully triggered!",
      },
    };

    console.log("TestController:>>> testRoutOne", {
      request,
      userPrompt,
      response: request.response.data,
    });
    response.json(request.response.data);
  } catch (error) {
    console.error("TestController:>>> testRoutOne Error", {
      error,
    });
    next(error);
  }
};


export const testRoutTwo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userPrompt = request.body.userPrompt;
    try {
      const request = {
        response: {
          data: "Testing Route TWO was successfully triggered!",
        },
      };
  
      console.log("TestController:>>> testRoutTwo", {
        request,
        userPrompt,
        response: request.response.data,
      });
      response.json(request.response.data);
    } catch (error) {
      console.error("TestController:>>> testRoutTwo Error", {
        error,
      });
      next(error);
    }
  };

const GoogleGeminiController = {
  testRoutOne,
  testRoutTwo,
};

export default GoogleGeminiController;
