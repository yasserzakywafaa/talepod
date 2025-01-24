import { Blog, BlogParts, BlogTypeEnum } from "../../models/types/blog/blog";
import { DBCollections, saveBlogToDb } from "../../models/mongoDb";

import CONFIG from "../../config";
import { ObjectId } from "mongodb";
import OpenAi from "openai";
import { SupportedLanguages } from "../../utils/languages";
import axios from "axios";
import extractBlogParts from "../../utils/extractBlogParts";
import { getCreateBlogPrompt } from "./getCreateBlogPrompt";
import { getSlugFromText } from "../../utils/stringUtils";
import { handleGetAllBlogs } from "../fetch/blog";
import { handleUpdateGitLabSitemap } from "../gitlab";
import { popularStories } from "../../shared/mockedData/PopularStories";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const openai = new OpenAi();

export const handleCreateBlogRequest = async (
  blogPrompt: string
): Promise<string | null> => {
  try {
    console.log("🛠️  Sending Request to AI to create a Blog  🛠️");
    // OpenAI Text Generation API Call
    const createRequest = await openai.chat.completions.create({
      // const createRequest = await axios.post(
      //   "http://192.168.1.3:1234/v1/chat/completions",
      //   {
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
  blogPrompt: string
  // blogParams: BlogParams
): Promise<Partial<Blog>> => {
  console.log("🛠️  Creating Blog  🛠️");

  const createAndExtractBlogParts = async (): Promise<BlogParts> => {
    const openaiResponse = await handleCreateBlogRequest(blogPrompt);
    if (openaiResponse?.length) {
      // Extract the parts from the blog
      return extractBlogParts(openaiResponse);
    } else {
      throw new Error("❌ Failed to create a blog!");
    }
  };

  let blogId: ObjectId;
  let blogParts: BlogParts;
  try {
    blogParts = await retry(createAndExtractBlogParts, 3, 2000);

    const blogData: Partial<Blog> = {
      ...blogParts,
      createdAt: new Date(),
      blogType: BlogTypeEnum.PUBLIC,
    };

    try {
      // Save blog to MongoDB Atlas
      // blogId = (await saveBlogToDb(blogData, updatedBlogParams)) as any;
      blogId = (await saveBlogToDb(blogData)) as any;

      if (!blogId) return {};

      // Update the blog document with the slug (title + id)
      const blogWithSlug = (await updateDocument<Blog>(
        blogId.toString(),
        {
          slug: `${getSlugFromText(blogParts.title)}-${blogId
            .toString()
            .slice(-9)}`,
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
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
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

// export const handleCreateBlogBulk = async () => {
//   let blogsCount = 0;

//   for (const blogTopic of blogTopics) {
//     for (const language of Languages) {
//       if (blogTopic.language === language.value) {
//         console.log("⌛︎  Current Language:>>>", language.value);
//         for (const topic of blogTopic.topics) {
//           console.log("⌛︎  Current Topic:>>>", topic);

//           await handleCreateBlog();

//           blogsCount += 1;
//         }
//       }
//     }
//   }

//   console.log("🧮  Blogs Count:>>>", blogsCount);
// };

export const handleCreateBlogBulk = async (blogPrompt?: string) => {
  let blogsCount = 0;
  let createBlogPrompt = blogPrompt;
  const blogsUrlsToIncludeInSitemap = [];

  const fetchedBlogs = (
    await handleGetAllBlogs({
      pageNumber: 1,
      pageSize: 99,
    })
  ).results;
  const randomBlogDocument = fetchedBlogs[
    Math.floor(Math.random() * fetchedBlogs.length)
  ] as unknown as Blog;

  const storiesInEnglish = popularStories.filter(
    (story) => story.language === SupportedLanguages.en
  );

  // console.log("📋 Random Blog:>>>", {
  //   title: randomBlogDocument.title,
  //   url: CONFIG.IS_DEV
  //     ? `dev.talepod.com/blog/${randomBlogDocument.slug}`
  //     : `www.talepod.com/blog/${randomBlogDocument.slug}`,
  // });

  createBlogPrompt = getCreateBlogPrompt(
    storiesInEnglish[0].stories[
      Math.floor(Math.random() * storiesInEnglish[0].stories.length)
    ],
    SupportedLanguages.en,
    {
      title: randomBlogDocument.title,
      url: `www.talepod.com/blog/${randomBlogDocument.slug}`,
    }
  );
  const blog = await handleCreateBlog(createBlogPrompt);
  if (blog.slug) {
    blogsUrlsToIncludeInSitemap.push(`www.talepod.com/blog/${blog.slug}`);

    await handleUpdateGitLabSitemap({
      newUrls: blogsUrlsToIncludeInSitemap,
      siteMapFileName: "sitemap-blogs.xml",
    });
  }

  // for (const popularStory of popularStories) {
  //   for (const language of Languages) {
  //     if (popularStory.language === language.value) {
  //       console.log("⌛︎  Current Language:>>>", language.value);

  //       for (const story of popularStory.stories) {
  //         console.log("⌛︎  Current Story:>>>", story);

  //         const linkedBlog: Blog = (await getDocumentByFieldFromDb(
  //           "language",
  //           language.value,
  //           DBCollections.blogs
  //         )) as Blog;
  //         if (linkedBlog) {
  //           console.log("⌛︎  Linked Blog:>>>", {
  //             title: linkedBlog.title,
  //             url: `www.talepod.com/blog/${linkedBlog.slug}`,
  //           });

  //           createBlogPrompt = getCreateBlogPrompt(story, language.value, {
  //             title: linkedBlog.title,
  //             url: `www.talepod.com/blog/${linkedBlog.slug}`,
  //           });
  //         } else {
  //           createBlogPrompt = getCreateBlogPrompt(story, language.value);
  //         }

  //         // // await handleCreateBlog(blogPrompt, blogParams);
  //         await handleCreateBlog(createBlogPrompt);

  //         blogsCount += 1;
  //       }
  //     }
  //   }
  // }

  // console.log("🧮  Blogs Count:>>>", blogsCount);
};
