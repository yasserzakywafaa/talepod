import { BaseDataParams, Blog, BlogData, BlogParts } from "../../models/types";
import {
  DBCollections,
  getDocumentByFieldFromDb,
  saveBlogToDb,
} from "../../models/mongoDb";
import { Languages, SupportedLanguages } from "../../utils/languages";

import CONFIG from "../../config";
import { ObjectId } from "mongodb";
import OpenAi from "openai";
import extractBlogParts from "../../utils/extractBlogParts";
import fs from "fs";
import { getCreateBlogPrompt } from "./getCreateBlogPrompt";
import { getSlugFromText } from "../../utils/stringUtils";
import { handleSubmitSitemapToGoogle } from "../googleapis";
import { handleUpdateSitemapInGitLab } from "../gitlab";
import path from "path";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const siteMapFileName = "sitemap-blogs.xml";

export const handleCreateBlogRequest = async (
  blogPrompt: string
): Promise<string | null> => {
  const maxPromptTokens = 4000; // GPT-4 token limit
  const maxTokens = Math.min(maxPromptTokens - blogPrompt.length, 1000); // Adjust max tokens

  try {
    console.log("🛠️  Sending Request to AI to create a Blog  🛠️");
    const createRequest = await new OpenAi().chat.completions.create({
      // const createRequest = await axios.post(
      // "http://192.168.1.3:1234/v1/chat/completions",
      // {
      messages: [
        {
          role: "system",
          content:
            "You are a expressive blog writer and SEO expert that is also an expert on blog creation. \
              Your blogs should sound natural and conversational.",
        },
        {
          role: "user",
          content: blogPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME ?? "gpt-4o",
      n: 1,
      max_tokens: maxTokens,
      temperature: 0.4,
    });

    return createRequest.choices[0].message.content;
    // return createRequest.data.choices[0].message.content;
  } catch (error) {
    throw new Error("❌  Create a blog request failed!");
  }
};

export const handleCreateBlog = async (
  blogPrompt: string,
  language: SupportedLanguages
): Promise<Partial<Blog>> => {
  console.log("🛠️  Creating Blog  🛠️");

  let blogId: ObjectId;
  let blogParts: BlogParts;

  const createAndExtractBlogParts = async (): Promise<BlogParts> => {
    try {
      const response = await handleCreateBlogRequest(blogPrompt);
      blogParts = extractBlogParts(response);

      return blogParts;
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      blogParts = null;
    }
  };

  try {
    try {
      blogParts = await retry(createAndExtractBlogParts, 3, 2000);
    } catch (error) {
      throw new Error(`${error}`);
    }

    if (!blogParts) return undefined;

    const blogData: BlogData = {
      ...blogParts,
      language,
      createdAt: new Date(),
    };

    try {
      // Save blog to MongoDB Atlas
      blogId = (await saveBlogToDb(blogData)) as any;
      if (!blogId) return undefined;

      // Update the blog document with the slug (title + id)
      const blogWithSlug = (await updateDocument<Blog>(
        blogId.toString(),
        {
          slug: `${getSlugFromText(blogParts.title)}-${blogId
            .toString()
            .slice(-6)}`,
        },
        DBCollections.blogs
      )) as Blog;
      blogData["slug"] = blogWithSlug.slug;
    } catch (error) {
      throw new Error("❌ Failed to save the created blog to Db", {
        cause: error,
      });
    }

    console.log("✅ Blog Created Successfully", {
      blogSlug: blogData.slug,
    });

    return {
      ...blogData,
      _id: blogId,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error(`❌ Failed to create a blog!`, {
      cause: error,
    });
  }
};

export const handleCreateBulkBlogs = async (
  dataToCreateArray: BaseDataParams[],
  blogPrompt?: string
) => {
  let blogsUrlsToIncludeInSitemap: string[] = [];
  const tempFilePath = path.join(__dirname, "temp_sitemap_urls.txt");

  for (const dataToCreate of dataToCreateArray) {
    for (const language of Languages) {
      if (dataToCreate.language === language.value) {
        console.log("⌛︎  Current Language:>>>", language.value);

        for (const data of dataToCreate.data) {
          console.log("⌛︎  Current Data:>>>", data);

          try {
            const linkedBlog = await getDocumentByFieldFromDb(
              "language",
              language.value,
              DBCollections.blogs
            );

            const newBlog: Partial<Blog> = await handleCreateBlog(
              getCreateBlogPrompt(
                data,
                language.value,
                linkedBlog?._id
                  ? {
                      title: linkedBlog.title,
                      url: `${CONFIG.APP_URL}/blog/${linkedBlog?.slug}`,
                    }
                  : undefined
              ),
              language.value
            );

            if (newBlog?.slug) {
              const newBlogFullUrl = `${CONFIG.APP_URL}/blog/${newBlog.slug}`;
              // Write the URL to a file immediately (memory efficient)
              fs.appendFileSync(tempFilePath, newBlogFullUrl + "\n");

              // Force garbage collection
              if (global.gc) global.gc();
            }
          } catch (error) {
            console.error("❌  handleCreateBlog error", error);
            continue;
          }
        }
      }
    }
  }

  try {
    // Process the saved URLs in the file
    blogsUrlsToIncludeInSitemap = fs
      .readFileSync(tempFilePath, "utf-8")
      .split("\n");
  } catch (error) {
    throw new Error(`❌ Error reading file "${tempFilePath}"!`, {
      cause: error,
    });
  }

  try {
    // Remove the file
    fs.unlinkSync(tempFilePath);
    console.log(`✅  File ${tempFilePath} has been successfully removed.`);
  } catch (error) {
    throw new Error(`❌ Error removing file "${tempFilePath}"!`, {
      cause: error,
    });
  }

  if (blogsUrlsToIncludeInSitemap.length && !CONFIG.IS_DEV && CONFIG.IS_PROD) {
    // Add new created blogs URLs to sitemap-blogs.xml file
    await handleUpdateSitemapInGitLab({
      newUrls: blogsUrlsToIncludeInSitemap,
      siteMapFileName,
    });

    // Submit the update sitemap-blogs.xml file to Google
    setTimeout(async () => {
      await handleSubmitSitemapToGoogle(siteMapFileName);
    }, 300000); // 5 minutes
  }
};
