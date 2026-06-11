import CONFIG from "../../config";
import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import {
  createDocument,
  updateDocument,
} from "../../models/mongoDb/crudOperations";
import { UserAvatar } from "../../models/types";
import { generateImage } from "./images";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";

/** Render the avatar's traits as labelled lines for the character-designer LLM. */
const traitLines = (avatar: Partial<UserAvatar>): string => {
  const parts: string[] = [];
  const add = (label: string, value?: string | number) => {
    if (value !== undefined && value !== null && `${value}`.trim()) {
      parts.push(`${label}: ${value}`);
    }
  };
  add("Name", avatar.name);
  add("Relationship", avatar.relationship);
  add("Age", avatar.age);
  add("Gender", avatar.gender);
  add("Skin tone", avatar.skinTone);
  add("Hair color", avatar.hairColor);
  add("Hair style", avatar.hairStyle);
  add("Eye color", avatar.eyeColor);
  add("Outfit", avatar.outfit);
  add("Distinguishing feature", avatar.distinguishingFeature);
  add("Notes", avatar.notes);
  return parts.join("\n");
};

/** Deterministic description built straight from traits — used when the text
 *  model is unavailable so an avatar is always immediately usable. */
const fallbackDescription = (avatar: Partial<UserAvatar>): string => {
  const intro = [
    avatar.name || "A friendly character",
    avatar.age !== undefined ? `a ${avatar.age}-year-old` : "",
    avatar.gender,
  ]
    .filter(Boolean)
    .join(", ");
  const looks = [
    avatar.skinTone && `${avatar.skinTone} skin`,
    avatar.hairColor &&
      `${avatar.hairColor}${avatar.hairStyle ? ` ${avatar.hairStyle}` : ""} hair`,
    avatar.eyeColor && `${avatar.eyeColor} eyes`,
    avatar.outfit && `wearing ${avatar.outfit}`,
    avatar.distinguishingFeature,
  ]
    .filter(Boolean)
    .join(", ");
  return `${intro}.${looks ? ` ${looks}.` : ""} Keep the exact same face, hairstyle, hair color, skin tone, clothing and colors in every scene.`.trim();
};

/**
 * Turn an avatar's structured traits into a compact, illustrator-ready visual
 * description (the same shape `ensureCharacterSheet` produces for stories).
 * Best-effort: returns a deterministic fallback on any failure, never throws.
 */
export const composeAvatarDescription = async (
  avatar: Partial<UserAvatar>,
): Promise<string> => {
  try {
    const response = await handleOpenRouterAIRequest(
      CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
      [
        {
          role: "system",
          content:
            "You are a character designer for a children's picture book. " +
            "Reply with ONLY a compact visual description (2-4 sentences, under 90 words) of the " +
            "character's fixed appearance, so an illustrator can draw them identically on every page. " +
            "Visual details only: skin tone, eye color and shape, hair color, length and style, exact " +
            "clothing and its colors, body proportions appropriate for the age, and one distinguishing " +
            "feature. Respect the given name, age and gender exactly. No personality, no plot, no " +
            "preamble, no markdown, no lists.",
        },
        {
          role: "user",
          content: traitLines(avatar) || avatar.name || "a friendly child",
        },
      ],
      // gpt-5-mini is a reasoning model — keep budget high so the visible
      // answer survives after reasoning tokens (matches ensureCharacterSheet).
      { max_tokens: 2000 },
    );

    const sheet = (response?.choices?.[0]?.message?.content || "").trim();
    if (sheet) return sheet;
  } catch (error) {
    console.error("⚠️ Avatar description generation failed; using fallback", {
      error,
    });
  }
  return fallbackDescription(avatar);
};

/**
 * Generate a square head-and-shoulders portrait for an avatar from its
 * description and persist it to S3. Best-effort: returns null on failure.
 */
export const generateAvatarPortrait = async (
  description: string,
  fileBase: string,
): Promise<string | null> => {
  const prompt = `A friendly head-and-shoulders character portrait for a children's storybook, centered, facing the viewer, warm soft plain background.

Character (draw exactly as described): ${description}`;
  return generateImage(prompt, `avatar-${fileBase}`, { aspectRatio: "1:1" });
};

const patchAvatarPortraitInBackground = async (
  avatarId: string,
  description: string,
): Promise<void> => {
  try {
    const portraitUrl = await generateAvatarPortrait(description, avatarId);
    if (portraitUrl) {
      await updateDocument(avatarId, { portraitUrl }, DBCollectionsEnum.avatars);
    }
  } catch (error) {
    console.error("⚠️ Avatar portrait generation failed", { avatarId, error });
  }
};

/** Best-effort background portrait → patch the avatar doc once it's ready. */
export const generatePortraitInBackground = (
  avatarId: string,
  description: string,
): void => {
  patchAvatarPortraitInBackground(avatarId, description);
};

/**
 * Auto-save a freshly entered story character as a reusable avatar so it can be
 * picked next time. Best-effort and deduped by name (per user): composes the
 * locked description and generates the portrait in the background — exactly like
 * a manual create with minimal traits. Never throws; any failure is logged and
 * swallowed so story creation is never affected.
 */
export const autoSaveAvatarFromProfile = async (
  userId: string,
  profile: { name?: string; age?: number; gender?: string },
): Promise<void> => {
  try {
    const name = (profile.name || "").trim();
    if (!name) return;

    // Dedup: skip when the user already has a character with this name.
    const existing = (await getDocumentsByQueryFromDb(
      { userId },
      DBCollectionsEnum.avatars,
    )) as unknown as UserAvatar[];
    const alreadySaved = existing.some(
      (avatar) => (avatar.name || "").trim().toLowerCase() === name.toLowerCase(),
    );
    if (alreadySaved) return;

    const traits: Partial<UserAvatar> = {
      name,
      ...(typeof profile.age === "number" && profile.age > 0
        ? { age: profile.age }
        : {}),
      ...(profile.gender ? { gender: profile.gender } : {}),
    };

    const description = await composeAvatarDescription(traits);
    const avatar = {
      ...traits,
      userId,
      description,
      createdAt: new Date(),
    };
    const avatarId = await createDocument(avatar, DBCollectionsEnum.avatars);

    generatePortraitInBackground(String(avatarId), description);
    console.log("✅ Auto-saved new story character as a reusable avatar", {
      name,
      userId,
    });
  } catch (error) {
    console.error("⚠️ Auto-save avatar failed (non-fatal)", { error });
  }
};
