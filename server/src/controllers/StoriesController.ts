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

import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { ObjectId } from "mongodb";
import { getStoryPdfUrl } from "../services/create/pdf";
import { getQuery } from "../models/mongoDb/query";
import { sendEmail } from "../utils/sendEmail";

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

/** Look up a full story document by slug across both story collections. */
const findStoryBySlug = async (slug: string): Promise<Story | null> => {
  const fromUsers = await database
    .collection(DBCollectionsEnum.stories)
    .findOne({ slug });
  if (fromUsers) return fromUsers as unknown as Story;

  const fromLibrary = await database
    .collection(DBCollectionsEnum.stories_library)
    .findOne({ slug });
  return (fromLibrary as unknown as Story) || null;
};

const safeFileLabel = (title: string): string =>
  `${
    (title || "story")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "story"
  }.pdf`;

const escapeHtml = (value: string): string =>
  String(value ?? "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildEbookEmailHtml = (title: string, url: string): string => `
  <div style="font-family:'Lexend Deca',system-ui,sans-serif;max-width:520px;margin:0 auto;background:#FAF4EA;border-radius:18px;overflow:hidden;border:1px solid #E4D9C9">
    <div style="background:radial-gradient(ellipse at top,#2a2a63,#0A0E2B);padding:34px 28px;text-align:center">
      <div style="font-family:'Yeseva One',Georgia,serif;color:#F0B648;font-size:26px">TalePod</div>
      <div style="color:#A7A0EC;font-size:14px;margin-top:4px">Bedtime stories, made just for them</div>
    </div>
    <div style="padding:28px">
      <h1 style="font-size:20px;color:#171C3B;margin:0 0 10px">Your eBook is ready ✨</h1>
      <p style="color:#4a4a5e;line-height:1.6;margin:0 0 20px">
        &ldquo;<strong>${escapeHtml(title)}</strong>&rdquo; has been turned into a beautiful PDF storybook.
        It is attached to this email, and you can download it any time:
      </p>
      <a href="${url}" style="display:inline-block;background:#F0B648;color:#ffffff;text-decoration:none;font-weight:600;padding:13px 24px;border-radius:12px">Download your eBook</a>
      <p style="color:#8a8a98;font-size:13px;margin:22px 0 0">Sweet dreams,<br/>The TalePod team</p>
    </div>
  </div>`;

/**
 * GET /api/v1/bedtime-story/:slug/pdf
 * Export the story as an eBook PDF and return its hosted URL. The PDF is
 * generated once and cached on the story (download + email share one file).
 */
export const exportStoryPdf = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const slug = request.params.slug;
  try {
    const story = await findStoryBySlug(slug);
    if (!story) {
      response.status(404).json({ message: "❌ Story not found!" });
      return;
    }

    const url = await getStoryPdfUrl(story);
    console.log("✅ Story PDF exported", { slug });
    response.status(200).json({ url });
  } catch (error) {
    console.error("❌ Failed to export story PDF!", { slug, error });
    next(error);
  }
};

/**
 * POST /api/v1/bedtime-story/:slug/email-pdf (authenticated)
 * Email the eBook PDF to the signed-in user. Responds immediately and
 * generates + sends the email in the background.
 */
export const emailStoryPdf = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const slug = request.params.slug;
  const user = (request as AuthenticatedRequest).user;
  if (!user?.email) {
    response.status(401).json({ message: "Sign in to email your eBook." });
    return;
  }

  try {
    const story = await findStoryBySlug(slug);
    if (!story) {
      response.status(404).json({ message: "❌ Story not found!" });
      return;
    }

    // Respond right away — generation + delivery happen in the background.
    response.status(202).json({ message: "We'll email your eBook shortly." });

    void (async () => {
      try {
        // Reuse the single cached/generated PDF, then pull its bytes to attach.
        const url = await getStoryPdfUrl(story);
        const pdfResponse = await (
          globalThis as { fetch: typeof fetch }
        ).fetch(url);
        const buffer = Buffer.from(await pdfResponse.arrayBuffer());
        const title = story.title || "your bedtime story";
        await sendEmail({
          to: user.email,
          subject: `Your TalePod eBook: ${title}`,
          html: buildEbookEmailHtml(title, url),
          text: `Your TalePod eBook "${title}" is ready.\n\nDownload it here: ${url}\n\nSweet dreams,\nTalePod`,
          attachments: [
            {
              filename: safeFileLabel(title),
              content: buffer,
              contentType: "application/pdf",
            },
          ],
        });
        console.log("✅ Story eBook emailed", { slug, to: user.email });
      } catch (err) {
        console.error("❌ Failed to email story eBook", { slug, err });
      }
    })();
  } catch (error) {
    console.error("❌ Failed to start story eBook email!", { slug, error });
    next(error);
  }
};

const StoriesController = {
  getAllStories,
  getStoryBySlug,
  getAllUserStories,
  getOriginalStories,
  getAllUsersStories,
  exportStoryPdf,
  emailStoryPdf,
};

export default StoriesController;
