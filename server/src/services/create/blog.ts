import { BaseDataParams, Blog, BlogData, BlogParts } from "../../models/types";
import {
  DBCollectionsEnum,
  getDocumentByFieldFromDb,
  saveBlogToDb,
  saveBulkBlogToDb,
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
import readline from "readline";
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
): Promise<Partial<BlogData | undefined>> => {
  console.log("🛠️  Creating Blog  🛠️");

  // let blogId: ObjectId;
  let blogParts: BlogParts | undefined;

  const createAndExtractBlogParts = async (): Promise<
    BlogParts | undefined
  > => {
    try {
      const response = await handleCreateBlogRequest(blogPrompt);

      if (response) {
        blogParts = extractBlogParts(response);
        return blogParts;
      } else {
        return undefined;
      }
    } catch (error) {
      throw error;
    } finally {
      blogParts = undefined;
    }
  };

  try {
    try {
      blogParts = await retry(createAndExtractBlogParts, 3, 2000);
    } catch (error) {
      throw error;
    }

    if (!blogParts) return undefined;

    const blogData: Partial<BlogData> = {
      ...blogParts,
      language,
      createdAt: new Date(),
    };

    return blogData;
  } catch (error) {
    throw new Error(`❌ Failed to create a blog!`, {
      cause: error,
    });
  }
};

export const saveSingleBlogToDb = async (
  blogData: BlogData
): Promise<Blog | undefined> => {
  let blogId: ObjectId;
  try {
    blogId = (await saveBlogToDb(blogData)) as any;
    if (!blogId) return undefined;

    // Update the blog document with the slug (title + id)
    const blogWithSlug = (await updateDocument<Blog>(
      blogId.toString(),
      {
        slug: `${getSlugFromText(blogData.title)}-${blogId
          .toString()
          .slice(-6)}`,
      },
      DBCollectionsEnum.blogs
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
};

export const handleCreateBulkBlogs = async (
  dataToCreateArray: BaseDataParams[],
  blogPrompt?: string
) => {
  const tempUrlsFilePath = path.join(__dirname, "temp_sitemap_urls.txt");
  const urlStream = fs.createWriteStream(tempUrlsFilePath, { flags: "a" });

  // New: Temporary file and stream for blog content
  const tempBlogsFilePath = path.join(__dirname, "temp_blogs_content.txt");
  const blogContentStream = fs.createWriteStream(tempBlogsFilePath, {
    flags: "a",
  });

  // Add error handlers for the streams
  urlStream.on("error", (err) => {
    console.error("❌ Error writing to urlStream:", err);
  });

  blogContentStream.on("error", (err) => {
    console.error("❌ Error writing to blogContentStream:", err);
  });

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
              DBCollectionsEnum.blogs
            );
            const newBlog: Partial<Blog> | undefined = await handleCreateBlog(
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

            if (newBlog?.title) {
              // Write URL to the stream immediately (memory efficient)
              urlStream.write(`${CONFIG.APP_URL}/blog/${newBlog.slug}\n`);

              // Write blog content to the stream *with a delimiter*
              blogContentStream.write(`${JSON.stringify(newBlog)}\n`);

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
  urlStream.end(); // Close the stream when done
  blogContentStream.end(); // Close the stream when done

  // Process both files *after* both streams are finished
  Promise.all([
    new Promise<void>((resolve, reject) => {
      urlStream.on("finish", resolve);
      urlStream.on("error", reject);
    }),
    new Promise<void>((resolve, reject) => {
      blogContentStream.on("finish", resolve);
      blogContentStream.on("error", reject);
    }).then(async () => {
      let blogsUrlsToIncludeInSitemap: string[] = [];

      try {
        const fileContent = fs.readFileSync(tempUrlsFilePath, "utf8"); // Process the saved URLs in the file
        blogsUrlsToIncludeInSitemap = fileContent
          .split("\n")
          .filter((url) => url !== ""); // Filter out empty strings
      } catch (error) {
        throw new Error(`❌ Error reading file "${tempUrlsFilePath}"!`, {
          cause: error,
        });
      }

      const lineReader = readline.createInterface({
        input: fs.createReadStream(tempBlogsFilePath),
        crlfDelay: Infinity,
      });

      let blogCount = 0;

      // Use a generator function to yield batches of blog data
      async function* generateBlogBatches(
        reader: readline.Interface,
        batchSize: number
      ) {
        let currentBatch: Blog[] = [];
        for await (const line of reader) {
          try {
            const blog: Blog = JSON.parse(line);
            currentBatch.push(blog);

            if (currentBatch.length >= batchSize) {
              yield currentBatch;
              currentBatch = [];
            }
          } catch (parseError) {
            console.error("Error parsing blog content:", parseError);
          }
        }
        if (currentBatch.length > 0) {
          yield currentBatch; // Yield any remaining blogs
        }
      }

      // Stream the batches to the database
      const BATCH_SIZE = 5;
      for await (const batch of generateBlogBatches(lineReader, BATCH_SIZE)) {
        try {
          const result = await saveBulkBlogToDb(batch);
          blogCount += result.insertedCount;
          console.log(`⌛︎ ${blogCount} blogs inserted so far...`);
        } catch (error) {
          throw new Error("❌ Error during bulk insert!", { cause: error });
        }
      }

      console.log(`ℹ️  ${blogCount} blogs inserted in total.`);
      // ////////////////////////////////////////////////

      try {
        fs.unlinkSync(tempUrlsFilePath);
        fs.unlinkSync(tempBlogsFilePath);
        console.log(`✅ Files have been successfully removed.`, {
          tempUrlsFilePath,
          tempBlogsFilePath,
        });
      } catch (error) {
        throw new Error(`❌ Error removing files!`, {
          cause: error,
        });
      }

      if (
        blogsUrlsToIncludeInSitemap.length &&
        !CONFIG.IS_DEV &&
        CONFIG.IS_PROD
      ) {
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
    }),
  ]);
};
