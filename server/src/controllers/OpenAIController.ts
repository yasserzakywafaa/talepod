import { NextFunction, Request, Response } from "express";
import { saveFileDataToDb, saveStoryToDb } from "../models/mongoDb";

import CONFIG from "../config";
import { IMAGES_SIZES } from "../models/openaiModel";
import OpenAi from "openai";
import extractStoryParts from "../utils/extractStoryParts";
import fs from "fs";
import { uploadFileToS3 } from "../models/amazonS3";

const openai = new OpenAi();

export const createStory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userPrompt = request.body.userPrompt;
  // OpenAI Text Generation API Call
  try {
    const createRequest = await openai.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
    });
    const openaiResponse = createRequest.choices[0].message.content;

    if (openaiResponse.length) {
      // Extract the parts from the story
      const storyParts = extractStoryParts(openaiResponse);

      try {
        // Save story to MongoDB Atlas
        const storyId = await saveStoryToDb({
          ...storyParts,
          createdAt: new Date(),
        });

        response.json({
          storyId,
          storyParts
        });
      } catch (error) {
        throw new Error("❌ Failed to save the created story to Db", {
          cause: error,
        });
      }
    }

    console.log("ℹ️  Created Story Successfully", {
      request: request.path,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });
  } catch (error) {
    console.error("❌ Failed to create a story!", {
      error,
    });
    next(error);
  }
};

export const createStoryAudio = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { storyId, userPrompt, fileName } = request.body;
  const {
    SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
    SERVER_TEXT_TO_SPEECH_PATH,
    OPENAI_TTS_MODEL_NAME,
  } = CONFIG;

  // OpenAI Text-to-Speech Generation API Call
  try {
    const createRequest = await openai.audio.speech.create({
      speed: 1.0,
      voice: "nova",
      input: userPrompt,
      response_format: "mp3",
      model: CONFIG.OPENAI_TTS_MODEL_NAME,
    });

    const audioFileName = `${fileName}.mp3`;
    const filePath = `${CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
    const buffer = Buffer.from(await createRequest.arrayBuffer());
    !fs.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
      fs.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
        recursive: true,
      });
    await fs.promises.writeFile(filePath, buffer);

    // Upload file to Amazon S3
    const fileUrl = await uploadFileToS3(fileName, filePath);

    if (fileUrl) {
      try {
        // Save file to MongoDB Atlas
        await saveFileDataToDb(storyId, audioFileName, fileUrl);
      } catch (error) {
        throw new Error("❌ Failed to save the S3 audio file URL file to Db!", {
          cause: error,
        });
      }
    } else {
      console.error("❌ Failed to upload file to S3!");
    }

    console.log("ℹ️  The story audio file is created successfully.", {
      fileUrl,
      MODEL_NAME: OPENAI_TTS_MODEL_NAME,
    });

    response.json({
      fileUrl,
      fileName,
    });
  } catch (error) {
    console.error("❌ Failed to create an audio file for the story", {
      error,
    });
    next(error);
  }
};

export const createImages = async (
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

    console.log("ℹ️  Image create successfully", {
      request,
      // response: imageRequest,
      response: imageUrls,
      MODEL_NAME: CONFIG.OPENAI_IMAGES_MODEL_NAME,
    });
    // response.json(imageRequest.data[0].url);
    response.json(imageUrls);
  } catch (error) {
    console.error("❌ Failed to create images", {
      error,
    });
    next(error);
  }
};

const OpenAIController = {
  createStory,
  createStoryAudio,
  createImages,
};

export default OpenAIController;
