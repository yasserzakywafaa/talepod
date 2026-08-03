import * as Linking from "expo-linking";
import { getStateFromPath, type LinkingOptions } from "@react-navigation/native";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";

/**
 * Incoming https links are web URLs, and the web prefixes its marketing pages
 * with a locale (`/en/pricing`) that the app has no route for. Stripping it
 * lets one config serve both. `/story/:slug` is the app's own older shape,
 * kept working for links already shared.
 */
const normalizeWebPath = (path: string): string =>
  path
    .replace(/^\/[a-z]{2}(?=\/|$)/, "")
    .replace(/^\/story\//, "/bedtime-story/")
    .replace(/^\/bedtime-stories(?=\/|$)/, "/library") || "/";

/** Every provider whose browser callback the auth session consumes itself. */
const OAUTH_CALLBACK_PATH_PATTERN = /auth\/(google|apple)/;

/**
 * Deep links; without these a shared story URL drops its destination. The
 * https prefixes need association files served (docs/STORE_READINESS.md).
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    Linking.createURL("/"),
    "talepod-app://",
    "https://talepod.com",
    "https://www.talepod.com",
  ],

  config: {
    screens: {
      [rootRoutes.main]: {
        screens: {
          [mobileRoutes.public.home]: "",
          [mobileRoutes.main.shell]: {
            screens: {
              // Matches the web's own `/bedtime-story/:slug`, since a shared
              // link is a web URL that Universal Links hands to the app.
              [mobileRoutes.authenticated.viewStory]: "bedtime-story/:slug",
              [mobileRoutes.public.library]: "library",
              [mobileRoutes.public.pricing]: "pricing",
              [mobileRoutes.public.contact]: "contact",
              [mobileRoutes.public.privacyPolicy]: "privacy-policy",
              [mobileRoutes.public.termsAndConditions]: "terms-and-conditions",
              [mobileRoutes.main.tabs]: {
                screens: {
                  [mobileRoutes.tabs.create]: "create",
                  [mobileRoutes.tabs.myStories]: "my-stories",
                  [mobileRoutes.tabs.myAvatars]: "my-avatars",
                  [mobileRoutes.tabs.profile]: "profile",
                },
              },
            },
          },
        },
      },
      [mobileRoutes.public.login]: "login",
      [mobileRoutes.public.register]: "register",
    },
  },

  getStateFromPath: (path, options) =>
    getStateFromPath(normalizeWebPath(path), options),

  // `WebBrowser.openAuthSessionAsync` already consumes the OAuth callback;
  // letting React Navigation see it too would race and push a bogus screen.
  filter: (url) => !OAUTH_CALLBACK_PATH_PATTERN.test(url),
};
