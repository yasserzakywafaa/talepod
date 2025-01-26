import {
  AggregationResult,
  DocumentWithId,
  PageErrorResponse,
  PageResponse,
  PagingInfo,
  Story,
  StoryFilters,
  User,
  UserRole,
  UserStatus,
} from "../models/types";
import { DBCollections, database, getDocumentFromDb } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";
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
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    const pipeline = [
      {
        $unionWith: {
          coll: DBCollections.stories,
          pipeline: matchStage,
        },
      },
      ...matchStage,
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
            // { $sort: { createdAt: -1 } },
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
    // next(error);
    return undefined;
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
        isPremium: story.isPremium,
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

export const getAllUserStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction
) => {
  const userId = request.query.userId as string;
  const user = (await getDocumentFromDb(
    new ObjectId(userId),
    DBCollections.users
  )) as User;
  const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
  const filters: StoryFilters = JSON.parse(
    (request.query.filters as string) || "{}"
  );
  const { pageNumber = 1, pageSize = 20 } = filters;

  if (user.status !== UserStatus.active) {
    response.status(403).json({
      message: `Your account is ${user.status} and not allowed to view stories previously created!`,
    });
  }

  try {
    // Get all stories in collection
    const allStoriesDocuments = database.collection(DBCollections.stories);

    // Get all stories for this specific user (if any)
    const allUserStoriesDocuments = allStoriesDocuments
      .find({ $and: [{ author: { $eq: new ObjectId(userId) } }] })
      .sort({ createdAt: -1 });
    const allUserStoriesDocumentsCount = (
      await allUserStoriesDocuments.toArray()
    ).length;

    // Get all stories by filters (if any)
    const filteredUserDocuments = allStoriesDocuments
      .find(getQuery(filters, userId))
      .sort({ createdAt: -1 });
    const filteredUserStoriesCount = (await filteredUserDocuments.toArray())
      .length;

    // Get only the pagination stories by same filter (if any)
    const filteredDocumentsClone = allStoriesDocuments
      .find(getQuery(filters, userId))
      .sort({ createdAt: -1 })
      .clone();
    const filteredStories = await filteredDocumentsClone
      .skip((Number(pageNumber) - 1) * Number(pageSize))
      .limit(pageSize)
      .toArray();

    const totalCount = hasActiveFilters
      ? filteredUserStoriesCount
      : filteredStories.length;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all User stories successfully", {
      userId,
      filters,
      hasActiveFilters,
      allUserStoriesDocumentsCount,
      filteredUserStoriesCount,
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
    // return undefined;
    response.status(403).json({
      message: error,
    });
  }
};

export const getOriginalStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction
) => {
  //  With Pipeline
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}"
    );
    const { pageNumber = 1, pageSize = 20 } = filters;
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    // Aggregation pipeline
    const pipeline = [
      ...matchStage,
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
    // next(error);
    return undefined;
  }
  // ////////////////////////////////////////////////////////////////////////////////
  // // Without Pipeline, just .find()
  // // TODO: NEEDS FIXING
  // const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
  // const filters: StoryFilters = JSON.parse(
  //   (request.query.filters as string) || "{}"
  // );
  // const { pageNumber = 1, pageSize = 20 } = filters;

  // try {
  //   // Get all stories in collection
  //   const allStoriesDocuments = database.collection(
  //     DBCollections.stories_library
  //   );
  //   const allOriginalStoriesDocuments = allStoriesDocuments.find();
  //   const allOriginalStoriesDocumentsCount = (
  //     await allOriginalStoriesDocuments.toArray()
  //   ).length;

  //   // Get all original stories by filters
  //   const filteredStoriesDocuments = allStoriesDocuments.find(
  //     getQuery(filters)
  //   );
  //   // .limit(pageSize);
  //   const filteredOriginalStoriesCount = (
  //     await filteredStoriesDocuments.toArray()
  //   ).length;

  //   // Get only the pagination stories by same filter (if any)
  //   const filteredDocumentsClone = allStoriesDocuments
  //     .find(getQuery(filters))
  //     .clone();
  //   const filteredStories = await filteredDocumentsClone
  //     .skip((Number(pageNumber) - 1) * Number(pageSize))
  //     .limit(pageSize)
  //     .toArray();

  //   const totalCount = hasActiveFilters
  //     ? filteredOriginalStoriesCount
  //     : allOriginalStoriesDocumentsCount;

  //   const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

  //   console.log("ℹ️  Fetched all Original stories successfully", {
  //     filters,
  //     hasActiveFilters,
  //     allOriginalStoriesDocumentsCount,
  //     filteredOriginalStoriesCount,
  //     totalCount,
  //     totalPagesCount,
  //   });

  //   const paging: PagingInfo = {
  //     pageNumber,
  //     pageSize,
  //     totalPagesCount,
  //     totalCount,
  //   };
  //   response.status(200).json({
  //     results: filteredStories as DocumentWithId[],
  //     paging,
  //   });
  // } catch (error) {
  //   console.error("❌ Failed to get Original stories!", {
  //     error,
  //   });
  //   response.status(403).json({
  //     message: error,
  //   });
  // }
};

export const getAllUsersStories = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId> | PageErrorResponse<unknown>>,
  next: NextFunction
) => {
  //  With Pipeline
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const filters: StoryFilters = JSON.parse(
      (request.query.filters as string) || "{}"
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
      .collection(DBCollections.stories)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } = aggregatedStories[0] as AggregationResult;
    const totalCount = metadata[0] ? metadata[0].totalStoriesCount : 0;

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
    // next(error);
    return undefined;
  }
  // ////////////////////////////////////////////////////////////////////////////////
  // // Without Pipeline, just .find()
  // // TODO: NEEDS FIXING
  // const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
  // const filters: StoryFilters = JSON.parse(
  //   (request.query.filters as string) || "{}"
  // );
  // const { pageNumber = 1, pageSize = 20 } = filters;

  // try {
  //   // Get all stories in collection
  //   const allStoriesDocuments = database.collection(DBCollections.stories);
  //   const allOriginalStoriesDocumentsCount = (
  //     await allStoriesDocuments.find().toArray()
  //   ).length;

  //   // Get all original stories by filters
  //   const filteredDocuments = allStoriesDocuments.find(getQuery(filters));
  //   // .limit(pageSize);
  //   const filteredOriginalStoriesCount = (await filteredDocuments.toArray())
  //     .length;

  //   // Get only the pagination stories by same filter (if any)
  //   const filteredDocumentsClone = allStoriesDocuments
  //     .find(getQuery(filters))
  //     .clone();
  //   const filteredStories = await filteredDocumentsClone
  //     .skip((Number(pageNumber) - 1) * Number(pageSize))
  //     .limit(pageSize)
  //     .toArray();

  //   const totalCount = hasActiveFilters
  //     ? filteredOriginalStoriesCount
  //     : allOriginalStoriesDocumentsCount;

  //   const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

  //   console.log("ℹ️  Fetched all Users stories successfully", {
  //     filters,
  //     hasActiveFilters,
  //     allOriginalStoriesDocumentsCount,
  //     filteredOriginalStoriesCount,
  //     totalCount,
  //     totalPagesCount,
  //   });

  //   const paging: PagingInfo = {
  //     pageNumber,
  //     pageSize,
  //     totalPagesCount,
  //     totalCount,
  //   };
  //   response.status(200).json({
  //     results: filteredStories as DocumentWithId[],
  //     paging,
  //   });
  // } catch (error) {
  //   console.error("❌ Failed to get Users stories!", {
  //     error,
  //   });
  //   response.status(403).json({
  //     message: error,
  //   });
  // }
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
