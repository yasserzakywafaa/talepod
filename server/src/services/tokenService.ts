import CONFIG from "../config";
import { Request, Response } from "express";
import {
  createTokenService,
  TokenService as CoreTokenService,
  TokenPair,
} from "@yasserzakywafaa/server-core";
import { RefreshTokenPayload, TokenPayload } from "../types/token";
import { isMobileClient } from "../utils/mobileClient";

type AccessTokenInput = Omit<TokenPayload, "iat" | "exp">;
type RefreshTokenInput = Omit<RefreshTokenPayload, "iat" | "exp">;

let coreTokenService:
  | CoreTokenService<TokenPayload, RefreshTokenPayload>
  | undefined;

const getCoreTokenService = (): CoreTokenService<
  TokenPayload,
  RefreshTokenPayload
> => {
  coreTokenService ??= createTokenService<TokenPayload, RefreshTokenPayload>({
    jwtSecret: CONFIG.JWT_SECRET ?? "",
    environment: CONFIG.NODE_ENV,
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
    cookies: {
      accessTokenName: "accessToken",
      refreshTokenName: "refreshToken",
      options: {
        httpOnly: true,
        secure: CONFIG.IS_PROD,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      },
      clearOptions: {
        httpOnly: true,
        secure: CONFIG.IS_PROD,
        sameSite: "strict",
        path: "/",
      },
    },
  });

  return coreTokenService;
};

export class TokenService {
  static generateAccessToken(payload: AccessTokenInput): string {
    return getCoreTokenService().generateAccessToken(payload as TokenPayload);
  }

  static generateRefreshToken(payload: RefreshTokenInput): string {
    return getCoreTokenService().generateRefreshToken(
      payload as RefreshTokenPayload,
    );
  }

  static generateTokenPair(
    user: { userId: string; email: string },
    tokenVersion: number = 0,
  ): TokenPair {
    const accessTokenPayload: TokenPayload = {
      userId: user.userId,
      email: user.email,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      ...accessTokenPayload,
      tokenVersion,
    };

    return getCoreTokenService().generateTokenPair(
      accessTokenPayload,
      refreshTokenPayload,
    );
  }

  static verifyAccessToken(token: string): TokenPayload {
    return getCoreTokenService().verifyAccessToken(token);
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return getCoreTokenService().verifyRefreshToken(token);
  }

  static setTokenCookies(response: Response, tokenPair: TokenPair): void {
    getCoreTokenService().setTokenCookies(response, tokenPair);
  }

  static clearTokenCookies(response: Response): void {
    getCoreTokenService().clearTokenCookies(response);
  }

  static extractBearerAccessToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.trim().split(/\s+/);
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return undefined;
    }

    return token;
  }

  static extractTokenFromCookies(request: Request): {
    accessToken?: string;
    refreshToken?: string;
  } {
    const fromCookies = getCoreTokenService().extractTokenFromCookies(request);
    const bearerAccessToken = TokenService.extractBearerAccessToken(request);

    return {
      accessToken: bearerAccessToken ?? fromCookies.accessToken,
      refreshToken: fromCookies.refreshToken,
    };
  }

  static extractRefreshToken(request: Request): string | undefined {
    if (isMobileClient(request)) {
      const bodyRefreshToken =
        typeof request.body?.refreshToken === "string"
          ? request.body.refreshToken
          : undefined;

      if (bodyRefreshToken) {
        return bodyRefreshToken;
      }
    }

    return getCoreTokenService().extractTokenFromCookies(request).refreshToken;
  }
}
