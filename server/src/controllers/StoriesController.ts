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
    // Aggregation pipeline
    const pipeline = [
      // { $sort: { createdAt: -1 } },
      {
        $unionWith: {
          coll: DBCollections.stories,
          pipeline: matchStage,
        },
      },
      // Build the match stage for filters
      ...matchStage,
      // { $sort: { createdAt: -1 } }, // Returns a memory limit error!!
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

    // // FOR DEVELOPMENT USE ONLY
    // const ALL_STORIES = await bulkUpdateStoriesByField();
    // await bulkUpdateStoriesByField();
    // response.status(200).json({
    //   results: ALL_STORIES,
    //   paging: {
    //     pageNumber: 1,
    //     pageSize: 1,
    //     totalCount: ALL_STORIES.length,
    //     totalPagesCount: 1,
    //   },
    // } as any);

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
      console.log("✅ Get Story by slug:", { storySlug });
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
      // { $sort: { createdAt: -1 } },
      // {
      //   $unionWith: {
      //     coll: DBCollections.stories,
      //     pipeline: matchStage,
      //   },
      // },
      // Build the match stage for filters
      ...matchStage,
      // { $sort: { createdAt: -1 } }, // Returns a memory limit error!!
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

    console.log("ℹ️  Fetched all Original stories successfully", {
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
      // {
      //   $unionWith: {
      //     coll: DBCollections.stories,
      //     pipeline: matchStage,
      //   },
      // },
      // Build the match stage for filters
      ...matchStage,
      // { $sort: { createdAt: -1 } }, // Returns a memory limit error!!
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
//         // $and: [
//         //   {
//         //     "profileInfo.language.value": {
//         //       $in: ["en"],
//         //     },
//         //   },
//         // ],
//       },
//       { projection: { slug: 1 } }
//     )
//     .toArray();

//   // let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
//   // xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

//   // stories.forEach((story: Story) => {
//   //   xml += `  <url>\n`;
//   //   xml += `    <loc>https://www.talepod.com/bedtime-story/${story.slug}</loc>\n`;
//   //   xml += `    <lastmod>${new Date().toLocaleString("en-GB", {
//   //     dateStyle: "short",
//   //   })}</lastmod>\n`;
//   //   xml += `    <changefreq>monthly</changefreq>\n`;
//   //   xml += `    <priority>1.0</priority>\n`;
//   //   xml += `  </url>\n`;
//   // });

//   // xml += `</urlset>`;

//   // // Write the XML to a file
//   // const sitemapPath = path.join(
//   //   __dirname,
//   //   "../../../client/public",
//   //   "sitemap-stories-library.xml"
//   // );

//   // console.log("sitemap.xml:>>>", {
//   //   sitemapPath,
//   //   storiesLength: stories.length,
//   // });

//   // fs.writeFileSync(sitemapPath, xml, "utf8");
//   // console.log(
//   //   "✅ sitemap-stories-library.xml has been generated successfully!"
//   // );

//   // return stories;

//   // let count = 0;
//   // try {
//   //   stories.forEach(async (story: Story, index) => {
//   //     // Regular expression to match valid slugs
//   //     const validSlugPattern = /-[a-f0-9]{9}$/;

//   //     // if (!validSlugPattern.test(story.slug)) {
//   //     if (!story.seo) {
//   //       // await updateDocument(story._id.toString(), {
//   //       //   slug: `${story.slug}-${story._id.toString().slice(-9)}`,
//   //       // });

//   //       // // USE THIS BETTER TO UPDATE ONE COLLECTION AT A TIME
//   //       // await storiesCollection.findOneAndUpdate(
//   //       //   { _id: story._id },
//   //       //   {
//   //       //     $set: {
//   //       //       slug: `${story.slug}-${story._id.toString().slice(-9)}`,
//   //       //     },
//   //       //   },
//   //       //   { returnDocument: "after" }
//   //       // );

//   //       console.log("ℹ️ Story:>>>", {
//   //         storySeo: story.seo,
//   //       });

//   //       count++;
//   //     }
//   //   });

//   //   console.log("ℹ️ All Stories count:>>>", stories.length);
//   //   console.log("ℹ️ count:>>>", count);
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
