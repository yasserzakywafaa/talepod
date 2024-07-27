import { DBCollections, database } from "../models/mongoDb";
import {
  DocumentWithId,
  PageResponse,
  PagingInfo,
  StoryFilters,
  StoryFiltersEnum,
} from "../models/types";
import { NextFunction, Request, Response } from "express";

import { Collection } from "mongodb";
import { getQuery } from "../models/mongoDb/query";

export const getAllStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction
) => {
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}"
    );
    const { pageNumber = 1, pageSize = 20 } = filters;

    // Get all stories in collection
    const allStoriesDocuments = database.collection(DBCollections.Stories);
    const allStoriesDocumentsCount = await allStoriesDocuments.countDocuments();

    // Get all stories by filters (if any)
    const totalFilteredStories = allStoriesDocuments
      .find(getQuery(filters))
      .sort({ createdAt: -1, [StoryFiltersEnum.language]: -1 });
    const totalFilteredStoriesCount = (await totalFilteredStories.toArray())
      .length;

    // Get only the pagination stories by same filter (if any)
    const totalFilteredStoriesClone = allStoriesDocuments
      .find(getQuery(filters))
      .sort({ createdAt: -1, [StoryFiltersEnum.language]: -1 })
      .clone();
    const filteredStories = await totalFilteredStoriesClone
      .skip((Number(pageNumber) - 1) * Number(pageSize))
      .limit(pageSize)
      .toArray();

    const totalCount = hasActiveFilters
      ? totalFilteredStoriesCount
      : allStoriesDocumentsCount;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all stories successfully", {
      filters,
      hasActiveFilters,
      allStoriesDocumentsCount,
      totalFilteredStoriesCount,
      filteredStoriesCount: filteredStories.length,
      totalCount,
      totalPagesCount,
    });

    const paging: PagingInfo = {
      pageNumber,
      pageSize,
      totalPagesCount,
      totalCount,
    };

    response.status(200).json({
      results: filteredStories as DocumentWithId[],
      paging,
    });
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

// // FOR DEVELOPMENT USE ONLY
// let globalAllStories;
// const bulkUpdateStoriesByField = (allStories) => {
//   try {
//     allStories.forEach(async (story) => {
//       // await updateDocument(story._id.toString(), DBCollections.Stories, {
//       //   // // slug: replaceSpaceWithDash(story.title.toLowerCase()),
//       //   // slug: getSlugFromText(story.title),
//       // });
//       console.log("ℹ️ Story title:>>>", {
//         storyTitle: story.title,
//         storySlug: getSlugFromText(story.title),
//       });
//     });
//   } catch (error) {
//     throw new Error("❌ Failed to update story slug", { cause: error });
//   }
// };

const StoriesController = {
  getAllStories,
  getStoryBySlug,
};

export default StoriesController;
