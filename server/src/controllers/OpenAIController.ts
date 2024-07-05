import { NextFunction, Request, Response } from "express";
import { Story, StoryAudioFile, StorySeo } from "src/models/types";
import {
  saveFileDataToDb,
  saveStorySeoToDb,
  saveStoryToDb,
} from "../models/mongoDb";

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
  const { storyPrompt, profileInfo, storyParams } = request.body;

  // OpenAI Text Generation API Call
  try {
    const createRequest = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a Story Creator.",
        },
        {
          role: "user",
          content: storyPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
    });
    const openaiResponse = createRequest.choices[0].message.content;

    if (openaiResponse.length) {
      // Extract the parts from the story
      const storyParts = extractStoryParts(openaiResponse);

      try {
        // Save story to MongoDB Atlas
        const storyId = await saveStoryToDb(
          {
            ...storyParts,
            createdAt: new Date(),
          },
          profileInfo,
          storyParams
        );

        const newStoryData = {
          ...storyParts,
          _id: storyId,
          createdAt: new Date(),
          profileInfo,
          storyParams,
        };

        response.json({
          ...newStoryData,
        });
      } catch (error) {
        throw new Error("❌ Failed to save the created story to Db", {
          cause: error,
        });
      }
    }

    console.log("✅  Story Created Successfully", {
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

export const createStorySeo = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { storyId, userSeoPrompt } = request.body;

  // OpenAI Text Generation API Call
  try {
    const createRequest = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are s Search Engine Optimization expert.",
        },
        {
          role: "user",
          content: userSeoPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME,
      temperature: 0,
    });
    const openaiResponse = createRequest.choices[0].message.content;

    const storySEO: StorySeo = {
      content: openaiResponse.replace(/{|}/g, ""),
      createdAt: new Date(),
    };

    if (openaiResponse.length) {
      try {
        // Save story to MongoDB Atlas
        await saveStorySeoToDb(storyId, storySEO);

        response.json(storySEO);
      } catch (error) {
        throw new Error("❌ Failed to save the created story SEO to Db", {
          cause: error,
        });
      }
    }

    console.log("✅ Story SEO Created Successfully", {
      request: request.path,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });
  } catch (error) {
    console.error("❌ Failed to create the story SEO!", {
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
  const { storyId, userPrompt, fileName, audioFileVoice } = request.body;
  const {
    SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
    SERVER_TEXT_TO_SPEECH_PATH,
    OPENAI_TTS_MODEL_NAME,
  } = CONFIG;

  // OpenAI Text-to-Speech Generation API Call
  try {
    const createRequest = await openai.audio.speech.create({
      speed: 1.0,
      voice: audioFileVoice ?? "nova",
      input: userPrompt,
      response_format: "mp3",
      model: CONFIG.OPENAI_TTS_MODEL_NAME || "tts-1-hd",
    });

    const audioFileName = `${fileName}.mp3`;
    const filePath = `${CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
    const buffer = Buffer.from(await createRequest.arrayBuffer());
    !fs.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
      fs.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
        recursive: true,
      });
    await fs.promises.writeFile(filePath, buffer);

    try {
      // Upload file to Amazon S3
      const fileUrl = await uploadFileToS3(fileName, filePath);
      if (fileUrl) {
        try {
          // Save file to MongoDB Atlas
          await saveFileDataToDb(storyId, audioFileName, fileUrl);
        } catch (error) {
          throw new Error(
            "❌ Failed to save the S3 audio file URL file to Db!",
            { cause: error }
          );
        }
      } else {
        throw new Error("❌ Failed to upload file to S3!");
      }

      console.log("✅ The story audio file is created successfully.", {
        fileUrl,
      });

      const storyAudio: StoryAudioFile = {
        url: fileUrl,
        fileName: fileName,
        createdAt: new Date(),
      };

      response.json(storyAudio);
    } catch (error) {
      throw new Error("❌ Failed to save the S3 audio file URL file to Db!", {
        cause: error,
      });
    }
  } catch (error) {
    console.error("❌ Failed to create an audio file for the story", {
      cause: error,
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
  createStorySeo,
  createStoryAudio,
  createImages,
};

export default OpenAIController;
