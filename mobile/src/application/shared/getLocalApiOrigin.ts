import Constants from "expo-constants";
import { Platform } from "react-native";

const stripTrailingSlash = (url: string) => url.replace(/\/$/, "");

/** Ensures EXPO_PUBLIC_LOCAL_API_URL works with or without a scheme. */
const normalizeOrigin = (value: string): string => {
  const trimmed = stripTrailingSlash(value.trim());
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `http://${trimmed}`;
};

/**
 * Base URL for the API when EXPO_PUBLIC_ENV=local.
 * Uses Metro/Expo host (LAN IP) so physical devices can reach the dev machine.
 */
export const getLocalApiOrigin = (port: string): string => {
  const explicit = process.env.EXPO_PUBLIC_LOCAL_API_URL?.trim();
  if (explicit) {
    return normalizeOrigin(explicit);
  }

  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    if (host) {
      return `http://${host}:${port}`;
    }
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.linkingUri;
  if (hostUri) {
    const withoutScheme = hostUri.replace(/^[\w+.-]+:\/\//, "");
    const host = withoutScheme.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:${port}`;
    }
  }

  const hostname = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${hostname}:${port}`;
};
