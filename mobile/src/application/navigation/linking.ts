import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";

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
              // The shared-story destination — the one link that matters most.
              [mobileRoutes.authenticated.viewStory]: "story/:slug",
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

  // `WebBrowser.openAuthSessionAsync` already consumes the OAuth callback;
  // letting React Navigation see it too would race and push a bogus screen.
  filter: (url) => !url.includes("auth/google"),
};
