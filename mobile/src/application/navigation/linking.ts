import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";

import { mobileRoutes, rootRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";

/**
 * Deep link configuration.
 *
 * Without this, a `talepod-app://` or `https://talepod.com/...` link opened
 * from Messages, Mail or the web app launches the app on its default screen
 * and drops the destination — including on a **cold start**, which is the
 * common case when someone shares a story.
 *
 * `prefixes` covers three sources:
 *  - the custom scheme, which is also what the Google OAuth callback uses;
 *  - `Linking.createURL("")`, which resolves to the Expo Go / dev-client URL
 *    so deep links are testable before a standalone build exists;
 *  - the https origins, for iOS Universal Links and Android App Links.
 *
 * The https prefixes only take effect once the association files are served
 * from the web app — see `docs/STORE_READINESS.md`. Until then the custom
 * scheme works and the https links fall back to opening the website, which
 * is the correct degradation.
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

  /**
   * The OAuth callback (`auth/google`) is consumed by
   * `WebBrowser.openAuthSessionAsync`, which resolves the moment the callback
   * URL arrives. Letting React Navigation also handle it would race that
   * promise and push a bogus screen, so it is filtered out here.
   */
  filter: (url) => !url.includes("auth/google"),
};
