import {
  Blog,
  BlogParams,
  BlogParts,
  BlogTypeEnum,
} from "../../models/types/blog/blog";
import {
  DBCollections,
  getDocumentByFieldFromDb,
  getDocumentFromDb,
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
import { popularStories } from "../../shared/mockedData/PopularStories";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const openai = new OpenAi();

// export const handleCreateBlogRequest = async (
//   blogPrompt: string
// ): Promise<string | null> => {
//   try {
//     // OpenAI Text Generation API Call
//     const createRequest = await openai.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a friendly and expressive blog writer that is an expert on blog creation. \
//           Your blogs should sound natural and conversational.",
//         },
//         {
//           role: "user",
//           content: blogPrompt,
//         },
//       ],
//       model: CONFIG.OPENAI_MODEL_NAME ?? "gpt-4o",
//       n: 1,
//       max_tokens: 1000,
//       temperature: 0.4,
//     });

//     return createRequest.choices[0].message.content;
//   } catch (error) {
//     throw new Error("❌  Create a blog request failed!");
//   }
// };

export const handleCreateBlogRequest = async (
  blogPrompt: string
): Promise<string | null> => {
  try {
    const createRequest = await axios.post(
      "http://192.168.1.3:1234/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content:
              "You are a friendly and expressive blog writer that is an expert on blog creation. \
          Your blogs should sound natural and conversational.",
          },
          {
            role: "user",
            content: blogPrompt,
          },
        ],
      }
    );

    return createRequest.data.choices[0].message.content
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();
  } catch (error) {
    throw new Error("❌  Create a blog request failed!");
  }
};

export const handleCreateBlog = async (
  blogPrompt: string
  // blogParams: BlogParams
) => {
  console.log("🛠️  handleCreateBlog()  🛠️");

  const createAndExtractBlogParts = async (): Promise<BlogParts> => {
    const openaiResponse = await handleCreateBlogRequest(blogPrompt);

    console.log("createAndExtractBlogParts:>>>", { openaiResponse });

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

    // Count the total characters in the blog
    const totalCharacters: number = Object.values(blogParts).reduce(
      (sum, blogPart) => {
        if (typeof blogPart === "string") {
          return sum + blogPart.length;
        }
        return sum;
      },
      0
    );

    // if (totalCharacters > blogMaxLength) {
    //   blogParts = await retry(createAndExtractBlogParts, 3, 2000);

    //   console.error(
    //     `❌ The blog exceeds the maximum number of characters [${blogMaxLength}]!`
    //   );
    // }
    const blogData: Partial<Blog> = {
      ...blogParts,
      // author: user._id,
      createdAt: new Date(),
      // isFree: isFreeUser,
      // isBasic: isBasicUser,
      // isEssential: isEssentialUser,
      // isPremium: isPremiumUser,
      blogType: BlogTypeEnum.PUBLIC,
    };
    // const updatedBlogParams: BlogParams = {
    //   ...blogParams,
    //   totalCharacters,
    // };

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
      // blogParams,
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

  // const fetchedBlogs = (await handleGetAllBlogs(false, "{}")).results;
  // const randomBlogDocument =
  //   fetchedBlogs[Math.floor(Math.random() * fetchedBlogs.length)];

  createBlogPrompt = getCreateBlogPrompt(
    "The Ugly Duckling",
    SupportedLanguages.en,
    {
      title: "TEST LINKED BLOG TITLE",
      url: "www.google.com",
    }
  );
  await handleCreateBlog(createBlogPrompt);

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

  console.log("🧮  Blogs Count:>>>", blogsCount);
};
