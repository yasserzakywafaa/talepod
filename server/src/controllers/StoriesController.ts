import { DBCollections, database } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { Collection, WithId } from "mongodb";
import { DocumentWithId, PageResponse, StoryFilters } from "../models/types";
import { getQuery } from "../models/mongoDb/query";

// import { getSlugFromText } from "../utils/stringUtils";
// import { updateDocument } from "../models/mongoDb/crudOperations";

// let globalAllStories;

export const getAllStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction
) => {
  try {
    const stories = database.collection(DBCollections.Stories);

    const totalCount = await stories.countDocuments();
    const pageNumber = parseInt(JSON.stringify(request.query.page)) || 1;
    // const pageSize = parseInt(JSON.stringify(request.query.page)) || 20;
    const pageSize = parseInt(JSON.stringify(request.query.page));
    const totalPagesCount = pageSize ? Math.round(totalCount / pageSize) : 0;

    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}"
    );
    const filtersQuery = getQuery(filters);

    const filteredStories = await stories
      .find(filtersQuery, {
        sort: { createdAt: -1 },
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize,
      })
      .toArray();

    console.log("ℹ️  request.params:>>>", {
      filters,
      pageSize,
      filtersQuery,
      totalCount,
      totalPagesCount,
      data: filteredStories.map((d) => d.title),
    });

    console.log("ℹ️  Fetched all stories successfully");

    const paging = {
      pageNumber,
      pageSize,
      totalPagesCount,
      totalCount,
    };

    response.status(200).json(filteredStories as any);
    // response.status(200).json({
    //   paging,
    //   results: filteredStories as DocumentWithId[],
    // });
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

const GoogleGeminiController = {
  getAllStories,
  getStoryBySlug,
};

export default GoogleGeminiController;
