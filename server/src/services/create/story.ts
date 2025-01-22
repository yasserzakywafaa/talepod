import {
  DBCollections,
  getDocumentFromDb,
  saveStoryToDb,
} from "../../models/mongoDb";
import {
  ProfileInfo,
  Story,
  StoryParams,
  StoryParts,
  SubscriptionPlanEnum,
  User,
  UserRole,
  UserStatus,
} from "../../models/types";

import CONFIG from "../../config";
import { ObjectId } from "mongodb";
import OpenAi from "openai";
import extractStoryParts from "../../utils/extractStoryParts";
import { getSlugFromText } from "../../utils/stringUtils";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

const openai = new OpenAi();

export const handleCreateStoryRequest = async (
  storyPrompt: string
): Promise<string> => {
  try {
    // OpenAI Text Generation API Call
    const createRequest = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a friendly and expressive storyteller that is an expert on storytelling. Your stories should sound natural and conversational.",
        },
        {
          role: "user",
          content: storyPrompt,
        },
      ],
      model: CONFIG.OPENAI_MODEL_NAME,
      n: 1,
      max_tokens: 1000,
      temperature: 0.4,
    });

    return createRequest.choices[0].message.content;
  } catch (error) {
    throw new Error("❌  Create a story request failed!");
  }
};

export const handleCreateStory = async (
  storyPrompt: string,
  profileInfo: ProfileInfo,
  storyParams: StoryParams,
  userInfo: User
) => {
  const user = (await getDocumentFromDb(
    new ObjectId(userInfo._id),
    DBCollections.users
  )) as User;

  const createAndExtractStoryParts = async (): Promise<StoryParts> => {
    const openaiResponse = await handleCreateStoryRequest(storyPrompt);

    if (openaiResponse.length) {
      // Extract the parts from the story
      return extractStoryParts(openaiResponse);
    } else {
      throw new Error("❌ Failed to create a story!");
    }
  };

  if (
    user.role !== UserRole.admin &&
    user.storyCount >= user.subscription.maxStoriesAllowed
  ) {
    throw new Error(
      `You have consumed your maximum credit of ${user.subscription.maxStoriesAllowed} stories`
    );
  }
  if (user.status !== UserStatus.active) {
    throw new Error(
      "Your account is not active and not allowed to create stories!"
    );
  }

  let storyId: ObjectId;
  let storyParts: StoryParts;
  try {
    storyParts = await retry(createAndExtractStoryParts, 3, 2000);
    const totalCharacters = (storyParts.mainStory + storyParts.poem).length;

    // Count the total characters in the story
    if (totalCharacters > 4000) {
      storyParts = await retry(createAndExtractStoryParts, 3, 2000);

      console.error(
        `❌ The story exceeds the maximum number of characters [4,000]!`
      );
    }
    const storyData: Partial<Story> = {
      ...storyParts,
      author: user._id,
      createdAt: new Date(),
      isPremium:
        user.isPaidUser && user.subscription.type !== SubscriptionPlanEnum.Free,
    };
    const updatedStoryParams: StoryParams = {
      ...storyParams,
      totalCharacters,
    };

    try {
      // Save story to MongoDB Atlas
      storyId = await saveStoryToDb(storyData, profileInfo, updatedStoryParams);

      // Update the story document with the slug (title + id)
      const storyWithSlug = (await updateDocument<Story>(
        storyId.toString(),
        {
          slug: `${getSlugFromText(storyParts.title)}-${storyId
            .toString()
            .slice(-9)}`,
        },
        DBCollections.stories
      )) as Story;
      storyData["slug"] = storyWithSlug.slug;

      return {
        ...storyData,
        _id: storyId,
        profileInfo,
        storyParams,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error("❌ Failed to save the created story to Db", {
        cause: error,
      });
    }

    // Update User with story
    if (storyId && user._id) {
      try {
        const updatedUser = (await updateDocument<User>(
          user._id.toString(),
          {
            storyCount: user.storyCount + 1,
            stories: [...user.stories, storyId.toString()],
          },
          DBCollections.users
        )) as User;

        console.log(`✅ User updated with new storyId:>>>`, {
          storyId,
          userStories: updatedUser.stories,
        });
      } catch (error) {
        throw new Error("❌ Failed to the user info to Db", {
          cause: error,
        });
      }
    }

    console.log("✅ Story Created Successfully", {
      //   request: request.path,
      storySlug: storyData.slug,
      MODEL_NAME: CONFIG.OPENAI_MODEL_NAME,
    });
  } catch (error) {
    throw new Error(`❌ Failed to create a story! ${error}`);
  }
};
