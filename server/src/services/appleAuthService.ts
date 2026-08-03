import {
  createAppleAuthService,
  type AppleAuthService,
} from "@yasserzakywafaa/server-core";

import CONFIG from "../config";

/**
 * Built lazily so a deployment without Apple credentials still boots — the
 * Apple routes return a configuration error instead of crashing the server,
 * mirroring how googleStrategy.ts warns and skips.
 */
let appleAuthService: AppleAuthService | undefined;
let hasWarned = false;

export const isAppleAuthConfigured = (): boolean =>
  Boolean(
    CONFIG.APPLE_TEAM_ID &&
      CONFIG.APPLE_KEY_ID &&
      CONFIG.APPLE_PRIVATE_KEY &&
      (CONFIG.APPLE_SERVICES_ID || CONFIG.APPLE_BUNDLE_ID),
  );

export const getAppleAuth = (): AppleAuthService | null => {
  if (!isAppleAuthConfigured()) {
    if (!hasWarned) {
      console.warn("⚠️  Sign in with Apple credentials not configured");
      hasWarned = true;
    }
    return null;
  }

  appleAuthService ??= createAppleAuthService({
    teamId: CONFIG.APPLE_TEAM_ID as string,
    keyId: CONFIG.APPLE_KEY_ID as string,
    privateKey: CONFIG.APPLE_PRIVATE_KEY as string,
    bundleId: CONFIG.APPLE_BUNDLE_ID,
    ...(CONFIG.APPLE_SERVICES_ID
      ? { servicesId: CONFIG.APPLE_SERVICES_ID }
      : {}),
  });

  return appleAuthService;
};

/** Throws where a missing configuration should surface as a 500, not a crash. */
export const requireAppleAuth = (): AppleAuthService => {
  const service = getAppleAuth();
  if (!service) {
    throw new Error("Sign in with Apple is not configured");
  }
  return service;
};
