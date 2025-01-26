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
import axios from "axios";
import extractBlogParts from "../../utils/extractBlogParts";
import { getCreateBlogPrompt } from "./getCreateBlogPrompt";
import { getSlugFromText } from "../../utils/stringUtils";
import { handleSubmitSitemapToGoogle } from "../googleapis";
import { handleUpdateGitLabSitemap } from "../gitlab";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const openai = new OpenAi();
const siteMapFileName = "sitemap-blogs.xml";

export const handleCreateBlogRequest = async (
  blogPrompt: string
): Promise<string | null> => {
  try {
    console.log("🛠️  Sending Request to AI to create a Blog  🛠️");
    // OpenAI Text Generation API Call
    const createRequest = await openai.chat.completions.create({
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
      max_tokens: 1000,
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

  const createAndExtractBlogParts = async (): Promise<BlogParts> => {
    try {
      const response = await handleCreateBlogRequest(blogPrompt);
      const blogParts = extractBlogParts(response);

      return blogParts;
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  let blogId: ObjectId;
  let blogParts: BlogParts;
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
  let newBlog: Partial<Blog>;
  let createBlogPrompt = blogPrompt;
  const blogsUrlsToIncludeInSitemap = [];

  for (const dataToCreate of dataToCreateArray) {
    for (const language of Languages) {
      if (dataToCreate.language === language.value) {
        console.log("⌛︎  Current Language:>>>", language.value);

        for (const data of dataToCreate.data) {
          console.log("⌛︎  Current Data:>>>", data);

          const linkedBlog = await getDocumentByFieldFromDb(
            "language",
            language.value,
            DBCollections.blogs
          );
          if (linkedBlog && linkedBlog._id) {
            console.log("📋  Linked Blog:>>>", linkedBlog.title);

            createBlogPrompt = getCreateBlogPrompt(data, language.value, {
              title: linkedBlog.title,
              url: `${
                CONFIG.IS_DEV ? "dev.talepod.com" : "www.talepod.com"
              }/blog/${linkedBlog.slug}`,
            });
          } else {
            createBlogPrompt = getCreateBlogPrompt(data, language.value);
          }

          try {
            newBlog = await handleCreateBlog(createBlogPrompt, language.value);
            if (newBlog && newBlog.slug) {
              blogsUrlsToIncludeInSitemap.push(
                `${
                  CONFIG.IS_DEV ? "dev.talepod.com" : "www.talepod.com"
                }/blog/${newBlog.slug}`
              );

              console.log("🧮  Blogs Count:>>>", {
                count: blogsUrlsToIncludeInSitemap.length,
                blogsUrlsToIncludeInSitemap,
              });
            }
          } catch (error) {
            console.error("❌  handleCreateBlog error", error);
            continue;
          }

          // Force garbage collection every 5 blogs
          if (blogsUrlsToIncludeInSitemap.length % 5 === 0 && global.gc) {
            global.gc();
            await new Promise((resolve) => setTimeout(resolve, 500)); // Add small delay
          }
        }
      }
    }
  }

  // Add new created blogs URLs to sitemap-blogs.xml file
  if (blogsUrlsToIncludeInSitemap.length) {
    await handleUpdateGitLabSitemap({
      newUrls: blogsUrlsToIncludeInSitemap,
      siteMapFileName,
    });

    // // Submit the update sitemap-blogs.xml file to Google
    // if (!CONFIG.IS_DEV && CONFIG.IS_PROD) {
    //   setTimeout(async () => {
    //     await handleSubmitSitemapToGoogle(siteMapFileName);
    //   }, 300000); // 5 minutes
    // }
  }
};
