import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import { signInWithAppleBrowser } from "src/application/auth/appleSignInBrowser";
import { signInWithAppleNative } from "src/application/auth/appleSignInNative";
import type { User } from "src/shared/types/user";

export type AppleSignInResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/**
 * Apple requires the native sheet on iOS — a web view there is a review risk —
 * so only Android and older iOS fall back to the browser flow.
 */
export const isNativeAppleSignInAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== "ios") {
    return false;
  }
  return AppleAuthentication.isAvailableAsync();
};

export const signInWithApple = async (): Promise<AppleSignInResult | null> =>
  (await isNativeAppleSignInAvailable())
    ? signInWithAppleNative()
    : signInWithAppleBrowser();
