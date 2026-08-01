import {
  AuthProviderEnum,
  User,
  UserRole,
  getInitialUserData,
} from "../models/types";
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { deleteUserAccount } from "../services/userDeletionService";
import { DELETE_ACCOUNT_CONFIRMATION_PHRASE } from "../constants/deleteAccount";
import {
  getDocumentByFieldFromDb,
  getDocumentFromDb,
  saveUserDataToDb,
  updateUserInDb,
} from "../models/mongoDb";

import CONFIG from "../config";
import { DBCollectionsEnum } from "../models/mongoDb";
import { ObjectId } from "mongodb";
import { PhoneOtpService } from "../services/PhoneOtpService";
import { TokenService } from "../services/tokenService";
import { withMobileTokens } from "@yasserzakywafaa/server-core";
import passport from "passport";
import { randomUUID } from "crypto";
import { mobileOAuth } from "../services/mobileOAuthService";
import { googleMobileExchange } from "../services/googleMobileExchangeHandler";

/**
 * Send 200 with HTML that redirects via meta refresh. Used so cookies are set in a
 * non-redirect response — Safari often does not persist Set-Cookie when the response
 * is 302 to another origin. We use meta refresh (not inline script) so CSP does not
 * block the redirect.
 */
const sendRedirectWithCookiesSet = (res: Response, redirectUrl: string) => {
  res.status(200);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const urlForMeta = redirectUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
      <meta charset="utf-8"><meta http-equiv="refresh" content="2;url=${urlForMeta}"><title>${CONFIG.APP_URL} - Signing in…</title></head>
      <body style="background-color: #000; color: #fff; height: 100vh; font-family: sans-serif;">
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;">
          <img src="${CONFIG.APP_URL}/icons/icon_512x512.png" alt="Logo" style="margin: 0;">
          <h1>Please wait while we sign you in</h1>
          <h2>If you are not redirected, please 
            <a href="${redirectUrl}" style="color: #F0B648; text-decoration: underline; text-decoration-color: #fff;">click here</a>
             to continue.
          </h2>
        </div>
      </body>
    </html>`,
  );
};

interface PhoneOtpRequestBody {
  phoneNumber?: string;
}

interface PhoneRegisterVerifyRequestBody extends PhoneOtpRequestBody {
  otpCode?: string;
  firstName?: string;
  lastName?: string;
}

interface PhoneLoginVerifyRequestBody extends PhoneOtpRequestBody {
  otpCode?: string;
}

const OTP_CODE_REGEX = /^\d{4,8}$/;

const sanitizeUserForResponse = (user: User): Omit<User, "refreshToken"> => {
  const { refreshToken, ...safeUser } = user;
  return safeUser;
};

const normalizeAndValidatePhoneNumber = (
  rawPhoneNumber: unknown,
): string | null => {
  if (typeof rawPhoneNumber !== "string") {
    return null;
  }

  const normalizedPhoneNumber =
    PhoneOtpService.normalizePhoneNumber(rawPhoneNumber);

  if (!PhoneOtpService.isValidPhoneNumber(normalizedPhoneNumber)) {
    return null;
  }

  return normalizedPhoneNumber;
};

const isPhoneAuthConfiguredError = (message: string): boolean =>
  message.toLowerCase().includes("not configured");

const oauth2Google = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("🚀 oauth2Google route handler called");

  const isMobilePlatform = req.query.platform === "mobile";
  const redirectUriParam = req.query.redirect_uri;

  if (isMobilePlatform) {
    console.log("📱 Mobile Google OAuth start:", {
      redirectUri:
        typeof redirectUriParam === "string"
          ? redirectUriParam
          : redirectUriParam,
    });

    if (
      typeof redirectUriParam !== "string" ||
      !mobileOAuth.isAllowedRedirectUri(redirectUriParam)
    ) {
      console.error("❌ Mobile Google OAuth rejected: invalid redirect_uri", {
        redirectUri: redirectUriParam,
        scheme: CONFIG.MOBILE_OAUTH_SCHEME,
      });
      return res.status(400).json({
        message:
          "A valid redirect_uri query parameter is required for mobile Google login.",
      });
    }
  }

  const failureRedirect =
    isMobilePlatform && typeof redirectUriParam === "string"
      ? `${redirectUriParam}${redirectUriParam.includes("?") ? "&" : "?"}error=google_auth_failed`
      : `${CONFIG.APP_URL}/unauthorized?error=google_auth_failed`;

  const authenticateOptions: {
    session: boolean;
    failureRedirect: string;
    state?: string;
    prompt?: string;
  } = {
    session: false,
    failureRedirect,
    ...(isMobilePlatform ? { prompt: "select_account" } : {}),
  };

  if (isMobilePlatform && typeof redirectUriParam === "string") {
    const passportState =
      await mobileOAuth.buildPassportState(redirectUriParam);
    authenticateOptions.state = passportState;

    console.log("📱 Mobile Google OAuth state saved:", {
      state: `${passportState.slice(0, 16)}…`,
      redirectUri: redirectUriParam,
    });
  }

  return passport.authenticate(AuthProviderEnum.google, authenticateOptions)(
    req,
    res,
    next,
  );
};

const oauth2GoogleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isMobileCallback = mobileOAuth.isMobileOAuthState(req.query.state);
  console.log("🔄 Google OAuth callback received", {
    platform: isMobileCallback ? "mobile" : "web",
    state:
      typeof req.query.state === "string"
        ? String(req.query.state).slice(0, 24) + "…"
        : req.query.state,
  });

  passport.authenticate(
    AuthProviderEnum.google,
    { accessType: "online", prompt: "consent" },
    async (err: any, user: any, info: any) => {
      try {
        console.log("🔐 Passport Google OAuth authenticate result:", {
          err,
          user: user?.name?.givenName || "No name",
          info,
        });

        if (err || !user) {
          console.error("❌ Google OAuth callback error:", err);
          console.error("🔧 User object:", user);
          console.error("🔧 Info object:", info);

          if (
            await mobileOAuth.redirectMobileOAuthResult(
              req.query.state,
              { error: "google_auth_failed" },
              res,
            )
          ) {
            console.error(
              "❌ Mobile Google OAuth callback failed — redirected error to app",
            );
            return;
          }

          return res.redirect(
            `${CONFIG.APP_URL}/unauthorized?error=google_auth_failed`,
          );
        }

        // Find or create user in database
        let dbUser = await findOrCreateUser(user);
        if (!dbUser) {
          throw new Error("Failed to create or find user");
        }

        // Use token pair from strategy if available (first-time auth), otherwise generate new one
        let tokenPair = (user as any)._tokenPair;
        if (!tokenPair) {
          tokenPair = TokenService.generateTokenPair({
            userId: dbUser._id?.toString() || "",
            email: dbUser.email,
          });
        }

        if (mobileOAuth.isMobileOAuthState(req.query.state)) {
          console.log(
            "📱 Mobile Google OAuth callback: issuing one-time code",
            {
              userId: dbUser._id?.toString(),
              email: dbUser.email,
            },
          );

          const oauthCode = await mobileOAuth.createCode(
            dbUser._id?.toString() || "",
          );

          console.log("🔑 Mobile one-time code created:", {
            codeLength: oauthCode.length,
            codePreview: `${oauthCode.slice(0, 8)}…`,
          });

          if (
            await mobileOAuth.redirectMobileOAuthResult(
              req.query.state,
              { code: oauthCode },
              res,
            )
          ) {
            return;
          }

          console.error(
            "❌ Mobile Google OAuth callback: redirectMobileOAuthResult returned false after code creation",
          );
        }

        // Debug: Log token generation
        console.log("🍪 Setting cookies with tokenPair:", {
          hasAccessToken: !!tokenPair.accessToken,
          hasRefreshToken: !!tokenPair.refreshToken,
        });

        // Set HTTP-only cookies
        TokenService.setTokenCookies(res, tokenPair);

        // 200 + HTML redirect (not 302) so Safari persists cookies — Safari often
        // drops Set-Cookie when the response is a cross-origin redirect
        const redirectUrl = CONFIG.OAUTH_CALLBACK_URL(
          CONFIG.APP_URL,
          dbUser._id?.toString() || "",
          AuthProviderEnum.google,
        );
        return sendRedirectWithCookiesSet(res, redirectUrl);
      } catch (error) {
        console.error("❌ Google OAuth callback error:", error);
        if (
          await mobileOAuth.redirectMobileOAuthResult(
            req.query.state,
            { error: "server_error" },
            res,
          )
        ) {
          console.error(
            "❌ Mobile Google OAuth callback server_error — redirected error to app",
          );
          return;
        }
        return res.redirect(
          `${CONFIG.APP_URL}/unauthorized?error=server_error`,
        );
      }
    },
  )(req, res, next);
};

const sendPhoneRegisterOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber } = req.body as PhoneOtpRequestBody;
    const normalizedPhoneNumber = normalizeAndValidatePhoneNumber(phoneNumber);

    if (!normalizedPhoneNumber) {
      return res.status(400).json({
        message: "Please provide a valid phone number in E.164 format.",
      });
    }

    const existingUser = (await getDocumentByFieldFromDb(
      "phoneNumber",
      normalizedPhoneNumber,
      DBCollectionsEnum.users,
    )) as User | null;

    if (existingUser) {
      return res.status(409).json({
        message:
          "This phone number is already registered. Please login instead.",
      });
    }

    await PhoneOtpService.sendOtp(normalizedPhoneNumber, "register");
    return res.status(200).json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("❌ Failed to send phone register OTP:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send OTP.";
    const statusCode = isPhoneAuthConfiguredError(errorMessage) ? 503 : 500;
    return res.status(statusCode).json({ message: errorMessage });
  }
};

const verifyPhoneRegisterOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber, otpCode, firstName, lastName } =
      req.body as PhoneRegisterVerifyRequestBody;
    const normalizedPhoneNumber = normalizeAndValidatePhoneNumber(phoneNumber);

    if (!normalizedPhoneNumber) {
      return res.status(400).json({
        message: "Please provide a valid phone number in E.164 format.",
      });
    }

    if (!otpCode || !OTP_CODE_REGEX.test(otpCode.trim())) {
      return res.status(400).json({
        message: "Please provide a valid OTP code.",
      });
    }

    if (!firstName?.trim()) {
      return res.status(400).json({
        message: "First name is required to create an account.",
      });
    }

    const existingUser = (await getDocumentByFieldFromDb(
      "phoneNumber",
      normalizedPhoneNumber,
      DBCollectionsEnum.users,
    )) as User | null;

    if (existingUser) {
      return res.status(409).json({
        message:
          "This phone number is already registered. Please login instead.",
      });
    }

    const isOtpVerified = await PhoneOtpService.verifyOtp(
      normalizedPhoneNumber,
      otpCode,
      "register",
    );

    if (!isOtpVerified) {
      return res.status(400).json({
        message: "Invalid or expired OTP code.",
      });
    }

    const newUser: User = {
      ...getInitialUserData(),
      userId: `phone-${randomUUID()}`,
      email: "",
      phoneNumber: normalizedPhoneNumber,
      phoneVerified: true,
      name: {
        givenName: firstName.trim(),
        familyName: lastName?.trim() || "",
      },
      picture: "",
      provider: AuthProviderEnum.phone,
      verified: true,
      lastLogin: new Date(),
    };

    const newUserId = await saveUserDataToDb(newUser);
    if (!newUserId) {
      throw new Error("Failed to create a new user.");
    }

    const savedUser: User = {
      ...newUser,
      _id: newUserId,
    };

    const tokenPair = TokenService.generateTokenPair({
      userId: newUserId.toString(),
      email: savedUser.email || "",
    });
    TokenService.setTokenCookies(res, tokenPair);

    return res.status(201).json(
      withMobileTokens(req, tokenPair, {
        message: "Phone number verified. Account created successfully.",
        user: sanitizeUserForResponse(savedUser),
      }),
    );
  } catch (error) {
    console.error("❌ Failed to verify phone register OTP:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to verify OTP.";
    const statusCode = isPhoneAuthConfiguredError(errorMessage) ? 503 : 500;
    return res.status(statusCode).json({ message: errorMessage });
  }
};

const sendPhoneLoginOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber } = req.body as PhoneOtpRequestBody;
    const normalizedPhoneNumber = normalizeAndValidatePhoneNumber(phoneNumber);

    if (!normalizedPhoneNumber) {
      return res.status(400).json({
        message: "Please provide a valid phone number in E.164 format.",
      });
    }

    const existingUser = (await getDocumentByFieldFromDb(
      "phoneNumber",
      normalizedPhoneNumber,
      DBCollectionsEnum.users,
    )) as User | null;

    if (!existingUser) {
      return res.status(404).json({
        message: "No account found with this phone number. Please register.",
      });
    }

    if (!existingUser.phoneVerified && !existingUser.verified) {
      return res.status(403).json({
        message: "This phone number is not verified yet.",
      });
    }

    await PhoneOtpService.sendOtp(normalizedPhoneNumber, "login");
    return res.status(200).json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("❌ Failed to send phone login OTP:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send OTP.";
    const statusCode = isPhoneAuthConfiguredError(errorMessage) ? 503 : 500;
    return res.status(statusCode).json({ message: errorMessage });
  }
};

const verifyPhoneLoginOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber, otpCode } = req.body as PhoneLoginVerifyRequestBody;
    const normalizedPhoneNumber = normalizeAndValidatePhoneNumber(phoneNumber);

    if (!normalizedPhoneNumber) {
      return res.status(400).json({
        message: "Please provide a valid phone number in E.164 format.",
      });
    }

    if (!otpCode || !OTP_CODE_REGEX.test(otpCode.trim())) {
      return res.status(400).json({
        message: "Please provide a valid OTP code.",
      });
    }

    const existingUser = (await getDocumentByFieldFromDb(
      "phoneNumber",
      normalizedPhoneNumber,
      DBCollectionsEnum.users,
    )) as User | null;

    if (!existingUser) {
      return res.status(404).json({
        message: "No account found with this phone number. Please register.",
      });
    }

    if (!existingUser.phoneVerified && !existingUser.verified) {
      return res.status(403).json({
        message: "This phone number is not verified yet.",
      });
    }

    const isOtpVerified = await PhoneOtpService.verifyOtp(
      normalizedPhoneNumber,
      otpCode,
      "login",
    );

    if (!isOtpVerified) {
      return res.status(400).json({
        message: "Invalid or expired OTP code.",
      });
    }

    if (!existingUser._id) {
      throw new Error("User document is missing _id.");
    }

    const updatedUser = (await updateUserInDb(existingUser._id.toString(), {
      lastLogin: new Date(),
      phoneVerified: true,
      verified: true,
      provider: existingUser.provider || AuthProviderEnum.phone,
    })) as User;

    const authenticatedUser = updatedUser || existingUser;

    const tokenPair = TokenService.generateTokenPair({
      userId: authenticatedUser._id?.toString() || existingUser._id.toString(),
      email: authenticatedUser.email || "",
    });
    TokenService.setTokenCookies(res, tokenPair);

    return res.status(200).json(
      withMobileTokens(req, tokenPair, {
        message: "Login successful.",
        user: sanitizeUserForResponse(authenticatedUser),
      }),
    );
  } catch (error) {
    console.error("❌ Failed to verify phone login OTP:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to verify OTP.";
    const statusCode = isPhoneAuthConfiguredError(errorMessage) ? 503 : 500;
    return res.status(statusCode).json({ message: errorMessage });
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshTokenValue = TokenService.extractRefreshToken(req);

    if (!refreshTokenValue) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = TokenService.verifyRefreshToken(refreshTokenValue);

    // Find user in database
    const user = (await getDocumentFromDb(
      new ObjectId(decoded.userId),
      DBCollectionsEnum.users,
    )) as User;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new token pair
    const tokenPair = TokenService.generateTokenPair({
      userId: user._id?.toString() || "",
      email: user.email,
    });

    // Set new HTTP-only cookies
    TokenService.setTokenCookies(res, tokenPair);

    return res.status(200).json(
      withMobileTokens(req, tokenPair, {
        message: "Token refreshed successfully",
      }),
    );
  } catch (error) {
    console.error("❌ Token refresh error:", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear HTTP-only cookies
    TokenService.clearTokenCookies(res);

    console.log("🔒 User logged out successfully");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

const getPublicUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.userId as string;
  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const user = (await getDocumentFromDb(
      new ObjectId(userId),
      DBCollectionsEnum.users,
    )) as User | null;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { refreshToken, ...safe } = user;
    return res.status(200).json(safe);
  } catch (error) {
    console.error("❌ getPublicUserProfile:", error);
    return res.status(500).json({ message: "Failed to load user" });
  }
};

const getAuthUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = TokenService.extractTokenFromCookies(req);

    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Verify access token
    const decoded = TokenService.verifyAccessToken(accessToken);

    // Find user in database
    const user = (await getDocumentFromDb(
      new ObjectId(decoded.userId),
      DBCollectionsEnum.users,
    )) as User;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return user data without sensitive information
    const { refreshToken, ...userWithoutToken } = user;

    return res.status(200).json(userWithoutToken);
  } catch (error) {
    console.error("❌ Get OAuth2 user info error:", error);
    return res.status(401).json({ message: "Invalid access token" });
  }
};

const findOrCreateUser = async (oauthUser: any): Promise<User | null> => {
  try {
    // Check if user exists by userId
    let user = (await getDocumentByFieldFromDb(
      "userId",
      oauthUser.userId,
      DBCollectionsEnum.users,
    )) as User;

    if (!user) {
      // Create new user
      const newUser = {
        ...getInitialUserData(),
        userId: oauthUser.userId,
        email: oauthUser.email,
        name: oauthUser.name,
        picture: oauthUser.picture,
        provider: oauthUser.provider,
        verified: oauthUser.verified,
        refreshToken: oauthUser.refreshToken, // Only save if provided
      };

      const newUserId = await saveUserDataToDb(newUser);
      user = {
        ...newUser,
        _id: newUserId,
      };
    } else {
      // Update existing user with latest OAuth data
      const updateData: any = {
        name: oauthUser.name,
        picture: oauthUser.picture,
        lastLogin: new Date(),
      };

      // Only update refresh token if it's provided (first-time authorization)
      if (oauthUser.refreshToken) {
        updateData.refreshToken = oauthUser.refreshToken;
        console.log("🔄 Updating refresh token for user:", oauthUser.userId);
      } else {
        console.log("ℹ️  No refresh token provided, keeping existing one");
      }

      const updatedUser = (await updateUserInDb(
        user._id?.toString() as string,
        updateData,
      )) as User;
      user = updatedUser;
    }

    return user;
  } catch (error) {
    console.error("❌ Failed to find or create user:", error);
    return null;
  }
};

const updateUserInfo = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { userId, userInfoToUpdate } = request.body;

  if (!userId) {
    response.status(400).json({ message: "❌ 'userId' is required!" });
    return;
  }

  try {
    const userDocument = (await updateUserInDb(userId, {
      ...userInfoToUpdate,
    })) as User;

    response.status(200).json(userDocument);
  } catch (error) {
    response
      .status(500)
      .json({ message: "❌ Failed to update user information!" });
  }
};

const deleteAccount = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  const { confirmationPhrase } = request.body ?? {};
  const user = request.user;

  if (!user?._id) {
    response.status(401).json({ message: "❌ Authentication required" });
    return;
  }

  if (user.role === UserRole.admin || user.role === UserRole.super_admin) {
    response.status(403).json({
      message: "❌ Admin accounts cannot be deleted via self-service",
    });
    return;
  }

  if (!confirmationPhrase || typeof confirmationPhrase !== "string") {
    response.status(400).json({
      message: "❌ Confirmation phrase is required",
    });
    return;
  }

  if (confirmationPhrase.trim() !== DELETE_ACCOUNT_CONFIRMATION_PHRASE) {
    response.status(400).json({
      message: `❌ Please type "${DELETE_ACCOUNT_CONFIRMATION_PHRASE}" to confirm`,
    });
    return;
  }

  try {
    const result = await deleteUserAccount(user._id.toString(), {
      blockAdminSelfDelete: true,
    });

    TokenService.clearTokenCookies(response);

    response.status(200).json({
      message: "✅ Account deleted successfully",
      deleted: result.deleted,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error("❌ Failed to delete account:", error);

    if (error instanceof Error && error.message === "User not found") {
      response.status(404).json({ message: "❌ User not found" });
      return;
    }

    response.status(500).json({ message: "❌ Failed to delete account" });
  }
};

const AuthController = {
  oauth2Google,
  oauth2GoogleCallback,
  googleMobileExchange,
  sendPhoneRegisterOtp,
  verifyPhoneRegisterOtp,
  sendPhoneLoginOtp,
  verifyPhoneLoginOtp,
  refreshToken,
  logout,
  getPublicUserProfile,
  getAuthUserInfo,
  updateUserInfo,
  deleteAccount,
};

export default AuthController;
