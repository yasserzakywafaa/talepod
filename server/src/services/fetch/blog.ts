import {
  AggregationResult,
  Blog,
  DocumentWithId,
  PagingInfo,
} from "../../models/types";
import { DBCollections, database } from "../../models/mongoDb";

import { updateDocument } from "../../models/mongoDb/crudOperations";

// Utility function to fix markdown links
const fixMarkdownLinks = (content: string): string => {
  return content.replace(
    /\[([^\]]+)\]\((www\.talepod\.com[^\)]+)\)/g,
    "[$1](https://$2)"
  );
};

// Service function to fix links in all blogs
export const handleFixBlogLinks = async (): Promise<{
  fixed: number;
  total: number;
}> => {
  let fixedCount = 0;
  let totalCount = 0;
  let pageNumber = 1;
  const pageSize = 20;

  try {
    while (true) {
      // Get blogs in batches
      const { results } = await handleGetAllBlogs({ pageNumber, pageSize });
      if (!results || results.length === 0) break;

      totalCount += results.length;

      console.log(`⌛︎ handleFixBlogLinks`, {
        totalCount,
        resultsLength: results.length,
      });

      // Process each blog
      for (const blog of results) {
        const updateFields: Partial<Blog> = {};
        const fieldsToCheck = [
          "introduction",
          "mainBlog",
          "conclusion",
          "callToAction",
        ];

        console.log(`📋 Current Blog Title`, blog.title);

        // Check each field for links to fix
        fieldsToCheck.forEach((field) => {
          const originalContent = blog[field];
          if (typeof originalContent === "string") {
            const fixedContent = fixMarkdownLinks(originalContent);
            if (fixedContent !== originalContent) {
              updateFields[field] = fixedContent;
            }
          }
        });

        // Update blog if any fields were modified
        if (Object.keys(updateFields).length > 0) {
          await updateDocument(
            blog._id.toString(),
            updateFields,
            DBCollections.blogs
          );
          fixedCount++;
        }
      }

      pageNumber++;
    }

    console.log(`✅ Fixed links in ${fixedCount} of ${totalCount} blogs`);
    return { fixed: fixedCount, total: totalCount };
  } catch (error) {
    console.error("❌ Error fixing blog links:", error);
    throw new Error("Failed to fix blog links");
  }
};

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
