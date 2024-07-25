import { DBCollections, database } from "../models/mongoDb";
import {
  DocumentWithId,
  PageResponse,
  PagingInfo,
  StoryFilters,
} from "src/models/types";
import { NextFunction, Request, Response } from "express";

import { Collection } from "mongodb";
import { getQuery } from "../models/mongoDb/query";

export const getAllStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction
) => {
  try {
    const stories = database.collection(DBCollections.Stories);

    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}"
    );
    const { pageNumber, pageSize } = filters;
    const filtersQuery = getQuery(filters);
    const totalCount = await stories.countDocuments();
    const totalPagesCount = pageSize ? Math.round(totalCount / pageSize) : 0;

    const filteredStories = await stories
      .find(filtersQuery, {
        sort: { createdAt: -1 },
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      })
      .toArray();

    console.log("ℹ️  Fetched all stories successfully", {
      filters,
      totalCount,
      totalPagesCount,
      // filteredStories: filteredStories.map((d) => d.title),
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
