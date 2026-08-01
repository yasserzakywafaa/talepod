import Constants from "expo-constants";

/**
 * User-facing app version for About / Settings.
 * Source of truth: `version` in app.config.ts (synced to native on EAS build).
 */
export const getAppVersionLabel = (): string => {
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "—";
  const build = Constants.nativeBuildVersion;

  if (build && build !== version) {
    return `${version} (${build})`;
  }

  return version;
};
