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
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  owner: "yasserzakywafaa",
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default config;
