import {
  AggregationResult,
  Blog,
  DocumentWithId,
  PagingInfo,
} from "../../models/types";
import { DBCollections, database } from "../../models/mongoDb";

export const handleGetAllBlogs = async (
  pagingInfo: PagingInfo
): Promise<{ results: DocumentWithId[]; paging: PagingInfo }> => {
  try {
    const { pageNumber = 1, pageSize = 20 } = pagingInfo;

    // Aggregation pipeline
    const pipeline = [
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

    const paging: PagingInfo = {
      pageNumber,
      pageSize,
      totalCount,
      totalPagesCount,
    };

    console.log("ℹ️  Fetched all blogs successfully", {
      metadata,
      totalPagesCount,
    });

    return {
      results,
      paging,
    };
  } catch (error) {
    console.error("❌ Failed to get all blogs!", {
      error,
    });
    return undefined;
  }
};

export const handleGetBlogBySlug = async (blogSlug: string): Promise<Blog> => {
  try {
    if (!blogSlug || typeof blogSlug !== "string") {
      throw new Error("❌ Invalid blog slug");
    }

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
      return blog;
    } else {
      throw new Error("❌ Blog not found!");
    }
  } catch (error) {
    throw new Error(`❌ Failed to get Blog by slug!" ${Error}`);
  }
};
