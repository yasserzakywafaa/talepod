import {
  DBCollectionsEnum,
  getDocumentFromDb,
  saveStoryToDb,
} from "../../models/mongoDb";
import {
  ProfileInfo,
  Story,
  StoryFormat,
  StoryParams,
  StoryParts,
  SubscriptionPlanEnum,
  User,
  UserAvatar,
  UserRole,
  UserStatus,
} from "../../models/types";

import CONFIG from "../../config";
import { ObjectId } from "mongodb";
import { autoSaveAvatarFromProfile } from "./avatar";
import extractStoryParts, {
  extractComicParts,
} from "../../utils/extractStoryParts";
import { countWords, getSlugFromText } from "../../utils/stringUtils";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

export const handleCreateStoryRequest = async (
  storyPrompt: string,
): Promise<string | null> => {
  try {
    const createRequest = await handleOpenRouterAIRequest(
      CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
      [
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
      {
        max_tokens: CONFIG.AI_MAX_TOKENS.STORY,
      },
    );

    const first = createRequest.choices[0] as {
      message?: { content?: string | null };
    };
    return first?.message?.content ?? null;
  } catch (error) {
    throw new Error("❌  Create a story request failed!");
  }
};

export const handleCreateStory = async (
  storyPrompt: string,
  profileInfo: ProfileInfo,
  storyParams: StoryParams,
  userInfo: User,
  format: StoryFormat = "long",
  artStyle?: string,
  avatarId?: string,
) => {
  const user = (await getDocumentFromDb(
    new ObjectId(userInfo._id),
    DBCollectionsEnum.users,
  )) as User;

  // If a saved character was chosen, seed the story's characterSheet from its
  // locked description so the hero resembles it (ensureCharacterSheet then
  // reuses this instead of generating a fresh one). Owner-scoped for safety.
  let avatarMeta: { avatarId: string; characterSheet?: string } | undefined;
  if (avatarId && ObjectId.isValid(avatarId)) {
    const avatar = (await getDocumentFromDb(
      new ObjectId(avatarId),
      DBCollectionsEnum.avatars,
    )) as UserAvatar | null;
    if (avatar && avatar.userId === String(user._id)) {
      avatarMeta = { avatarId, characterSheet: avatar.description };
    }
  }

  // A purchased story credit lets a user create one story beyond their plan
  // cap. When over the cap, consume a credit instead of blocking.
  const isAdmin = user.role === UserRole.admin;
  const overSubscriptionLimit =
    !!user.subscription &&
    user.storyCount >= user.subscription.maxStoriesAllowed;
  const availableCredits = user.storyCredits ?? 0;
  const willUseCredit = !isAdmin && overSubscriptionLimit && availableCredits > 0;

  if (!isAdmin && overSubscriptionLimit && availableCredits <= 0) {
    throw new Error(
      `You have consumed your maximum credit of ${user.subscription?.maxStoriesAllowed} stories`,
    );
  }
  if (user.status !== UserStatus.active) {
    throw new Error(
      "Your account is not active and not allowed to create stories!",
    );
  }

  const baseMeta = {
    author: user._id,
    createdAt: new Date(),
    isPremium:
      user.isPaidUser && user.subscription?.type !== SubscriptionPlanEnum.Free,
    // Background image generation kicks off after the response is sent.
    imagesStatus: "pending" as const,
    // Chosen illustration style id (resolved to the default if undefined).
    ...(artStyle ? { artStyle } : {}),
    // Chosen saved character → seeds characterSheet (see above).
    ...(avatarMeta ?? {}),
  };

  let storyId: ObjectId | undefined;
  try {
    // Build the format-specific story document + params, then share the save tail.
    let storyData: Partial<Story>;
    let updatedStoryParams: StoryParams;
    let title: string;

    if (format === "comic") {
      const createAndExtractComic = async () => {
        const aiResponse = await handleCreateStoryRequest(storyPrompt);
        if (aiResponse && aiResponse.length) {
          return extractComicParts(aiResponse);
        }
        throw new Error("❌ Failed to create a comic!");
      };

      const comic = await retry(createAndExtractComic, 3, 2000);
      // Joined captions double as the searchable/excerpt body + a graceful
      // fallback for surfaces that only render `mainStory`.
      const mainStory = comic.pages.map((page) => page.caption).join("\n\n");
      title = comic.title;
      storyData = {
        ...baseMeta,
        title: comic.title,
        summary: comic.summary,
        mainStory,
        poem: "",
        pages: comic.pages,
        format: "comic",
      };
      updatedStoryParams = {
        ...storyParams,
        totalCharacters: mainStory.length,
        totalWords: countWords(mainStory),
      };
    } else {
      const createAndExtractStoryParts = async (): Promise<StoryParts> => {
        const openaiResponse = await handleCreateStoryRequest(storyPrompt);
        if (openaiResponse && openaiResponse.length) {
          return extractStoryParts(openaiResponse);
        }
        throw new Error("❌ Failed to create a story!");
      };

      // Long stories are word-targeted now (no character cap / re-roll); the
      // TTS pipeline chunks whatever length this produces.
      const storyParts = await retry(createAndExtractStoryParts, 3, 2000);
      const totalCharacters = (storyParts.mainStory + storyParts.poem).length;
      const totalWords = countWords(
        `${storyParts.mainStory} ${storyParts.poem}`,
      );
      title = storyParts.title;
      storyData = {
        ...baseMeta,
        ...storyParts,
        format: "long",
      };
      updatedStoryParams = {
        ...storyParams,
        totalCharacters,
        totalWords,
      };
    }

    try {
      // Save story to MongoDB Atlas
      storyId = await saveStoryToDb(storyData, profileInfo, updatedStoryParams);

      if (!storyId) return;

      // Update the story document with the slug (title + id)
      const storyWithSlug = (await updateDocument<Story>(
        storyId.toString(),
        {
          slug: `${getSlugFromText(title)}-${storyId.toString().slice(-9)}`,
        },
        DBCollectionsEnum.stories,
      )) as Story;
      storyData["slug"] = storyWithSlug.slug;
    } catch (error) {
      throw new Error("❌ Failed to save the created story to Db", {
        cause: error,
      });
    }

    // Update User with story. If this story used a purchased credit (the user
    // is over their plan cap), decrement credits and leave storyCount at the
    // cap; otherwise count it against the plan quota as usual.
    if (storyId && user._id) {
      try {
        const userStoryUpdate = willUseCredit
          ? {
              storyCredits: availableCredits - 1,
              stories: [...user.stories, storyId.toString()],
            }
          : {
              storyCount: user.storyCount + 1,
              stories: [...user.stories, storyId.toString()],
            };
        const updatedUser = (await updateDocument<User>(
          user._id.toString(),
          userStoryUpdate,
          DBCollectionsEnum.users,
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

    // Auto-save a brand-new story character (name/age/gender) as a reusable
    // avatar so it can be picked next time. Skipped when an existing saved
    // character was used (avatarMeta set). Fire-and-forget — never delays or
    // fails story creation; it dedups by name and composes the portrait async.
    if (!avatarMeta && user?._id) {
      autoSaveAvatarFromProfile(String(user._id), {
        name: profileInfo.name,
        age: profileInfo.age,
        gender: profileInfo.gender,
      });
    }

    console.log("✅ Story Created Successfully", {
      storySlug: storyData.slug,
      format,
      MODEL_NAME: CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
    });

    return {
      ...storyData,
      _id: storyId,
      profileInfo,
      storyParams: updatedStoryParams,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error(`❌ Failed to create a story! ${error}`);
  }
};
