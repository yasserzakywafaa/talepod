// URL/schema helpers are provided by @yasserzakywafaa/client-core/web,
// configured with TalePod's site origin.
import { createSchemaHelpers } from "@yasserzakywafaa/client-core/web";
import APP_CONSTANTS from "src/application/shared/app_constants";

const helpers = createSchemaHelpers(
  APP_CONSTANTS.APP_URL || "https://www.talepod.com",
);

export const getBaseUrl = helpers.getBaseUrl;
export const getAbsoluteUrl = helpers.getAbsoluteUrl;
export const getImageUrl = helpers.getImageUrl;
