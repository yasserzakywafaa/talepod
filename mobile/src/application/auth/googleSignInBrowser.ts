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

const parseAuthCallbackUrl = (
  url: string,
): { code?: string; error?: string } => {
  const queryStart = url.indexOf("?");
  const query = queryStart >= 0 ? url.slice(queryStart + 1) : "";
  const params = new URLSearchParams(query);
  return {
    code: params.get("code") ?? undefined,
    error: params.get("error") ?? undefined,
  };
};

export const signInWithGoogleBrowser =
  async (): Promise<GoogleBrowserSignInResult | null> => {
    const redirectUri = Linking.createURL("auth/google");

    const authUrl = `${END_POINTS.AUTH.GOOGLE}?${new URLSearchParams({
      platform: "mobile",
      redirect_uri: redirectUri,
    }).toString()}`;

    try {
      // Invalid origins (e.g. missing http:// in .env) crash ASWebAuthenticationSession on iOS.
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
      // Shared Safari session so Google remembers the account until manual logout
      // (logout calls WebBrowser.coolDownAsync()).
      { preferEphemeralSession: false },
    );

    if (authSessionResult.type !== "success" || !authSessionResult.url) {
      return null;
    }

    const { code, error } = parseAuthCallbackUrl(authSessionResult.url);

    if (error) {
      throw new Error(error);
    }

    if (!code) {
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

    return { user, accessToken, refreshToken };
  };
