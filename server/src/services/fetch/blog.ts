import {
  AggregationResult,
  PagingInfo,
  StoryFilters,
} from "../../models/types";
import { DBCollections, database } from "../../models/mongoDb";

import { getQuery } from "../../models/mongoDb/query";

export const handleGetAllBlogs = async (
  hasActiveFilters: boolean,
  filtersString: string
) => {
  try {
    const filters: StoryFilters = JSON.parse(filtersString || "{}");
    const { pageNumber = 1, pageSize = 20 } = filters;
    const matchStage = hasActiveFilters ? [{ $match: getQuery(filters) }] : [];
    // Aggregation pipeline
    const pipeline = [
      //   {
      //     $unionWith: {
      //       coll: DBCollections.blogs,
      //       pipeline: matchStage,
      //     },
      //   },
      // Build the match stage for filters
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
      .collection(DBCollections.blogs)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } = aggregatedStories[0] as AggregationResult;
    const totalCount = metadata[0] ? metadata[0].totalStoriesCount : 0;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all blogs successfully", {
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

    return {
      results,
      paging,
    };

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
    console.error("❌ Failed to get all blogs!", {
      error,
    });
    return undefined;
  }
};
