import {
  AggregationResult,
  DocumentWithId,
  PageErrorResponse,
  PageResponse,
  PagingInfo,
  Story,
  StoryFilters,
  User,
  UserStatus,
} from "../models/types";
import {
  DBCollectionsEnum,
  database,
  getDocumentFromDb,
} from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";
import { getQuery } from "../models/mongoDb/query";

export const getAllStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction,
) => {
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}",
    );
    const { pageNumber = 1, pageSize = 20 } = filters;
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    const pipeline = [
      {
        $unionWith: {
          coll: DBCollectionsEnum.stories,
          pipeline: matchStage,
        },
      },
      ...matchStage,
      {
        $facet: {
          metadata: [
            { $count: "totalDocumentsCount" },
            { $addFields: { pageNumber, pageSize } },
          ],
          // Paginate results
          results: [
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            // { $sort: { createdAt: -1 } },
          ],
        },
      },
    ];

    const aggregatedStories = await database
      .collection(DBCollectionsEnum.stories_library)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } =
      aggregatedStories[0] as AggregationResult<DocumentWithId>;
    const totalCount = metadata[0] ? metadata[0].totalCount : 0;

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
  next: NextFunction,
) => {
  const storySlug = request.params.slug;
  if (!storySlug || typeof storySlug !== "string") {
    response.status(400).json({ message: "❌ Invalid story slug" });
    return;
  }

  try {
    const pipeline = [
      { $match: { slug: storySlug } },
      {
        $unionWith: {
          coll: DBCollectionsEnum.stories_library,
          pipeline: [],
        },
      },
      {
        $lookup: {
          from: DBCollectionsEnum.users,
          localField: "author",
          foreignField: "_id",
          as: "authorProfile", // Name of the new array
        }, // $lookup returns an array
      },

      {
        // Use $unwind to destructure the array into a single object.
        $unwind: {
          path: "$authorProfile",
          preserveNullAndEmptyArrays: true, // Keep the blog even if author lookup fails
        },
      },
      { $limit: 1 },
    ];

    const cursor = await database
      .collection(DBCollectionsEnum.stories)
      .aggregate(pipeline);

    const story = (await cursor.next()) as Story | null;

    if (!story) {
      response.status(404).json({ message: "❌ Story not found!" });

      return;
    }

    if (!story.authorProfile) {
      console.warn(
        `⚠️ Story found (slug: ${storySlug}), but author profile (ID: ${story.author}) was missing.`,
      );
    }

    console.log("✅ Get Story by slug:", {
      storySlug,
      isPremium: story.isPremium,
    });

    response.status(200).json(story);
  } catch (error) {
    console.error("❌ Failed to get Story by slug!", {
      error,
    });
    next(error);
  }
};

export const getAllUserStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction,
) => {
  const userId = request.query.userId as string;
  const user = (await getDocumentFromDb(
    new ObjectId(userId),
    DBCollectionsEnum.users,
  )) as User;
  // const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
  const filters: StoryFilters = JSON.parse(
    (request.query.filters as string) || "{}",
  );
  const { pageNumber = 1, pageSize = 20 } = filters;

  if (user.status !== UserStatus.active) {
    response.status(403).json({
      message: `Your account is ${user.status} and not allowed to view stories previously created!`,
    });
  }

  try {
    // --- 3. Build Aggregation Pipeline ---
    // getQuery should correctly incorporate the userId and any other filters
    const matchCriteria = getQuery(filters, userId);

    const pipeline = [
      { $match: matchCriteria },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: DBCollectionsEnum.users,
          localField: "author",
          foreignField: "_id",
          as: "authorProfile", // Name of the new array
        }, // $lookup returns an array
      },

      {
        // Use $unwind to destructure the array into a single object.
        $unwind: {
          path: "$authorProfile",
          preserveNullAndEmptyArrays: true, // Keep the blog even if author lookup fails
        },
      },
      {
        $facet: {
          // Branch 1: Calculate metadata
          metadata: [
            { $count: "totalDocumentsCount" }, // Count matching documents
            // Optionally add pagination info to metadata for context
            { $addFields: { pageNumber, pageSize } },
          ],
          // Branch 2: Get the paginated results
          results: [
            { $skip: (pageNumber - 1) * pageSize }, // Skip documents for previous pages
            { $limit: pageSize }, // Limit to the number of documents per page
          ],
        },
      },
    ];

    // --- 4. Execute Aggregation ---
    const aggregationResult = await database
      .collection(DBCollectionsEnum.stories)
      .aggregate(pipeline)
      .toArray();

    // --- 5. Process Aggregation Results ---
    // The result of $facet is an array containing an object with 'metadata' and 'results' keys
    const facetResult = aggregationResult[0] as
      | AggregationResult<DocumentWithId>
      | undefined;

    // Safely access metadata and results, providing defaults
    const metadata = facetResult?.metadata?.[0]; // Metadata is an array, get the first element
    const results = facetResult?.results ?? []; // Default to empty array if no results found

    // Calculate total count and pages
    const totalCount = metadata?.totalCount ?? 0;
    // Ensure pageSize is positive to avoid division by zero or negative numbers
    const totalPagesCount = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;

    // --- 6. Logging ---
    console.log("ℹ️  Fetched all User stories successfully (Pipeline)", {
      userId,
      filters: { ...filters, pageNumber, pageSize }, // Log applied filters including pagination
      matchCriteria: JSON.stringify(matchCriteria), // Log the actual query used
      totalCount,
      totalPagesCount,
      resultsCount: results.length,
    });

    // --- 7. Construct and Send Response ---
    const paging: PagingInfo = {
      pageNumber,
      pageSize,
      totalCount,
      totalPagesCount,
    };

    response.status(200).json({
      results: results as DocumentWithId[], // Cast results to the expected type
      paging,
    });
  } catch (error) {
    // --- 8. Error Handling for Aggregation ---
    console.error("❌ Failed to get user stories via pipeline!", {
      userId,
      filters,
      error,
    });
    // Use 500 for server/database errors during story fetch
    response.status(500).json({
      message: "An error occurred while fetching stories.",
      // Optionally include error details in non-prod environments
      ...(process.env.NODE_ENV !== "production" && {
        errorDetails: (error as Error).message,
      }),
    });
  }
};

export const getOriginalStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction,
) => {
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}",
    );
    const { pageNumber = 1, pageSize = 20 } = filters;
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    // Aggregation pipeline
    const pipeline = [
      ...matchStage,
      {
        $facet: {
          metadata: [
            { $count: "totalDocumentsCount" },
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
      .collection(DBCollectionsEnum.stories_library)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } =
      aggregatedStories[0] as AggregationResult<DocumentWithId>;
    const totalCount = metadata[0] ? metadata[0].totalCount : 0;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all Original stories successfully", {
      filters,
      hasActiveFilters,
      metadata,
      totalPagesCount,
    });

    // // FOR DEVELOPMENT USE ONLY
    // const ALL_STORIES = await bulkUpdateStoriesByField();
    // await bulkUpdateStoriesByField();

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
  } catch (error) {
    console.error("❌ Failed to get Original stories!", {
      error,
    });
    next(error);
  }
};

export const getAllUsersStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction,
) => {
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}",
    );
    const { pageNumber = 1, pageSize = 20 } = filters;
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    // Aggregation pipeline
    const pipeline = [
      { $sort: { createdAt: -1 } },
      ...matchStage,
      {
        $facet: {
          metadata: [
            { $count: "totalDocumentsCount" },
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
      .collection(DBCollectionsEnum.stories)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } =
      aggregatedStories[0] as AggregationResult<DocumentWithId>;
    const totalCount = metadata[0] ? metadata[0].totalCount : 0;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all Users stories successfully", {
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
  } catch (error) {
    console.error("❌ Failed to get Users stories!", {
      error,
    });
    next(error);
  }
};

// // FOR DEVELOPMENT USE ONLY
// let globalAllStories;
// const bulkUpdateStoriesByField = async () => {
//   const storiesCollection = database.collection(DBCollections.stories_library);
//   const stories = await database
//     .collection(DBCollections.stories_library)
//     .find(
//       {
//         //   $and: [
//         //     {
//         //       "profileInfo.language.value": {
//         //         $in: ["en"],
//         //       },
//         //     },
//         //   ],
//       }
//       // { projection: { title: 1 } }
//     )
//     .toArray();

//   console.log("ℹ️ bulkUpdateStoriesByField:>>>", {
//     storiesCount: stories.length,
//   });

//   // try {
//   //   stories.forEach(async (story: Story, index) => {
//   //     // console.log("ℹ️ Story:>>> BEFORE", {
//   //     //   title: story.title,
//   //     // });

//   //     // // // USE THIS BETTER TO UPDATE ONE COLLECTION AT A TIME
//   //     // const newStoryDocument = await storiesCollection.findOneAndUpdate(
//   //     //   { _id: story._id },
//   //     //   {
//   //     //     $set: {
//   //     //       title: `${story.title}`,
//   //     //     },
//   //     //   },
//   //     //   { returnDocument: "after" }
//   //     // );
//   //     // console.log("ℹ️ newStoryDocument:>>> After", {
//   //     //   originalTitle: story.title,
//   //     //   newBackupTitle: newStoryDocument.title,
//   //     // });
//   //   });

//   //   console.log("ℹ️ All Stories count:>>>", stories.length);
//   // } catch (error) {
//   //   throw new Error("❌ Failed to update story slug", { cause: error });
//   // }
// };

const StoriesController = {
  getAllStories,
  getStoryBySlug,
  getAllUserStories,
  getOriginalStories,
  getAllUsersStories,
};

export default StoriesController;
