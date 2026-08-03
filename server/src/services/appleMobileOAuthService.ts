import { createMobileOAuthService } from "@yasserzakywafaa/server-core";

import CONFIG from "../config";
import { DBCollectionsEnum, getCollection } from "../models/mongoDb";

/**
 * Same one-time-code and redirect-state storage as the Google flow — codes are
 * opaque, so the collections are shared. Only the deep-link fallback differs:
 * a failed Apple sign-in must land on `talepod-app://auth/apple`, not
 * `auth/google`, or the app's callback filter will not recognise it.
 */
export const appleMobileOAuth = createMobileOAuthService({
  mobileOAuthScheme: CONFIG.MOBILE_OAUTH_SCHEME,
  fallbackPath: "auth/apple",
  getCodesCollection: () => getCollection(DBCollectionsEnum.mobileOAuthCodes),
  getRedirectsCollection: () =>
    getCollection(DBCollectionsEnum.mobileOAuthRedirects),
});
