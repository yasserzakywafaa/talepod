import { DBCollections, database } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import CONFIG from "../config";
import { ObjectId } from "mongodb";

export const getAllStories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const stories = database.collection(DBCollections.Stories);
    const allStories = await stories.find().toArray(); // Convert the cursor to an array

    console.log("ℹ️  Fetched all stories successfully");

    response.status(200).json(allStories);
  } catch (error) {
    console.error("❌ Failed to get all stories!", {
      error,
    });
    next(error);
  }
};

export const getStoryById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const storyId = request.params.id;

  if (!ObjectId.isValid(storyId)) {
    response.status(400).json({ message: "❌ Invalid story ID" });
  }

  try {
    const stories = database.collection(DBCollections.Stories);
    const story = await stories.findOne({ _id: new ObjectId(storyId) });

    if (!story) {
      response.status(404).json({ message: "Story not found" });
    }

    console.log("ℹ️ Get Story by Id", { storyId });

    response.status(200).json(story);
  } catch (error) {
    console.error("❌ Failed to grt Story by Id!", {
      error,
    });
    next(error);
  }
};

const GoogleGeminiController = {
  getAllStories,
  getStoryById,
};

export default GoogleGeminiController;
