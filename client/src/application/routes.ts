import { getPrerenderPaths } from "@yasserzakywafaa/client-core/web/i18n";

const landingPageSegments = {
  bedtimeStoriesForKids: "bedtime-stories-for-kids",
  bedtimeStoriesForAdults: "bedtime-stories-for-adults",
  shortBedtimeStories: "short-bedtime-stories",
  christmasBedtimeStories: "christmas-bedtime-stories",
  bedtimeStoriesForGirlfriend: "bedtime-stories-for-girlfriend",
  bedtimeStoriesForToddlers: "bedtime-stories-for-toddlers",
  educationalBedtimeStories: "educational-bedtime-stories",
  babyBedtimeStories: "baby-bedtime-stories",
  bestBedtimeStories: "best-bedtime-stories",
  quickBedtimeStories: "quick-bedtime-stories",
  alternatives: "alternatives",
  personalizedBedtimeStoryGenerator: "personalized-bedtime-story-generator",
} as const;

/**
 * Public marketing pages are stored as URL SEGMENTS (no locale, no leading
 * slash). Build a navigable path with localizedPath()/useLocalizedPath(), e.g.
 * `localizedPath(routes.contact)` -> "/en/contact". Auth, dashboard, and story
 * post routes are absolute (they are not locale-prefixed).
 */
const publicPages = {
  features: "",
  pricing: "pricing",
  contact: "contact",
  library: "bedtime-stories",
  create: "create",
  privacyPolicy: "privacy-policy",
  termsAndConditions: "terms-and-conditions",
  ...landingPageSegments,
} as const;

export type PublicPageSegment = (typeof publicPages)[keyof typeof publicPages];

export const routes = {
  /** Root path redirects to the active locale via LocaleRedirect. */
  root: "/",
  ...publicPages,
  landingPages: landingPageSegments,
  usersStories: `/users-bedtime-stories`,
  story: (slug: string) => `/bedtime-story/${slug}`,
  paymentStatus: (sessionId: string) => `/payment-status/${sessionId}`,
  myStories: (userId: string) => `/my-bedtime-stories/${userId}`,
  myProfile: (userId: string) => `/my-profile/${userId}`,
  myStory: (userId: string, slug: string) =>
    `/my-bedtime-stories/${userId}/${slug}`,
  avatars: `/avatars`,
  blogs: `/blogs`,
  blog: (slug: string) => `/blog/${slug}`,
  logout: `/logout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
  },
  dashboard: {
    base: "/dashboard",
    home: "/dashboard",
    users: "/dashboard/users",
    viewUser: (userId: string) => `/dashboard/users/${userId}`,
    viewUserStories: (userId: string) => `/dashboard/users/${userId}/stories`,
    stories: "/dashboard/stories",
  },
};

/**
 * Every public page gets a /:locale route and is prerendered. Legal pages are
 * prerendered too so their `noindex` is baked into the static HTML, but they
 * are excluded from the sitemap and hreflang (see INDEXABLE_SEGMENTS).
 */
export const ALL_PUBLIC_SEGMENTS: PublicPageSegment[] =
  Object.values(publicPages);

/** Public pages that should be indexed: listed in the sitemap and hreflang. */
export const INDEXABLE_SEGMENTS: PublicPageSegment[] = [
  routes.features,
  routes.pricing,
  routes.contact,
  routes.library,
  routes.create,
  ...Object.values(landingPageSegments),
];

/** Routes prerendered at build time (locales × all public pages). */
export const prerenderPaths: string[] = getPrerenderPaths(ALL_PUBLIC_SEGMENTS);

/** URLs written to the sitemap (locales × indexable public pages). */
export const sitemapPaths: string[] = getPrerenderPaths(INDEXABLE_SEGMENTS);
