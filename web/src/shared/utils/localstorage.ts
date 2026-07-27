// Auth localStorage helpers are provided by @yasserzakywafaa/client-core/web.
// Only the auth keys are injected, so removeLocalStorageAuthItems() clears the
// token/user/auth-flag entries and leaves unrelated keys (cookie consent,
// active generation, etc.) untouched.
import { createAuthStorage } from "@yasserzakywafaa/client-core/web";
import APP_CONSTANTS from "src/application/shared/app_constants";

const { AUTHENTICATED, USER, TOKEN } = APP_CONSTANTS.LOCAL_STORAGE;

export const { getLocalStorageAuthItems, removeLocalStorageAuthItems } =
  createAuthStorage({ AUTHENTICATED, USER, TOKEN });
