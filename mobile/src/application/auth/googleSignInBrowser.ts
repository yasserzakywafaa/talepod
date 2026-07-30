import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { mobileApiHeaders } from "src/application/auth/mobileApiHeaders";
import type { User } from "src/shared/types/user";

WebBrowser.maybeCompleteAuthSession();

export type GoogleBrowserSignInResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/** randomBytes(32).toString("hex") on the server */
const MOBILE_OAUTH_CODE_HEX_LENGTH = 64;

const stripUrlHash = (url: string): string => url.split("#")[0];

const parseAuthCallbackUrl = (
  url: string,
): { code?: string; error?: string } => {
  // Expo/iOS may append "#" to exp:// callback URLs. Feeding that into
  // URLSearchParams would attach "#" to ?code= and break the 64-char hex code.
  const urlWithoutHash = stripUrlHash(url);
  const queryStart = urlWithoutHash.indexOf("?");
  const query = queryStart >= 0 ? urlWithoutHash.slice(queryStart + 1) : "";
  const params = new URLSearchParams(query);
  const rawCode = params.get("code") ?? undefined;
  const code =
    rawCode?.replace(/[^a-f0-9]/gi, "").slice(0, MOBILE_OAUTH_CODE_HEX_LENGTH) ||
    undefined;

  return {
    code:
      code?.length === MOBILE_OAUTH_CODE_HEX_LENGTH ? code : undefined,
    error: params.get("error") ?? undefined,
  };
};

const redactCallbackUrl = (url: string): string => {
  const urlWithoutHash = stripUrlHash(url);
  const queryStart = urlWithoutHash.indexOf("?");
  if (queryStart < 0) {
    return urlWithoutHash;
  }

  const base = urlWithoutHash.slice(0, queryStart);
  const params = new URLSearchParams(urlWithoutHash.slice(queryStart + 1));
  const code = params.get("code");

  if (code) {
    params.set(
      "code",
      code.length > 8 ? `${code.slice(0, 8)}…(${code.length} chars)` : "[redacted]",
    );
  }

  return `${base}?${params.toString()}`;
};

export const signInWithGoogleBrowser =
  async (): Promise<GoogleBrowserSignInResult | null> => {
    const redirectUri = Linking.createURL("auth/google");

    const authUrl = `${END_POINTS.AUTH.GOOGLE}?${new URLSearchParams({
      platform: "mobile",
      redirect_uri: redirectUri,
    }).toString()}`;

    console.log("📱 Mobile Google OAuth: opening browser", {
      authUrl,
      redirectUri,
    });

    try {
      // Invalid origins (e.g. missing http:// in .env) crash ASWebAuthenticationSession on iOS.
      new URL(authUrl);
      new URL(redirectUri);
    } catch {
      console.error("❌ Mobile Google OAuth: invalid API or redirect URL");
      throw new Error(
        "Invalid API URL for Google login. Set EXPO_PUBLIC_LOCAL_API_URL to http://YOUR_IP:PORT",
      );
    }

    const authSessionResult = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUri,
      // Shared Safari session so Google remembers the account until manual logout
      // (logout calls WebBrowser.coolDownAsync()).
      { preferEphemeralSession: false },
    );

    console.log("📱 Mobile Google OAuth: browser session closed", {
      type: authSessionResult.type,
      callbackUrl:
        authSessionResult.type === "success" && authSessionResult.url
          ? redactCallbackUrl(authSessionResult.url)
          : undefined,
    });

    if (authSessionResult.type !== "success" || !authSessionResult.url) {
      if (authSessionResult.type === "cancel") {
        console.log("ℹ️  Mobile Google OAuth: user cancelled");
      } else {
        console.error("❌ Mobile Google OAuth: browser did not return a callback URL", {
          type: authSessionResult.type,
        });
      }
      return null;
    }

    const { code, error } = parseAuthCallbackUrl(authSessionResult.url);

    if (error) {
      console.error("❌ Mobile Google OAuth: callback returned error", { error });
      throw new Error(error);
    }

    if (!code) {
      console.error("❌ Mobile Google OAuth: callback missing code", {
        callbackUrl: redactCallbackUrl(authSessionResult.url),
      });
      throw new Error("Missing authorization code from Google login.");
    }

    const rawCode = new URLSearchParams(
      stripUrlHash(authSessionResult.url).split("?")[1] ?? "",
    ).get("code");
    if (rawCode && rawCode.length !== code.length) {
      console.log("📱 Mobile Google OAuth: stripped non-hex from callback code", {
        rawCodeLength: rawCode.length,
        normalizedCodeLength: code.length,
        strippedCharCodes: [...rawCode.slice(code.length)].map((char) =>
          char.charCodeAt(0),
        ),
      });
    }

    console.log("📲 Mobile Google OAuth: exchanging code", {
      codeLength: code.length,
      codePreview: code.length > 8 ? `${code.slice(0, 8)}…` : "[short]",
      exchangeUrl: END_POINTS.AUTH.GOOGLE_MOBILE_EXCHANGE,
    });

    try {
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
        console.error("❌ Mobile Google OAuth: exchange response missing tokens", {
          hasAccessToken: Boolean(accessToken),
          hasRefreshToken: Boolean(refreshToken),
        });
        throw new Error("Mobile Google auth response missing tokens");
      }

      console.log("✅ Mobile Google OAuth: login successful", {
        userId: user._id,
        email: user.email,
        hasAccessToken: true,
        hasRefreshToken: true,
      });

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("❌ Mobile Google OAuth: exchange request failed", error);
      throw error;
    }
  };
