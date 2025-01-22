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
} from "../../models/mongoDb";

import CONFIG from "../../config";
import { Languages } from "../../utils/languages";
import { ObjectId } from "mongodb";
import OpenAi from "openai";
import extractBlogParts from "../../utils/extractBlogParts";
import { getSlugFromText } from "../../utils/stringUtils";
import { popularStories } from "../../shared/mockedData/PopularStories";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const openai = new OpenAi();

export const handleCreateBlogRequest = async (
  blogPrompt: string
): Promise<string | null> => {
  try {
    // OpenAI Text Generation API Call
    const createRequest = await openai.chat.completions.create({
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
      model: CONFIG.OPENAI_MODEL_NAME ?? "gpt-4o",
      n: 1,
      max_tokens: 1000,
      temperature: 0.4,
    });

    return createRequest.choices[0].message.content;
  } catch (error) {
    throw new Error("❌  Create a blog request failed!");
  }
};

export const handleCreateBlog = async (
  blogPrompt: string,
  blogParams: BlogParams
) => {
  console.log("🛠️  handleCreateBlog()  🛠️");

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
    const updatedBlogParams: BlogParams = {
      ...blogParams,
      totalCharacters,
    };

    try {
      // Save blog to MongoDB Atlas
      blogId = (await saveBlogToDb(blogData, updatedBlogParams)) as any;

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
      blogParams,
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

export const handleCreateBlogBulk = async () => {
  let blogsCount = 0;
  let blogUrlToConnect: string;

  // const fetchedBlogs = (await handleGetAllBlogs(false, "{}")).results;
  // const randomBlogDocument =
  //   fetchedBlogs[Math.floor(Math.random() * fetchedBlogs.length)];

  for (const popularStory of popularStories) {
    for (const language of Languages) {
      if (popularStory.language === language.value) {
        console.log("⌛︎  Current Language:>>>", language.value);

        const randomBlogToConnect: Blog = (await getDocumentByFieldFromDb(
          "language",
          language.value,
          DBCollections.blogs
        )) as Blog;

        if (randomBlogToConnect) {
          blogUrlToConnect = `www.talepod.com/blog/${randomBlogToConnect.slug}`;
          console.log("⌛︎  Random Blog URL To Connect:>>>", blogUrlToConnect);
        }

        for (const story of popularStory.stories) {
          console.log("⌛︎  Current Story:>>>", story);

          // await handleCreateBlog(blogPrompt, blogParams);

          blogsCount += 1;
        }
      }
    }
  }

  console.log("🧮  Blogs Count:>>>", blogsCount);
};
function saveBlogToDb(
  blogData: Partial<Blog>,
  updatedBlogParams: BlogParams
): any {
  throw new Error("Function not implemented.");
}
