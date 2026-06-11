import { BlogData, BlogParts } from "../../models/types";

import CONFIG from "../../config";
// import {
//   DBCollectionsEnum,
//   getDocumentByFieldFromDb,
//   saveBulkBlogToDb,
// } from "../../models/mongoDb";
import { SupportedLanguages } from "../../utils/languages";
import extractBlogParts from "../../utils/extractBlogParts";
// import { ObjectId } from "mongodb";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";
// import fs from "fs";
// import { getCreateBlogPrompt } from "./getCreateBlogPrompt";
// import { handleSubmitSitemapToGoogle } from "../googleapis";
// import { handleUpdateSitemapInGitLab } from "../gitlab";
// import path from "path";
// import readline from "readline";
import retry from "../../utils/retryFunction";

// import { getRandomString, getSlugFromText } from "../../utils/stringUtils";

// const siteMapFileName = "sitemap-blogs.xml";

export const handleCreateBlogRequest = async (
  blogPrompt: string,
): Promise<string | null> => {
  const maxPromptTokens = 4000; // GPT-4 token limit
  const maxTokens = Math.min(maxPromptTokens - blogPrompt.length, 1000); // Adjust max tokens

  try {
    console.log("🛠️  Sending Request to AI to create a Blog  🛠️");
    const createRequest = await handleOpenRouterAIRequest(
      CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
      [
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
      {
        max_tokens: maxTokens,
      },
    );

    const first = createRequest.choices[0] as {
      message?: { content?: string | null };
    };
    return first?.message?.content ?? null;
    // return createRequest.data.choices[0].message.content;
  } catch (error) {
    throw new Error("❌  Create a blog request failed!");
  }
};

export const handleCreateBlog = async (
  blogPrompt: string,
  language: SupportedLanguages,
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
