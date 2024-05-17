import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { IMAGES_SIZES } from "../models/openaiModel";
import OpenAi from "openai";
import fs from "fs";
import { getAudioFileUrl } from "../utils/stringUtils";

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
      // max_tokens: 1000,
    });

    console.log("OpenAIController:>>> GENERATE TEXT", {
      request,
      response: generateRequest,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });

    response.json(generateRequest.choices[0].message.content);
  } catch (error) {
    console.log("OpenAIController:>>> GENERATE TEXT Error", {
      error,
    });
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
    const audioFilePath = `${CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
    const audioFileUrl = getAudioFileUrl(
      request.protocol,
      request.get("host"),
      SERVER_TEXT_TO_SPEECH_PATH,
      audioFileName
    );

    const buffer = Buffer.from(await generateRequest.arrayBuffer());
    !fs.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
      fs.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
        recursive: true,
      });
    await fs.promises.writeFile(audioFilePath, buffer);

    console.log("OpenAIController:>>> GENERATE TEXT TO SPEECH", {
      request,
      response: generateRequest,
      writePath: audioFilePath,
      serverFilesPath: SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH,
      audioFileUrl: audioFileUrl,
      MODEL_NAME: OPENAI_TTS_MODEL_NAME,
    });

    response.json({
      audioFileUrl,
      fileName,
    });
  } catch (error) {
    console.log("OpenAIController:>>> GENERATE TEXT TO SPEECH Error", {
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

    console.log("OpenAIController:>>> GENERATE IMAGES", {
      request,
      // response: imageRequest,
      response: imageUrls,
      MODEL_NAME: CONFIG.OPENAI_IMAGES_MODEL_NAME,
    });
    // response.json(imageRequest.data[0].url);
    response.json(imageUrls);
  } catch (error) {
    console.log("OpenAIController:>>> GENERATE IMAGES Error", {
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
