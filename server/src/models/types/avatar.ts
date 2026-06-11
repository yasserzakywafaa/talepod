import { ObjectId } from "mongodb";

/**
 * A reusable user-defined character ("avatar"). A parent describes their child,
 * partner, etc. with text appearance traits; those compose into a locked
 * `description` (the same shape as a story's characterSheet) that is injected
 * into image prompts so generated illustrations resemble that person.
 */
export interface UserAvatar {
  _id: ObjectId;
  /** Owner — the creating user's `_id` as a string. */
  userId: string;
  name: string;
  /** son / daughter / wife / husband / self / friend / pet … (free text). */
  relationship?: string;
  age?: number;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  outfit?: string;
  distinguishingFeature?: string;
  notes?: string;
  /** Composed visual description used verbatim in image prompts. */
  description?: string;
  /** Optional generated portrait (the card "visual"). */
  portraitUrl?: string;
  createdAt: Date;
  lastModified?: Date;
}

/** Editable fields accepted from the client on create/update. Server-managed
 *  fields (_id, userId, description, portraitUrl, timestamps) are excluded. */
export interface UserAvatarInput {
  name: string;
  relationship?: string;
  age?: number;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  outfit?: string;
  distinguishingFeature?: string;
  notes?: string;
}

/** Trait keys that, when changed, require recomposing the description/portrait. */
export const AVATAR_TRAIT_FIELDS: (keyof UserAvatarInput)[] = [
  "name",
  "relationship",
  "age",
  "gender",
  "skinTone",
  "hairColor",
  "hairStyle",
  "eyeColor",
  "outfit",
  "distinguishingFeature",
  "notes",
];

/**
 * The subset of traits that actually change how the avatar is *drawn*. Editing
 * only non-visual fields (name, relationship) must NOT trigger a costly portrait
 * re-generation — the avatar still looks identical.
 */
export const AVATAR_APPEARANCE_FIELDS: (keyof UserAvatarInput)[] = [
  "age",
  "gender",
  "skinTone",
  "hairColor",
  "hairStyle",
  "eyeColor",
  "outfit",
  "distinguishingFeature",
  "notes",
];
