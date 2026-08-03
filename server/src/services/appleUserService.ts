import type { AppleAuthenticatedProfile } from "@yasserzakywafaa/server-core";

import {
  DBCollectionsEnum,
  getDocumentByFieldFromDb,
  saveUserDataToDb,
  updateUserInDb,
} from "../models/mongoDb";
import { AuthProviderEnum, User, getInitialUserData } from "../models/types";

/**
 * Apple sends the user's name and email **only on the first authorization**.
 * Every later sign-in carries a bare `sub`, so an unconditional write would
 * blank whatever we already stored.
 */
const withPreservedProfile = (
  existing: User,
  profile: AppleAuthenticatedProfile,
): Partial<User> => {
  const update: Partial<User> = {
    lastLogin: new Date(),
    appleUserId: profile.sub,
  };

  const hasName = Boolean(profile.givenName || profile.familyName);
  const hasStoredName = Boolean(
    existing.name?.givenName || existing.name?.familyName,
  );
  if (hasName && !hasStoredName) {
    update.name = {
      givenName: profile.givenName,
      familyName: profile.familyName,
    };
  }

  if (profile.email && !existing.email) {
    update.email = profile.email;
  }

  if (profile.appleRefreshToken) {
    update.appleRefreshToken = profile.appleRefreshToken;
  }

  return update;
};

/**
 * Resolves the account behind a verified Apple identity.
 *
 * Lookup order:
 *  1. `appleUserId` — the Apple `sub` we stored on a previous sign-in.
 *  2. A verified, non-private-relay email matching an existing account. That
 *     account gains the Apple identity instead of the user silently ending up
 *     with an empty duplicate. Relay and unverified addresses never link.
 *  3. Otherwise a new account.
 *
 * Google and phone users are untouched — this never rewrites `userId`.
 */
export const findOrCreateAppleUser = async (
  profile: AppleAuthenticatedProfile,
): Promise<User | null> => {
  try {
    const existingByAppleId = (await getDocumentByFieldFromDb(
      "appleUserId",
      profile.sub,
      DBCollectionsEnum.users,
    )) as User | null;

    if (existingByAppleId) {
      const updated = (await updateUserInDb(
        existingByAppleId._id?.toString() as string,
        withPreservedProfile(existingByAppleId, profile),
      )) as User;
      return updated;
    }

    const canLinkByEmail =
      Boolean(profile.email) &&
      profile.emailVerified &&
      !profile.isPrivateEmail;

    if (canLinkByEmail) {
      const existingByEmail = (await getDocumentByFieldFromDb(
        "email",
        profile.email,
        DBCollectionsEnum.users,
      )) as User | null;

      if (existingByEmail) {
        console.log("🔗 Linking Apple identity to existing account:", {
          userId: existingByEmail._id?.toString(),
          previousProvider: existingByEmail.provider,
        });

        const updated = (await updateUserInDb(
          existingByEmail._id?.toString() as string,
          withPreservedProfile(existingByEmail, profile),
        )) as User;
        return updated;
      }
    }

    const newUser: User = {
      ...getInitialUserData(),
      userId: profile.sub,
      appleUserId: profile.sub,
      email: profile.email,
      name: {
        givenName: profile.givenName,
        familyName: profile.familyName,
      },
      picture: "",
      provider: AuthProviderEnum.apple,
      verified: profile.emailVerified,
      ...(profile.appleRefreshToken
        ? { appleRefreshToken: profile.appleRefreshToken }
        : {}),
    };

    const newUserId = await saveUserDataToDb(newUser);

    return { ...newUser, _id: newUserId };
  } catch (error) {
    console.error("❌ Failed to find or create Apple user:", error);
    return null;
  }
};
