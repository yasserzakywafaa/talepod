import { createMobileOAuthService } from "@yasserzakywafaa/server-core";

import CONFIG from "../config";
import { DBCollectionsEnum, getCollection } from "../models/mongoDb";

export const mobileOAuth = createMobileOAuthService({
  mobileOAuthScheme: CONFIG.MOBILE_OAUTH_SCHEME,
  getCodesCollection: () => getCollection(DBCollectionsEnum.mobileOAuthCodes),
  getRedirectsCollection: () =>
    getCollection(DBCollectionsEnum.mobileOAuthRedirects),
});
