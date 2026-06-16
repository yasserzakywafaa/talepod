import {
  DBCollectionsEnum,
  getDocumentFromDb,
  saveStoryToDb,
} from "../../models/mongoDb";
import {
  ProfileInfo,
  Story,
  StoryData,
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
import { handleTriggerWebhookN8n } from "../webhooks/n8n";
import retry from "../../utils/retryFunction";
import { updateDocument } from "../../models/mongoDb/crudOperations";

/** Resolved avatar metadata seeded into a story so the hero stays on-model. */
type AvatarMeta = { avatarId: string; characterSheet?: string };

/** Inputs shared between placeholder creation and background text generation. */
export interface CreateStoryInput {
  storyPrompt: string;
  profileInfo: ProfileInfo;
  storyParams: StoryParams;
  user: User;
  format: StoryFormat;
  artStyle?: string;
  avatarId?: string;
}

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

/**
 * If a saved character was chosen, seed the story's characterSheet from its
 * locked description so the hero resembles it (ensureCharacterSheet then reuses
 * this instead of generating a fresh one). Owner-scoped for safety.
 */
export const resolveAvatarMeta = async (
  user: User,
  avatarId?: string,
): Promise<AvatarMeta | undefined> => {
  if (!avatarId || !ObjectId.isValid(avatarId)) return undefined;
  const avatar = (await getDocumentFromDb(
    new ObjectId(avatarId),
    DBCollectionsEnum.avatars,
  )) as UserAvatar | null;
  if (avatar && avatar.userId === String(user._id)) {
    return { avatarId, characterSheet: avatar.description };
  }
  return undefined;
};

/**
 * Synchronous gate: confirms the account may create a story right now and tells
 * the caller whether this story consumes a purchased credit. Throws (so the
 * controller can respond with an error) when the account is blocked or over its
 * plan cap with no credits left. A purchased credit lets a user create one
 * story beyond their plan cap.
 */
export const validateUserCanCreate = (
  user: User,
): { willUseCredit: boolean; availableCredits: number } => {
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

  return { willUseCredit, availableCredits };
};

/**
 * Persists a "pending" placeholder story and returns it immediately so the
 * controller can respond before the (slow) AI text generation runs. The
 * placeholder carries a stable, id-based slug; `generateStoryText` later fills
 * in the real title/body and swaps in the final title-based slug.
 */
export const createStoryPlaceholder = async (
  input: CreateStoryInput,
  avatarMeta?: AvatarMeta,
): Promise<Story> => {
  const { user, profileInfo, storyParams, format, artStyle } = input;

  const placeholderData: Partial<Story> = {
    author: user._id,
    createdAt: new Date(),
    isPremium:
      user.isPaidUser && user.subscription?.type !== SubscriptionPlanEnum.Free,
    title: "Creating your story…",
    summary: "",
    mainStory: "",
    poem: "",
    format,
    // Background generation states the client polls until each flips off
    // "pending". Text lands first, then images.
    textStatus: "pending",
    imagesStatus: "pending",
    // Chosen illustration style id (resolved to the default if undefined).
    ...(artStyle ? { artStyle } : {}),
    // Chosen saved character → seeds characterSheet.
    ...(avatarMeta ?? {}),
  };

  const storyId = await saveStoryToDb(placeholderData, profileInfo, storyParams);
  if (!storyId) {
    throw new Error("❌ Failed to create the story placeholder!");
  }

  // Stable, id-based slug for the pending phase (the title isn't known yet).
  const slug = `creating-${storyId.toString().slice(-9)}`;
  await updateDocument<Story>(
    storyId.toString(),
    { slug },
    DBCollectionsEnum.stories,
  );

  return {
    ...placeholderData,
    _id: storyId,
    slug,
    profileInfo,
    storyParams,
  } as Story;
};

/**
 * Background text generation for a placeholder story. Best-effort: never throws
 * (the controller has already responded), flips `textStatus` to "ready" once
 * the AI text is saved or "failed" on error, and only on success counts the
 * story against the user's quota/credit and fires the "new story" webhook.
 * Returns whether text generation succeeded so the caller can chain images.
 */
export const generateStoryText = async (
  input: CreateStoryInput,
  storyId: string,
  willUseCredit: boolean,
  availableCredits: number,
  avatarMeta?: AvatarMeta,
): Promise<boolean> => {
  const { storyPrompt, profileInfo, storyParams, format, user } = input;

  try {
    // Build the format-specific text fields + params.
    let textData: Partial<Story>;
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
      textData = {
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
      textData = {
        ...storyParts,
        format: "long",
      };
      updatedStoryParams = {
        ...storyParams,
        totalCharacters,
        totalWords,
      };
    }

    // Swap the placeholder body for the real text + final title-based slug and
    // mark the text ready. The client poll flips its chip to "View story".
    const finalSlug = `${getSlugFromText(title)}-${storyId.slice(-9)}`;
    await updateDocument<StoryData>(
      storyId,
      {
        ...textData,
        slug: finalSlug,
        storyParams: updatedStoryParams,
        textStatus: "ready",
      },
      DBCollectionsEnum.stories,
    );

    // Count the story against the user's quota now that it actually exists.
    // A credit-funded story decrements credits and leaves storyCount at the
    // cap; otherwise it counts against the plan quota as usual.
    if (user._id) {
      try {
        const userStoryUpdate = willUseCredit
          ? {
              storyCredits: availableCredits - 1,
              stories: [...user.stories, storyId],
            }
          : {
              storyCount: user.storyCount + 1,
              stories: [...user.stories, storyId],
            };
        await updateDocument<User>(
          user._id.toString(),
          userStoryUpdate,
          DBCollectionsEnum.users,
        );
      } catch (error) {
        console.error("❌ Failed to update the user with the new story", {
          storyId,
          error,
        });
      }
    }

    // Auto-save a brand-new story character (name/age/gender) as a reusable
    // avatar so it can be picked next time. Skipped when an existing saved
    // character was used (avatarMeta set). Fire-and-forget.
    if (!avatarMeta && user?._id) {
      autoSaveAvatarFromProfile(String(user._id), {
        name: profileInfo.name,
        age: profileInfo.age,
        gender: profileInfo.gender,
      });
    }

    // Notify downstream automations now that the story is real (was previously
    // fired synchronously from the controller before the async refactor).
    await handleTriggerWebhookN8n({
      eventName: "New Story Added",
      data: {
        id: storyId,
        title,
        url: `${CONFIG.APP_URL}/bedtime-story/${finalSlug}`,
        user,
        isDev: CONFIG.IS_DEV,
        isProd: CONFIG.IS_PROD,
      },
    });

    console.log("✅ Story Created Successfully", {
      storySlug: finalSlug,
      format,
      MODEL_NAME: CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
    });

    return true;
  } catch (error) {
    console.error("❌ Failed to generate the story text", { storyId, error });
    try {
      await updateDocument<Story>(
        storyId,
        { textStatus: "failed" },
        DBCollectionsEnum.stories,
      );
    } catch {
      /* swallow — best effort */
    }
    return false;
  }
};
