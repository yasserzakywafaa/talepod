import {
  createGoogleMobileExchangeHandler,
  isMobileClient,
  withMobileTokens,
} from "@yasserzakywafaa/server-core";
import { ObjectId } from "mongodb";

import { DBCollectionsEnum, getDocumentFromDb } from "../models/mongoDb";
import { User } from "../models/types";
import { TokenService } from "./tokenService";
import { mobileOAuth } from "./mobileOAuthService";

const sanitizeUserForResponse = (user: User): Omit<User, "refreshToken"> => {
  const { refreshToken, ...safeUser } = user;
  return safeUser;
};

export const googleMobileExchange = createGoogleMobileExchangeHandler<User>({
  consumeCode: (code) => mobileOAuth.consumeCode(code),
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
