export const WEB_ORIGIN = "https://talepod.com";

/**
 * The canonical web URL for a story, which is also what the app registers as a
 * Universal / App Link — so a shared link opens the app when it is installed
 * and the website when it is not. Story routes are not locale-prefixed on the
 * web (see `web/src/application/routes.ts`), so this needs no language.
 */
export const buildStoryShareUrl = (slug: string): string =>
  `${WEB_ORIGIN}/bedtime-story/${slug}`;
