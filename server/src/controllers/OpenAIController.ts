import { NextFunction, Request, Response } from "express";

import AwsLogger from "../aws-logger";
import CONFIG from "../config";
import { IMAGES_SIZES } from "../models/openaiModel";
import OpenAi from "openai";
import fs from "fs";
import { saveFileDataToDb } from "../models/mongoDb";
import { uploadFileToS3 } from "../models/amazonS3";

const openai = new OpenAi();

export const generateText = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;
  // OpenAI Text Generation API Call
  try {
    const generateRequest = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
    });

    console.log("ℹ️ OpenAIController:>>> GENERATE TEXT", {
      path: request.path,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });
    AwsLogger.info("ℹ️ AWS Logger OpenAIController:>>> GENERATE TEXT", {
      path: request.path,
    });

    response.json(generateRequest.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAIController:>>> GENERATE TEXT Error", {
      error,
    });
    AwsLogger.error("❌ OpenAIController:>>> GENERATE TEXT Error", { error });
    next(error);
  }
};

export const generateTextToSpeech = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { userPrompt, fileName } = request.body;
  const {
    SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
    SERVER_TEXT_TO_SPEECH_PATH,
    OPENAI_TTS_MODEL_NAME,
  } = CONFIG;

  // OpenAI Text-to-Speech Generation API Call
  try {
    const generateRequest = await openai.audio.speech.create({
      speed: 1.0,
      voice: "nova",
      input: userPrompt,
      response_format: "mp3",
      model: CONFIG.OPENAI_TTS_MODEL_NAME,
    });

    const audioFileName = `${fileName}.mp3`;
    const filePath = `${CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
    const buffer = Buffer.from(await generateRequest.arrayBuffer());
    !fs.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
      fs.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
        recursive: true,
      });
    await fs.promises.writeFile(filePath, buffer);

    // Upload file to Amazon S3
    const fileUrl = await uploadFileToS3(fileName, filePath);

    if (fileUrl) {
      // Save file to MongoDB Atlas
      await saveFileDataToDb(audioFileName, fileUrl);
    } else {
      throw new Error("❌ Failed to upload file to S3");
    }

    console.log("ℹ️ OpenAI:>>> GENERATE TEXT TO SPEECH", {
      fileUrl,
      writePath: filePath,
      serverFilesPath: SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
      MODEL_NAME: OPENAI_TTS_MODEL_NAME,
    });

    response.json({
      fileUrl,
      fileName,
    });
  } catch (error) {
    console.error("❌ OpenAI:>>> GENERATE TEXT TO SPEECH Error", {
      error,
    });
    next(error);
  }
};

export const generateImages = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // const userPrompt = request.body.userPrompt;
  const { userPrompt, numImages } = request.body;

  // OpenAI Image Generation API Call
  try {
    const imageUrls = [];

    // Make multiple requests to generate each image
    for (let i = 0; i < numImages; i++) {
      const imageRequest = await openai.images.generate({
        n: 1, // Generate one image per request
        model: CONFIG.OPENAI_IMAGES_MODEL_NAME,
        size: IMAGES_SIZES["1024x1024"],
        response_format: "url",
        prompt: userPrompt,
        style: "natural",
        quality: "hd",
        // user: ""
      });

      // Extract the URL of the generated image from the response and add it to the array
      const imageUrl = imageRequest.data[0].url;
      imageUrls.push(imageUrl);
    }

    console.log("ℹ️ OpenAIController:>>> GENERATE IMAGES", {
      request,
      // response: imageRequest,
      response: imageUrls,
      MODEL_NAME: CONFIG.OPENAI_IMAGES_MODEL_NAME,
    });
    // response.json(imageRequest.data[0].url);
    response.json(imageUrls);
  } catch (error) {
    console.error("❌ OpenAIController:>>> GENERATE IMAGES Error", {
      error,
    });
    next(error);
  }
};

const OpenAIController = {
  generateText,
  generateTextToSpeech,
  generateImages,
};

export default OpenAIController;
