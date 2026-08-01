import APP_CONSTANTS from "src/application/shared/app_constants";
import { ChildGenderEnum } from "src/components/StoryCreator/store/state";
import { ALL_PUBLIC_SEGMENTS } from "src/application/routes";
import { routes } from "src/application/routes";
import { User } from "src/shared/types/user";
import { DEFAULT_LOCALE_CONFIG } from "@yasserzakywafaa/client-core/web/i18n";

/**
 * Tiny sessionStorage helpers so a return URL and an in-progress Create-form
 * draft survive the Google OAuth round-trip (a full-page redirect that wipes
 * in-memory React state). sessionStorage is per-tab and stays in the same tab
 * across the redirect, so no server changes are needed.
 *
 * The `consume*` helpers read-and-clear in one call (the value is only ever
 * needed once, right after auth), so callers can't accidentally act on a stale
 * value left over from a previous flow.
 */

const {
  RETURN_URL: RETURN_URL_KEY,
  CREATE_DRAFT: DRAFT_KEY,
  MINI_STORY: MINI_STORY_KEY,
} = APP_CONSTANTS.SESSION_STORAGE;
const DRAFT_VERSION = 1;

const { supportedLocales } = DEFAULT_LOCALE_CONFIG;

// Never return the user to an auth/error route — that would loop or be useless.
const BLOCKED_EXACT = [
  "/login",
  "/register",
  "/logout",
  "/unauthorized",
  "/notfound",
];

const normalizeSegment = (segment: string): string =>
  segment.replace(/^\/+|\/+$/g, "");

const isPublicMarketingSegment = (segment: string): boolean =>
  ALL_PUBLIC_SEGMENTS.some(
    (publicSegment) => normalizeSegment(publicSegment) === segment,
  );

/**
 * Return URLs must point at a real post-auth destination. Rejects stale paths
 * from other apps (e.g. move-pi `/en/dashboard/admin/users`) and locale-prefixed
 * dashboard URLs (dashboard stays flat on talepod).
 */
const isSafeUrl = (url: string | null): url is string => {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  const [pathname] = url.split("?");
  if (BLOCKED_EXACT.some((blocked) => pathname === blocked)) {
    return false;
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return false;
  }

  // Locale-prefixed marketing pages only (e.g. /ar/pricing).
  if (supportedLocales.includes(parts[0])) {
    const segment = parts.slice(1).join("/");
    if (segment.startsWith("dashboard")) {
      return false;
    }
    if (!segment) {
      return true;
    }
    return isPublicMarketingSegment(segment);
  }

  // Flat app routes — never locale-prefixed.
  if (pathname.startsWith("/dashboard")) {
    // Talepod uses /dashboard/users, not move-pi's /dashboard/admin/users.
    if (pathname.includes("/dashboard/admin/")) {
      return false;
    }
    return true;
  }

  const flatAllowedPrefixes = [
    "/my-profile/",
    "/my-bedtime-stories/",
    "/bedtime-story/",
    "/payment-status/",
    "/avatars",
    "/blogs",
    "/blog/",
  ];

  return flatAllowedPrefixes.some(
    (prefix) => pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix),
  );
};

export const saveReturnUrl = (url: string): void => {
  if (!isSafeUrl(url)) return;
  try {
    sessionStorage.setItem(RETURN_URL_KEY, url);
  } catch {
    /* storage unavailable — skip */
  }
};

/** Read validated return URL without clearing sessionStorage. */
export const peekReturnUrl = (): string | null => {
  try {
    const url = sessionStorage.getItem(RETURN_URL_KEY);
    return isSafeUrl(url) ? url : null;
  } catch {
    return null;
  }
};

export const consumeReturnUrl = (): string | null => {
  try {
    const url = peekReturnUrl();
    sessionStorage.removeItem(RETURN_URL_KEY);
    return url;
  } catch {
    return null;
  }
};

/** After auth, prefer saved return URL, then the user's story library. */
export const consumePostAuthRedirect = (user: User): string => {
  const returnUrl = consumeReturnUrl();
  if (returnUrl) {
    return returnUrl;
  }
  return routes.myStories(user._id);
};

export const saveCreateDraft = (draft: object): void => {
  try {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ version: DRAFT_VERSION, ...draft }),
    );
  } catch {
    /* serialization / storage failure — skip */
  }
};

export const consumeCreateDraft = (): Record<string, unknown> | null => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    sessionStorage.removeItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft?.version === DRAFT_VERSION ? draft : null;
  } catch {
    return null;
  }
};

export type PendingMiniStory = {
  name: string;
  gender: ChildGenderEnum;
};

/**
 * Homepage mini form: remember the typed name + chosen gender AND a "generate
 * after auth" intent, so that once the user authenticates we can prefill the
 * profile and kick off generation without a second click. Separate key from
 * CREATE_DRAFT so the two flows never interfere.
 */
export const savePendingMiniStory = (payload: PendingMiniStory): void => {
  try {
    sessionStorage.setItem(
      MINI_STORY_KEY,
      JSON.stringify({ version: DRAFT_VERSION, ...payload }),
    );
  } catch {
    /* storage unavailable — skip */
  }
};

export const consumePendingMiniStory = (): PendingMiniStory | null => {
  try {
    const raw = sessionStorage.getItem(MINI_STORY_KEY);
    sessionStorage.removeItem(MINI_STORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== DRAFT_VERSION || typeof parsed.name !== "string") {
      return null;
    }
    // Tolerate older blobs that only stored a name (pre-gender flows still in
    // flight across the redirect) by defaulting to Boy.
    const gender =
      parsed.gender === ChildGenderEnum.Boy ||
      parsed.gender === ChildGenderEnum.Girl
        ? parsed.gender
        : ChildGenderEnum.Boy;
    return { name: parsed.name, gender };
  } catch {
    return null;
  }
};
