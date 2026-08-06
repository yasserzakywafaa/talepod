import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import {
  parseMobileOAuthCallbackUrl,
  redactMobileOAuthCallbackUrl,
} from "@yasserzakywafaa/client-core";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { mobileApiHeaders } from "src/application/auth/mobileApiHeaders";
import { logger } from "src/shared/logger";
import type { User } from "src/shared/types/user";

WebBrowser.maybeCompleteAuthSession();

export type AppleBrowserSignInResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

// Never log verbatim: the callback URL carries the authorization code and
// the exchange response the email, and release bundles keep `console.*`.
export const signInWithAppleBrowser =
  async (): Promise<AppleBrowserSignInResult | null> => {
    const redirectUri = Linking.createURL("auth/apple");

    const authUrl = `${END_POINTS.AUTH.APPLE}?${new URLSearchParams({
      platform: "mobile",
      redirect_uri: redirectUri,
    }).toString()}`;

    logger.debug("Mobile Apple OAuth: opening browser");

    try {
      // Invalid origins (e.g. missing http:// in .env) crash
      // ASWebAuthenticationSession on iOS.
      new URL(authUrl);
      new URL(redirectUri);
    } catch {
      throw new Error(
        "Invalid API URL for Apple login. Set EXPO_PUBLIC_LOCAL_API_URL to http://YOUR_IP:PORT",
      );
    }

    const authSessionResult = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUri,
      { preferEphemeralSession: false },
    );

    logger.debug("Mobile Apple OAuth: browser session closed", {
      type: authSessionResult.type,
      callbackUrl:
        authSessionResult.type === "success" && authSessionResult.url
          ? redactMobileOAuthCallbackUrl(authSessionResult.url)
          : undefined,
    });

    if (authSessionResult.type !== "success" || !authSessionResult.url) {
      if (authSessionResult.type !== "cancel") {
        logger.warn("Mobile Apple OAuth: browser returned no callback URL", {
          type: authSessionResult.type,
        });
      }
      return null;
    }

    const { code, error } = parseMobileOAuthCallbackUrl(authSessionResult.url);

    if (error) {
      // Apple's error slug (e.g. `user_cancelled_authorize`) carries no user data.
      logger.warn("Mobile Apple OAuth: callback returned an error", { error });
      throw new Error(error);
    }

    if (!code) {
      logger.warn("Mobile Apple OAuth: callback missing code");
      throw new Error("Missing authorization code from Apple login.");
    }

    const response = await api.post<{
      message: string;
      user: User;
      accessToken?: string;
      refreshToken?: string;
    }>(
      END_POINTS.AUTH.APPLE_MOBILE_EXCHANGE,
      { code },
      { headers: mobileApiHeaders },
    );

    const { user, accessToken, refreshToken } = response.data;
    if (!accessToken || !refreshToken) {
      throw new Error("Mobile Apple auth response missing tokens");
    }

    logger.debug("Mobile Apple OAuth: login successful");

    return { user, accessToken, refreshToken };
  };
