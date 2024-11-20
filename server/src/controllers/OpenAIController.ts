import {
  DBCollections,
  getDocumentFromDb,
  saveFileDataToDb,
  saveStorySeoToDb,
  saveStoryToDb,
} from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";
import {
  ProfileInfo,
  Story,
  StoryAudioFile,
  StoryParams,
  StoryParts,
  StorySeo,
  SubscriptionPlanEnum,
  User,
  UserRole,
  UserStatus,
} from "../models/types";
import { getSlugFromText, replaceSpaceWithDash } from "../utils/stringUtils";

import CONFIG from "../config";
import { IMAGES_SIZES } from "../models/openaiModel";
import { ObjectId } from "mongodb";
import OpenAi from "openai";
import extractStoryParts from "../utils/extractStoryParts";
import fs from "fs";
import retry from "../utils/retryFunction";
import { updateDocument } from "../models/mongoDb/crudOperations";
import { uploadFileToS3 } from "../models/amazonS3";

const openai = new OpenAi();

export const createStory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { storyPrompt } = request.body;
  const profileInfo = request.body.profileInfo as ProfileInfo;
  const storyParams = request.body.storyParams as StoryParams;
  const userInfo = request.body.userInfo as User;
  const user = (await getDocumentFromDb(
    new ObjectId(userInfo._id),
    DBCollections.users
  )) as User;

  const createStoryRequest = async (): Promise<string> => {
    // OpenAI Text Generation API Call
    const createRequest = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a friendly and expressive storyteller that is an expert on storytelling. Your stories should sound natural and conversational.",
        },
        {
          role: "user",
          content: storyPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME,
      n: 1,
      max_tokens: 1000,
      temperature: 0.4,
    });

    return createRequest.choices[0].message.content;
  };

  const createAndExtractStoryParts = async (): Promise<StoryParts> => {
    const openaiResponse = await createStoryRequest();

    if (openaiResponse.length) {
      // Extract the parts from the story
      return extractStoryParts(openaiResponse);
    } else {
      throw new Error("❌ Failed to create a story!");
    }
  };

  if (
    user.role !== UserRole.admin &&
    user.storyCount >= user.subscription.maxStoriesAllowed
  ) {
    response.status(403).json({
      message: `You have consumed your maximum credit of ${user.subscription.maxStoriesAllowed} stories`,
    });
  }
  if (user.status !== UserStatus.active) {
    response.status(403).json({
      message: "Your account is not active and not allowed to create stories!",
    });
  }

  let storyId: ObjectId | undefined;
  try {
    const storyParts = await retry(createAndExtractStoryParts, 3, 2000);
    const totalCharacters = (storyParts.mainStory + storyParts.poem).length;

    // Count the total characters in the story
    if (totalCharacters > 4000) {
      throw new Error(
        "❌ The story exceeds the maximum number of characters [4,000]!"
      );
    }
    const storyData: Partial<Story> = {
      ...storyParts,
      author: user._id,
      createdAt: new Date(),
      isPremium:
        user.isPaidUser && user.subscription.type !== SubscriptionPlanEnum.Free,
    };
    const updatedStoryParams: StoryParams = {
      ...storyParams,
      totalCharacters,
    };

    try {
      // Save story to MongoDB Atlas
      storyId = await saveStoryToDb(storyData, profileInfo, updatedStoryParams);

      // Update the story document with the slug (title + id)
      const storyWithSlug = (await updateDocument<Story>(
        storyId.toString(),
        {
          slug: `${getSlugFromText(storyParts.title)}-${storyId
            .toString()
            .slice(-9)}`,
        },
        DBCollections.stories
      )) as Story;
      storyData["slug"] = storyWithSlug.slug;

      response.json({
        ...storyData,
        _id: storyId,
        profileInfo,
        storyParams,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new Error("❌ Failed to save the created story to Db", {
        cause: error,
      });
    }

    // Update User with story
    if (storyId) {
      try {
        const updatedUser = (await updateDocument<User>(
          user._id.toString(),
          {
            storyCount: user.storyCount + 1,
            stories: [...user.stories, storyId.toString()],
          },
          DBCollections.users
        )) as User;

        console.log(`✅ User updated with new storyId:>>>`, {
          storyId,
          userStories: updatedUser.stories,
        });
      } catch (error) {
        throw new Error("❌ Failed to the user info to Db", {
          cause: error,
        });
      }
    }

    console.log("✅ Story Created Successfully", {
      request: request.path,
      storySlug: storyData.slug,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });
  } catch (error) {
    next(`❌ Failed to create a story! ${error}`);
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
          content: "You are a Search Engine Optimization expert.",
        },
        {
          role: "user",
          content: userSeoPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME,
      n: 1,
    });
    const openaiResponse = createRequest.choices[0].message.content;
    const storySEO: StorySeo = {
      createdAt: new Date(),
      content: openaiResponse
        .replace(/{|}/g, "")
        .replaceAll("```", "")
        .replaceAll("html", "")
        .trim(),
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
  const { storyId, storyText, fileName, audioFileVoice } = request.body;
  const { SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH } = CONFIG;

  // OpenAI Text-to-Speech Generation API Call
  try {
    const createRequest = await openai.audio.speech.create({
      speed: 0.98,
      input: storyText,
      response_format: "mp3",
      voice: audioFileVoice ?? "nova",
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
