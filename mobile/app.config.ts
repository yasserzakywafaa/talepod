import type { ExpoConfig } from "expo/config";

const MOBILE_OAUTH_SCHEME =
  process.env.EXPO_PUBLIC_MOBILE_OAUTH_SCHEME || "talepod-app";

/** Brand colours — mirrors `src/application/theme/tokens.ts`. */
const PLUM_700 = "#0A0E2B"; // dark page background

const config: ExpoConfig = {
  name: "TalePod",
  slug: "talepod",
  scheme: MOBILE_OAUTH_SCHEME,
  // Marketing version, and (via `runtimeVersion` below) the OTA boundary:
  // bumping it starts a new runtime, cutting off existing installs.
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
    // Adds the `com.apple.developer.applesignin` entitlement. Native change —
    // an OTA update cannot deliver it, the app must be rebuilt.
    usesAppleSignIn: true,
    // Universal Links. AASA is served from web/public/.well-known/ on each
    // of these hosts (see mobile/docs/STORE_READINESS.md §7).
    associatedDomains: [
      "applinks:talepod.com",
      "applinks:www.talepod.com",
      "applinks:dev.talepod.com",
    ],
    infoPlist: {
      // Declared so App Store Connect stops asking on every submission. The
      // app uses only HTTPS and the platform keychain — no custom crypto.
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
    // Android App Links. `autoVerify` skips the app chooser once
    // assetlinks.json is live with the Play signing SHA-256.
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          { scheme: "https", host: "talepod.com", pathPrefix: "/bedtime-story" },
          { scheme: "https", host: "talepod.com", pathPrefix: "/story" },
          { scheme: "https", host: "www.talepod.com", pathPrefix: "/bedtime-story" },
          { scheme: "https", host: "www.talepod.com", pathPrefix: "/story" },
          { scheme: "https", host: "dev.talepod.com", pathPrefix: "/bedtime-story" },
          { scheme: "https", host: "dev.talepod.com", pathPrefix: "/story" },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-apple-authentication",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        // Night sky in both themes — a white launch frame reads as the
        // wrong app for a second before the first screen paints.
        backgroundColor: PLUM_700,
      },
    ],
    // Uploads source maps so stack traces show real file names. Only when
    // EAS carries the credentials — without them the plugin fails the build.
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          [
            "@sentry/react-native/expo",
            {
              organization: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
            },
          ] as [string, Record<string, unknown>],
        ]
      : []),
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
