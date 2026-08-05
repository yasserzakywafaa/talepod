import {
  createAppleNativeExchangeHandler,
  createMobileExchangeHandler,
  isMobileClient,
  withMobileTokens,
} from "@yasserzakywafaa/server-core";
import { ObjectId } from "mongodb";

import CONFIG from "../config";
import { DBCollectionsEnum, getDocumentFromDb } from "../models/mongoDb";
import { User } from "../models/types";
import { appleMobileOAuth } from "./appleMobileOAuthService";
import { findOrCreateAppleUser } from "./appleUserService";
import { requireAppleAuth } from "./appleAuthService";
import { TokenService } from "./tokenService";

const sanitizeUserForResponse = (
  user: User,
): Omit<User, "refreshToken" | "appleRefreshToken"> => {
  const { refreshToken, appleRefreshToken, ...safeUser } = user;
  return safeUser;
};

/**
 * Android and the browser fallback: the callback already issued a one-time code,
 * so this is the same opaque-code exchange the Google flow uses.
 */
export const appleMobileExchange = createMobileExchangeHandler<User>({
  providerLabel: "Apple",
  consumeCode: (code) => appleMobileOAuth.consumeCode(code),
  isMobileClient,
  resolveUser: async (userId) =>
    (await getDocumentFromDb(
      new ObjectId(userId),
      DBCollectionsEnum.users,
    )) as User | null,
  generateTokenPair: (user) => TokenService.generateTokenPair(user),
  sanitizeUser: sanitizeUserForResponse,
  withMobileTokens,
});

/**
 * iOS native: the app already holds an identity token from the system sheet,
 * so there is no browser round trip and no one-time code.
 */
export const appleNativeExchange = createAppleNativeExchangeHandler<User>({
  verifyIdentityToken: (identityToken, options) =>
    requireAppleAuth().verifyIdentityToken(identityToken, options),
  exchangeAuthorizationCode: (options) =>
    requireAppleAuth().exchangeAuthorizationCode({
      ...options,
      clientId: CONFIG.APPLE_BUNDLE_ID,
    }),
  // Tokens from the system sheet carry the iOS bundle ID; the Services ID
  // belongs to the browser flow and must not be accepted here.
  audience: [
    CONFIG.APPLE_BUNDLE_ID,
    // Only to test in Expo Go
    ...CONFIG.APPLE_DEV_EXTRA_AUDIENCES,
  ],
  isMobileClient,
  resolveUser: findOrCreateAppleUser,
  getUserId: (user) => user._id?.toString() ?? "",
  generateTokenPair: (user) => TokenService.generateTokenPair(user),
  sanitizeUser: sanitizeUserForResponse,
  withMobileTokens,
});
