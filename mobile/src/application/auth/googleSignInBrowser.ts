import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import {
  parseMobileOAuthCallbackUrl,
  redactMobileOAuthCallbackUrl,
} from "@yasserzakywafaa/client-core";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { mobileApiHeaders } from "src/application/auth/mobileApiHeaders";
import logger from "src/shared/logger";
import type { User } from "src/shared/types/user";

WebBrowser.maybeCompleteAuthSession();

export type GoogleBrowserSignInResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/**
 * Nothing in this flow may be logged verbatim: the callback URL carries the
 * authorization code, and the exchange response carries the account's email.
 * `console.*` is not stripped from release bundles, so anything logged here
 * is readable from a connected device on a shipped build. Diagnostics go
 * through `logger`, which is a no-op outside development, and the callback
 * URL is redacted even there.
 */
export const signInWithGoogleBrowser =
  async (): Promise<GoogleBrowserSignInResult | null> => {
    const redirectUri = Linking.createURL("auth/google");

    const authUrl = `${END_POINTS.AUTH.GOOGLE}?${new URLSearchParams({
      platform: "mobile",
      redirect_uri: redirectUri,
    }).toString()}`;

    logger.debug("Mobile Google OAuth: opening browser");

    try {
      // Invalid origins (e.g. missing http:// in .env) crash
      // ASWebAuthenticationSession on iOS.
      new URL(authUrl);
      new URL(redirectUri);
    } catch {
      throw new Error(
        "Invalid API URL for Google login. Set EXPO_PUBLIC_LOCAL_API_URL to http://YOUR_IP:PORT",
      );
    }

    const authSessionResult = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUri,
      // Shared Safari session so Google remembers the account until manual
      // logout (logout calls WebBrowser.coolDownAsync()).
      { preferEphemeralSession: false },
    );

    logger.debug("Mobile Google OAuth: browser session closed", {
      type: authSessionResult.type,
      callbackUrl:
        authSessionResult.type === "success" && authSessionResult.url
          ? redactMobileOAuthCallbackUrl(authSessionResult.url)
          : undefined,
    });

    if (authSessionResult.type !== "success" || !authSessionResult.url) {
      if (authSessionResult.type !== "cancel") {
        logger.warn("Mobile Google OAuth: browser returned no callback URL", {
          type: authSessionResult.type,
        });
      }
      return null;
    }

    const { code, error } = parseMobileOAuthCallbackUrl(authSessionResult.url);

    if (error) {
      // Google's error slug (e.g. `access_denied`) carries no user data.
      logger.warn("Mobile Google OAuth: callback returned an error", { error });
      throw new Error(error);
    }

    if (!code) {
      logger.warn("Mobile Google OAuth: callback missing code");
      throw new Error("Missing authorization code from Google login.");
    }

    const response = await api.post<{
      message: string;
      user: User;
      accessToken?: string;
      refreshToken?: string;
    }>(
      END_POINTS.AUTH.GOOGLE_MOBILE_EXCHANGE,
      { code },
      { headers: mobileApiHeaders },
    );

    const { user, accessToken, refreshToken } = response.data;
    if (!accessToken || !refreshToken) {
      throw new Error("Mobile Google auth response missing tokens");
    }

    logger.debug("Mobile Google OAuth: login successful");

    return { user, accessToken, refreshToken };
  };
