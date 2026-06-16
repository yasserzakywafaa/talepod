import { NextFunction, Request, Response } from "express";
import {
  ProfileInfo,
  StoryAudioFile,
  StoryFormat,
  StoryParams,
  StorySeo,
  User,
} from "../models/types";
import {
  createOpenRouterClient,
  handleOpenRouterAIRequest,
} from "../utils/openRouterClient";
import { saveFileDataToDb, saveStorySeoToDb } from "../models/mongoDb";

import CONFIG from "../config";
import fs from "fs";
import { ObjectId } from "mongodb";
import {
  DBCollectionsEnum,
  getDocumentFromDb,
} from "../models/mongoDb";
import { Story } from "../models/types";
import { handleCreateBlogRequest } from "../services/create/blog";
import {
  createStoryPlaceholder,
  generateStoryText,
  resolveAvatarMeta,
  validateUserCanCreate,
} from "../services/create/story";
import {
  generateImage,
  handleGenerateStoryImages,
} from "../services/create/images";
import { uploadFileToS3 } from "../services/amazonS3";
import { chunkTextForTts } from "../utils/ttsChunk";

const getOpenRouterSdkClient = () => createOpenRouterClient();

export const createStory = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { storyPrompt } = request.body;
  const profileInfo = request.body.profileInfo as ProfileInfo;
  const storyParams = request.body.storyParams as StoryParams;
  const userInfo = request.body.userInfo as User;
  // Absent on pre-V2 clients → defaults to "long" for back-compat.
  const format = (request.body.format as StoryFormat) ?? "long";
  // Chosen illustration style id; resolved to the default style if absent.
  const artStyle = request.body.artStyle as string | undefined;
  // Optional saved character whose description seeds the story's characterSheet.
  const avatarId = request.body.avatarId as string | undefined;

  console.log("⌛︎  Creating Story...", {
    request: request.path,
    format,
    artStyle,
    avatarId,
  });

  try {
    const user = (await getDocumentFromDb(
      new ObjectId(userInfo._id),
      DBCollectionsEnum.users,
    )) as User;

    // Synchronous gate (throws → handled below) so blocked/over-limit accounts
    // never create a placeholder. Resolve the chosen saved character once.
    const { willUseCredit, availableCredits } = validateUserCanCreate(user);
    const avatarMeta = await resolveAvatarMeta(user, avatarId);

    const input = {
      storyPrompt,
      profileInfo,
      storyParams,
      user,
      format,
      artStyle,
      avatarId,
    };

    // Create + return a "pending" placeholder instantly; the client starts a
    // progress chip and polls the status endpoint until the text lands.
    const placeholder = await createStoryPlaceholder(input, avatarMeta);
    response.json(placeholder);

    // Background, best-effort: generate the text, then (only on success) chain
    // illustration generation. The client polls `textStatus` then `imagesStatus`.
    const storyId = String(placeholder._id);
    void generateStoryText(
      input,
      storyId,
      willUseCredit,
      availableCredits,
      avatarMeta,
    ).then((ok) => {
      if (ok) handleGenerateStoryImages(storyId);
    });
  } catch (error) {
    next(`❌ ${error}`);
  }
};

/**
 * Lightweight polling endpoint for the docked generation chip. Keyed by story
 * id (stable — the slug changes once the title is generated). Returns just the
 * fields the chip needs to show progress and build the "View story" link.
 */
export const getStoryGenerationStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { storyId } = request.params;
  if (!storyId || !ObjectId.isValid(storyId)) {
    response.status(400).json({ message: "❌ Invalid story id" });
    return;
  }

  try {
    const story = (await getDocumentFromDb(
      new ObjectId(storyId),
      DBCollectionsEnum.stories,
    )) as Story | null;

    if (!story) {
      response.status(404).json({ message: "❌ Story not found!" });
      return;
    }

    response.json({
      textStatus: story.textStatus,
      imagesStatus: story.imagesStatus,
      slug: story.slug,
      title: story.title,
    });
  } catch (error) {
    next(error);
  }
};

export const createStorySeo = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { storyId, userSeoPrompt } = request.body;

  try {
    const createRequest = await handleOpenRouterAIRequest(
      CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
      [
        {
          role: "system",
          content: "You are a Search Engine Optimization expert.",
        },
        {
          role: "user",
          content: userSeoPrompt,
        },
      ],
      {
        max_tokens: CONFIG.AI_MAX_TOKENS.DEFAULT,
      },
    );

    const first = createRequest.choices[0] as {
      message?: { content?: string | null };
    };
    const text = first?.message?.content;
    if (!text) return;

    const storySEO: StorySeo = {
      createdAt: new Date(),
      content: text
        .replace(/{|}/g, "")
        .replaceAll("```", "")
        .replaceAll("html", "")
        .trim(),
    };

    if (text.length) {
      try {
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
      MODEL_NAME: CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
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
  next: NextFunction,
) => {
  const { storyId, storyText, fileName, audioFileVoice } = request.body;
  const { SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH } = CONFIG;

  try {
    // Warm, calm bedtime steering. gpt-4o-mini-tts honours `instructions`;
    // models that don't support it simply ignore the field.
    const bedtimeInstructions =
      "Narrate like a gentle bedtime storyteller: a warm, soft, soothing voice with slow, calm pacing and tender, cozy expressiveness — as if gently reading a young child to sleep.";

    // TTS input is length-capped (≈2k tokens / 4096 chars), so synthesize the
    // story in sentence-aligned chunks and stitch the MP3 buffers into one file.
    // This fixes long stories that were previously truncated to a single call.
    const chunks = chunkTextForTts(storyText);
    if (!chunks.length) {
      throw new Error("No narratable text was provided for audio generation.");
    }

    const client = getOpenRouterSdkClient();
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const createRequest = await client.audio.speech.create({
        speed: 0.95,
        input: chunk,
        response_format: "mp3",
        voice: audioFileVoice ?? "nova",
        model: CONFIG.OPENROUTER_TTS_MODEL,
        instructions: bedtimeInstructions,
      } as Parameters<typeof client.audio.speech.create>[0] & {
        instructions?: string;
      });
      audioBuffers.push(Buffer.from(await createRequest.arrayBuffer()));
    }
    const audioData = Buffer.concat(audioBuffers);

    const audioFileName = `${fileName}.mp3`;
    const filePath = `${CONFIG.SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH}/${audioFileName}`;
    !fs.existsSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH) &&
      fs.mkdirSync(SERVER_TEXT_TO_SPEECH_ABSOLUTE_PATH, {
        recursive: true,
      });
    await fs.promises.writeFile(filePath, audioData);

    try {
      const fileUrl = await uploadFileToS3(fileName, filePath);
      if (fileUrl) {
        try {
          await saveFileDataToDb(storyId, audioFileName, fileUrl);
        } catch (error) {
          throw new Error(
            "❌ Failed to save the S3 audio file URL file to Db!",
            { cause: error },
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
  next: NextFunction,
) => {
  const { userPrompt, numImages } = request.body;

  try {
    const imageUrls: string[] = [];

    for (let i = 0; i < numImages; i++) {
      const imageUrl = await generateImage(userPrompt, `generated-image-${i + 1}`);
      imageUrl && imageUrls.push(imageUrl);
    }

    console.log("ℹ️  Image create successfully", {
      request,
      response: imageUrls,
      MODEL_NAME: CONFIG.OPENROUTER_IMAGES_MODEL,
    });
    response.json(imageUrls);
  } catch (error) {
    console.error("❌ Failed to create images", {
      error,
    });
    next(error);
  }
};

export const createBlog = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { blogPrompt } = request.body;
  if (!blogPrompt || typeof blogPrompt !== "string") {
    response.status(400).json({ message: "blogPrompt is required" });
    return;
  }
  try {
    const content = await handleCreateBlogRequest(blogPrompt);
    response.json({ content });
  } catch (error) {
    next(error);
  }
};

const OpenAIController = {
  createStory,
  getStoryGenerationStatus,
  createStorySeo,
  createStoryAudio,
  createImages,
  createBlog,
};

export default OpenAIController;
