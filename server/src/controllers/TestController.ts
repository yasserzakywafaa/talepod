import { NextFunction, Request, Response } from "express";

export const testHello = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log("ℹ️  Testing testHello route");

    response
      .status(200)
      .json({ name: "👋🏻  HELLO --talepod-- application TEST 111 🙋🏻‍♂️" });
  } catch (error) {
    console.error("❌ Failed to get all stories!", {
      error,
    });
    next(error);
  }
};

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

    console.log("ℹ️  Testing testRoutOne route", {
      request,
      userPrompt,
      response: request.response.data,
    });
    response.json(request.response.data);
  } catch (error) {
    console.error("❌ Failed to connect to testRoutOne!", {
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

    console.log("ℹ️  Testing testRoutOne route", {
      request,
      userPrompt,
      response: request.response.data,
    });
    response.json(request.response.data);
  } catch (error) {
    console.error("❌ Failed to connect to testRoutTwo", {
      error,
    });
    next(error);
  }
};

const TestController = {
  testHello,
  testRoutOne,
  testRoutTwo,
};

export default TestController;
