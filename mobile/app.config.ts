import type { ExpoConfig } from "expo/config";

const MOBILE_OAUTH_SCHEME =
  process.env.EXPO_PUBLIC_MOBILE_OAUTH_SCHEME || "talepod-app";

const config: ExpoConfig = {
  name: "TalePod",
  slug: "talepod",
  scheme: MOBILE_OAUTH_SCHEME,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/android-icon-foreground.png",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.talepod.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#14133E",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: "com.talepod.app",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "e45e39e8-00dd-4c56-90db-e4f2496bb745",
    },
  },
  owner: "swissli",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/e45e39e8-00dd-4c56-90db-e4f2496bb745",
  },
};

export default config;
