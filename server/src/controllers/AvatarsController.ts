import { Request, Response } from "express";
import {
  DBCollectionsEnum,
  getDocumentFromDb,
  getDocumentsByQueryFromDb,
} from "../models/mongoDb";
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "../models/mongoDb/crudOperations";
import {
  AVATAR_APPEARANCE_FIELDS,
  AVATAR_TRAIT_FIELDS,
  UserAvatar,
  UserAvatarInput,
} from "../models/types";
import {
  composeAvatarDescription,
  generateAvatarPortrait,
} from "../services/create/avatar";

import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { ObjectId } from "mongodb";

/** Whitelist incoming body fields → only known avatar traits are persisted. */
const pickAvatarInput = (body: Record<string, unknown>): UserAvatarInput => {
  const input: Record<string, unknown> = {};
  for (const field of AVATAR_TRAIT_FIELDS) {
    const value = body[field];
    if (value === undefined || value === null) continue;
    if (field === "age") {
      const num = Number(value);
      if (!Number.isNaN(num)) input.age = num;
    } else if (`${value}`.trim()) {
      input[field] = `${value}`.trim();
    }
  }
  return input as unknown as UserAvatarInput;
};

/** Best-effort background portrait → patch the avatar doc once it's ready. */
const generatePortraitInBackground = (avatarId: string, description: string) => {
  void (async () => {
    try {
      const portraitUrl = await generateAvatarPortrait(description, avatarId);
      if (portraitUrl) {
        await updateDocument(
          avatarId,
          { portraitUrl },
          DBCollectionsEnum.avatars,
        );
      }
    } catch (error) {
      console.error("⚠️ Avatar portrait generation failed", { avatarId, error });
    }
  })();
};

const createAvatar = async (request: Request, response: Response) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user?._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const input = pickAvatarInput(request.body);
    if (!input.name) {
      return response.status(400).json({ message: "Avatar name is required" });
    }

    const description = await composeAvatarDescription(input);
    const avatar = {
      ...input,
      userId: String(user._id),
      description,
      createdAt: new Date(),
    };

    const avatarId = await createDocument(avatar, DBCollectionsEnum.avatars);
    generatePortraitInBackground(String(avatarId), description);

    return response.status(201).json({ ...avatar, _id: avatarId });
  } catch (error) {
    console.error("❌ createAvatar failed", error);
    return response.status(500).json({ message: "Failed to create avatar" });
  }
};

const listAvatars = async (request: Request, response: Response) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user?._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const docs = await getDocumentsByQueryFromDb(
      { userId: String(user._id) },
      DBCollectionsEnum.avatars,
    );
    const avatars = docs as unknown as UserAvatar[];
    avatars.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return response.json(avatars);
  } catch (error) {
    console.error("❌ listAvatars failed", error);
    return response.status(500).json({ message: "Failed to load avatars" });
  }
};

/** Fetch an avatar and confirm it belongs to the requesting user. */
const findOwnedAvatar = async (
  avatarId: string,
  userId: string,
): Promise<UserAvatar | null> => {
  if (!ObjectId.isValid(avatarId)) return null;
  const doc = (await getDocumentFromDb(
    new ObjectId(avatarId),
    DBCollectionsEnum.avatars,
  )) as UserAvatar | null;
  if (!doc || doc.userId !== userId) return null;
  return doc;
};

const getAvatar = async (request: Request, response: Response) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user?._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }
    const avatar = await findOwnedAvatar(
      request.params.avatarId,
      String(user._id),
    );
    if (!avatar) {
      return response.status(404).json({ message: "Avatar not found" });
    }
    return response.json(avatar);
  } catch (error) {
    console.error("❌ getAvatar failed", error);
    return response.status(500).json({ message: "Failed to load avatar" });
  }
};

const updateAvatar = async (request: Request, response: Response) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user?._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { avatarId } = request.params;
    const existing = await findOwnedAvatar(avatarId, String(user._id));
    if (!existing) {
      return response.status(404).json({ message: "Avatar not found" });
    }

    const input = pickAvatarInput(request.body);
    if (!input.name) {
      return response.status(400).json({ message: "Avatar name is required" });
    }

    // Only the *visual* traits affect the portrait. If the edit just changed the
    // name/relationship, keep the existing description + portrait — no costly
    // re-generation, so the card updates instantly and the face stays identical.
    const appearanceChanged = AVATAR_APPEARANCE_FIELDS.some((field) => {
      if (!(field in input)) return false;
      const next = `${input[field] ?? ""}`.trim();
      const prev = `${
        (existing as unknown as Record<string, unknown>)[field] ?? ""
      }`.trim();
      return next !== prev;
    });

    const description = appearanceChanged
      ? await composeAvatarDescription({ ...existing, ...input })
      : existing.description;

    const updated = (await updateDocument<UserAvatar>(
      avatarId,
      {
        ...input,
        ...(description !== undefined ? { description } : {}),
        lastModified: new Date(),
      },
      DBCollectionsEnum.avatars,
    )) as UserAvatar | null;

    if (appearanceChanged && description) {
      generatePortraitInBackground(avatarId, description);
    }

    return response.json(updated ?? { ...existing, ...input, description });
  } catch (error) {
    console.error("❌ updateAvatar failed", error);
    return response.status(500).json({ message: "Failed to update avatar" });
  }
};

const deleteAvatar = async (request: Request, response: Response) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    if (!user?._id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { avatarId } = request.params;
    const existing = await findOwnedAvatar(avatarId, String(user._id));
    if (!existing) {
      return response.status(404).json({ message: "Avatar not found" });
    }

    const success = await deleteDocument(avatarId, DBCollectionsEnum.avatars);
    return response.json({ success });
  } catch (error) {
    console.error("❌ deleteAvatar failed", error);
    return response.status(500).json({ message: "Failed to delete avatar" });
  }
};

const AvatarsController = {
  createAvatar,
  listAvatars,
  getAvatar,
  updateAvatar,
  deleteAvatar,
};

export default AvatarsController;
