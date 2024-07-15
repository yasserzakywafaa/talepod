import { Collection, WithId } from "mongodb";
import { DBCollections, database } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { replaceSpaceWithDash } from "../utils/stringUtils";
import { updateDocument } from "../models/mongoDb/crudOperations";

let globalAllStories;

export const getAllStories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const stories = database.collection(DBCollections.Stories);
    const allStories = await stories.find().sort({ createdAt: -1 }).toArray(); // Convert the cursor to an array

    globalAllStories = allStories;
    // bulkUpdateStoriesByField(globalAllStories);

    console.log("ℹ️  Fetched all stories successfully");

    response.status(200).json(allStories);
  } catch (error) {
    console.error("❌ Failed to get all stories!", {
      error,
    });
    next(error);
  }
};

export const getStoryBySlug = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const storySlug = request.params.slug;
  if (!storySlug || typeof storySlug !== "string") {
    response.status(400).json({ message: "❌ Invalid story slug" });
    return;
  }

  try {
    const stories: Collection = database.collection(DBCollections.Stories);
    const story = await stories.findOne({ slug: storySlug });

    if (!story || !storySlug) {
      response.status(404).json({ message: "❌ Story not found" });
      return;
    }

    console.log("ℹ️  Get Story", { storySlug, storyTitle: story.title });

    response.status(200).json(story);
  } catch (error) {
    console.error("❌ Failed to get Story by slug!", {
      error,
    });
    next(error);
  }
};

// FOR DEVELOPMENT USE ONLY
const bulkUpdateStoriesByField = (allStories) => {
  try {
    allStories.forEach(async (story) => {
      await updateDocument(story._id.toString(), DBCollections.Stories, {
        // slug: replaceSpaceWithDash(story.title.toLowerCase()),
        seo: undefined,
      });
      console.log("ℹ️ Story title:>>>", {
        storyTitle: story.title,
        storySeo: story.seo,
      });
    });
  } catch (error) {
    throw new Error("❌ Failed to update story slug", { cause: error });
  }
};

const GoogleGeminiController = {
  getAllStories,
  getStoryBySlug,
};

export default GoogleGeminiController;
