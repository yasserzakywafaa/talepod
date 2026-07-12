import { DBCollectionsEnum, getDocumentFromDb } from "../models/mongoDb";
import { Request, RequestHandler } from "express";

import { ObjectId } from "mongodb";
import { TokenService } from "../services/tokenService";
import { User } from "../models/types";
import {
  createCookieAuthMiddleware,
  TokenPayload,
} from "@yasserzakywafaa/server-core";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const coreAuthMiddleware = createCookieAuthMiddleware<User, TokenPayload>({
  tokenService: TokenService,
  resolveUser: async (decoded) =>
    (await getDocumentFromDb(
      new ObjectId(decoded.userId),
      DBCollectionsEnum.users,
    )) as User,
  messages: {
    missingToken: "No access token provided",
    invalidToken: "Invalid access token",
    userNotFound: "User not found",
  },
  clearCookiesOnFailure: false,
  resolverErrors: "unauthorized",
});

export const authMiddleware: RequestHandler = (request, response, next) => {
  const { accessToken } = TokenService.extractTokenFromCookies(request);

  if (!accessToken) {
    TokenService.clearTokenCookies(response);
    response.status(401).json({ message: "No access token provided" });
    return;
  }

  coreAuthMiddleware(request, response, next);
};
