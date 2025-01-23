import {
  AggregationResult,
  Blog,
  DocumentWithId,
  PageResponse,
  PagingInfo,
  StoryFilters,
} from "..//models/types";
import { DBCollections, database } from "../models/mongoDb";
import { NextFunction, Request, Response } from "express";

import { getQuery } from "../models/mongoDb/query";

export const getAllBlogs = async (
  request: Request,
  response: Response<PageResponse<DocumentWithId>>,
  next: NextFunction
) => {
  try {
    const hasActiveFilters: boolean = request.query.hasActiveFilters === "true";
    const pagingInfo = JSON.parse((request.query.pagingInfo as string) || "{}");
    const { pageNumber = 1, pageSize = 20 } = pagingInfo;
    // const matchStage = hasActiveFilters
    //   ? [{ $match: getQuery(pagingInfo) }]
    //   : [];
    const matchStage = [];

    // Aggregation pipeline
    const pipeline = [
      // Build the match stage for filters
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

    const aggregatedBlogs = await database
      .collection(DBCollections.blogs)
      .aggregate(pipeline)
      .toArray();
    const { metadata, results } = aggregatedBlogs[0] as AggregationResult;
    const totalCount = metadata[0] ? metadata[0].totalDocumentsCount : 0;

    const totalPagesCount = pageSize ? Math.ceil(totalCount / pageSize) : 0;

    console.log("ℹ️  Fetched all blogs successfully", {
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
    console.error("❌ Failed to get all blogs!", {
      error,
    });
    // next(error);
    return undefined;
  }
};

export const getBlogBySlug = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const blogSlug = request.params.slug;
  if (!blogSlug || typeof blogSlug !== "string") {
    response.status(400).json({ message: "❌ Invalid blog slug" });
    return;
  }

  try {
    // Use MongoDB’s $unionWith aggregation pipeline stage
    // to perform a union of the two collections and then filter by the slug.
    const pipeline = [{ $match: { slug: blogSlug } }, { $limit: 1 }];

    const results = await database
      .collection(DBCollections.blogs)
      .aggregate(pipeline)
      .toArray();

    if (results.length > 0) {
      const blog = results[0] as Blog;
      console.log("✅ Get Blog by slug:", {
        blogSlug,
        isPremium: blog.isPremium,
      });
      response.status(200).json(blog);
    } else {
      response.status(404).json({ message: "❌ Blog not found!" });
    }
  } catch (error) {
    console.error("❌ Failed to get Blog by slug!", {
      error,
    });
    next(error);
  }
};

const BlogsController = {
  getAllBlogs,
  getBlogBySlug,
};

export default BlogsController;
