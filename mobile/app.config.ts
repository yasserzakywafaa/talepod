import type { ExpoConfig } from "expo/config";

const MOBILE_OAUTH_SCHEME =
  process.env.EXPO_PUBLIC_MOBILE_OAUTH_SCHEME || "talepod-app";

/** Brand colours — mirrors `src/application/theme/tokens.ts`. */
const PLUM_700 = "#0A0E2B"; // dark page background

const config: ExpoConfig = {
  name: "TalePod",
  slug: "talepod",
  scheme: MOBILE_OAUTH_SCHEME,
  version: "1.0.0",
  // Follow the device. A story being read aloud is often propped sideways,
  // and the layout is width-driven rather than fixed to a portrait frame.
  orientation: "default",
  // Opaque, square, night-sky icon. iOS rejects alpha in app icons and draws
  // transparency as black, so this must not be the adaptive foreground.
  icon: "./assets/icon.png",
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
      backgroundColor: PLUM_700,
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
  plugins: [
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        // Night sky in both themes, not just dark mode: the mark is a bunny
        // asleep on a moon, and a white launch frame reads as the wrong app
        // for a second before the first screen paints.
        backgroundColor: PLUM_700,
      },
    ],
  ],
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
