import APP_CONSTANTS from "src/application/shared/app_constants";

/**
 * Mirrors the web's own origin resolution. A dev build must not hand out
 * talepod.com links: stories created against the dev API do not exist in the
 * production database, so the link would open a story the site cannot find.
 */
export const getWebOrigin = (): string =>
  APP_CONSTANTS.IS_PROD ? "https://talepod.com" : "https://dev.talepod.com";

/**
 * The canonical web URL for a story, which is also what the app registers as a
 * Universal / App Link — so a shared link opens the app when it is installed
 * and the website when it is not. Story routes are not locale-prefixed on the
 * web (see `web/src/application/routes.ts`), so this needs no language.
 */
export const buildStoryShareUrl = (slug: string): string =>
  `${getWebOrigin()}/bedtime-story/${slug}`;
