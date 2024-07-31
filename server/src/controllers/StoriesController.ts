import {
  AggregationResult,
  DocumentWithId,
  PageResponse,
  PagingInfo,
  Story,
  StoryFilters,
} from "../models/types";
import { Collection, WithId } from "mongodb";
import { DBCollections, database } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

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

    // Aggregation pipeline
    const pipeline = [
      {
        $unionWith: {
          coll: DBCollections.stories,
          pipeline: [{ $match: getQuery(filters) }],
        },
      },
      // Build the match stage for filters
      ...(hasActiveFilters ? [{ $match: getQuery(filters) }] : []),
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [
            { $count: "totalStoriesCount" },
            { $addFields: { pageNumber, pageSize } },
          ],
          // Paginate results
          results: [
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ];

    const aggregatedStories = await database
      .collection(DBCollections.stories_library)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } = aggregatedStories[0] as AggregationResult;
    const totalCount = metadata[0] ? metadata[0].totalStoriesCount : 0;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all stories successfully", {
      filters,
      hasActiveFilters,
      metadata,
      totalPagesCount,
    });

    const paging: PagingInfo = {
      pageNumber,
      pageSize,
      totalCount,
      totalPagesCount,
    };

    response.status(200).json({
      results,
      paging,
    });

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // // Get all stories in collection
    // const allStoriesDocuments = database.collection(DBCollections.stories);
    // const allStoriesDocumentsCount = await allStoriesDocuments.countDocuments();

    // // Get all stories by filters (if any)
    // const filteredDocuments = allStoriesDocuments
    //   .find(getQuery(filters))
    //   .sort({ createdAt: -1, [StoryFiltersEnum.language]: -1 });
    // const filteredStoriesCount = (await filteredDocuments.toArray()).length;

    // // Get only the pagination stories by same filter (if any)
    // const filteredDocumentsClone = allStoriesDocuments
    //   .find(getQuery(filters))
    //   .sort({ createdAt: -1, [StoryFiltersEnum.language]: -1 })
    //   .clone();
    // const filteredStories = await filteredDocumentsClone
    //   .skip((Number(pageNumber) - 1) * Number(pageSize))
    //   .limit(pageSize)
    //   .toArray();

    // const totalCount = hasActiveFilters
    //   ? filteredStoriesCount
    //   : allStoriesDocumentsCount;

    // const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    // console.log("ℹ️  Fetched all stories successfully", {
    //   filters,
    //   hasActiveFilters,
    //   allStoriesDocumentsCount,
    //   filteredStoriesCount,
    //   totalCount,
    //   totalPagesCount,
    // });

    // const paging: PagingInfo = {
    //   pageNumber,
    //   pageSize,
    //   totalPagesCount,
    //   totalCount,
    // };
    // response.status(200).json({
    //   results: filteredStories as DocumentWithId[],
    //   paging,
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
    // Use MongoDB’s $unionWith aggregation pipeline stage
    // to perform a union of the two collections and then filter by the slug.
    const pipeline = [
      {
        $unionWith: {
          coll: DBCollections.stories_library,
          pipeline: [],
        },
      },
      { $match: { slug: storySlug } },
      { $limit: 1 },
    ];

    const results = await database
      .collection(DBCollections.stories)
      .aggregate(pipeline)
      .toArray();

    if (results.length > 0) {
      const story = results[0] as Story;
      console.log("✅ Get Story by slug:", {
        storySlug,
        storyTitle: story.title,
      });
      response.status(200).json(story);
    } else {
      response.status(404).json({ message: "❌ Story not found!" });
    }
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
