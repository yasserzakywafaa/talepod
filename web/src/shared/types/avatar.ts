/** A saved user character ("avatar"). Mirrors the server `UserAvatar`. */
export interface Avatar {
  _id: string;
  userId: string;
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
  description?: string;
  portraitUrl?: string;
  createdAt: string;
  lastModified?: string;
}

/** Editable trait fields sent to the API on create/update. */
export interface AvatarInput {
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

export const EMPTY_AVATAR_INPUT: AvatarInput = {
  name: "",
  relationship: "",
  age: undefined,
  gender: "",
  skinTone: "",
  hairColor: "",
  hairStyle: "",
  eyeColor: "",
  outfit: "",
  distinguishingFeature: "",
  notes: "",
};

/** Build an editable input object from a saved avatar (for the edit form). */
export const avatarToInput = (avatar: Avatar): AvatarInput => ({
  name: avatar.name ?? "",
  relationship: avatar.relationship ?? "",
  age: avatar.age,
  gender: avatar.gender ?? "",
  skinTone: avatar.skinTone ?? "",
  hairColor: avatar.hairColor ?? "",
  hairStyle: avatar.hairStyle ?? "",
  eyeColor: avatar.eyeColor ?? "",
  outfit: avatar.outfit ?? "",
  distinguishingFeature: avatar.distinguishingFeature ?? "",
  notes: avatar.notes ?? "",
});
