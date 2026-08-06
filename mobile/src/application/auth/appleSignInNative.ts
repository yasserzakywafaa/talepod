import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { mobileApiHeaders } from "src/application/auth/mobileApiHeaders";
import { logger } from "src/shared/logger";
import type { User } from "src/shared/types/user";

export type AppleNativeSignInResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/** Apple's own cancel code — a dismissed sheet is not an error worth surfacing. */
const CANCELLED_CODE = "ERR_REQUEST_CANCELED";

const isCancellation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { code?: string }).code === CANCELLED_CODE;

/**
 * iOS Sign in with Apple through the system sheet. Apple requires the native
 * sheet on iOS, so this is not the browser flow used elsewhere: the app already
 * holds a signed identity token and posts it straight to the server.
 *
 * Never log the identity token or the authorization code — release bundles keep
 * `console.*`.
 */
export const signInWithAppleNative =
  async (): Promise<AppleNativeSignInResult | null> => {
    // Apple expects a SHA-256 hash in the request; the token carries that hash
    // while the server still receives the raw nonce for verification.
    const rawNonce = Crypto.randomUUID();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce,
    );

    logger.debug("Native Apple sign-in: presenting system sheet");

    let credential: AppleAuthentication.AppleAuthenticationCredential;
    try {
      credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
    } catch (error) {
      if (isCancellation(error)) {
        logger.debug("Native Apple sign-in: cancelled by user");
        return null;
      }
      throw error;
    }

    if (!credential.identityToken) {
      logger.warn("Native Apple sign-in: credential missing identity token");
      throw new Error("Missing identity token from Apple sign-in.");
    }

    // Name and email come back on the first authorization only, so whatever is
    // present here has to reach the server on this request or it is lost.
    const response = await api.post<{
      message: string;
      user: User;
      accessToken?: string;
      refreshToken?: string;
    }>(
      END_POINTS.AUTH.APPLE_NATIVE_EXCHANGE,
      {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        nonce: rawNonce,
        ...(credential.fullName
          ? {
              fullName: {
                givenName: credential.fullName.givenName,
                familyName: credential.fullName.familyName,
              },
            }
          : {}),
      },
      { headers: mobileApiHeaders },
    );

    const { user, accessToken, refreshToken } = response.data;
    if (!accessToken || !refreshToken) {
      throw new Error("Native Apple auth response missing tokens");
    }

    logger.debug("Native Apple sign-in: login successful");

    return { user, accessToken, refreshToken };
  };
