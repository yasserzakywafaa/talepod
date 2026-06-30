import APP_CONSTANTS from "src/application/shared/app_constants";
import { trackGa4Event } from "src/shared/utils/ga4";
import { isPrerendering } from "src/shared/utils/prerender";

export type GtmEventName =
  | "create_story"
  | "subscribe_click"
  | "buy_story_click"
  | "sign_up"
  | "login"
  | "share"
  | "nav_click"
  | "cta_click"
  | "story_card_click"
  | "story_upgrade_click"
  | "pricing_modal_open"
  | "blog_card_click"
  | "contact_submit"
  | "story_view"
  | "scroll_depth"
  | "library_filter_apply"
  | "library_source_change";

export type GtmEventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const isGtmEnabled = (): boolean =>
  APP_CONSTANTS.IS_PROD &&
  Boolean(APP_CONSTANTS.GOOGLE_TAG_MANAGER_ID) &&
  !isPrerendering();

export const pushToDataLayer = (payload: Record<string, unknown>): void => {
  if (!isGtmEnabled()) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
};

/**
 * Pushes a custom event to GTM (dataLayer) and to GA4 (gtag).
 * Page views are handled separately by Ga4PageView + gtag config in index.html.
 *
 * Do not add matching GA4 Event tags in GTM for these events — that would
 * double-count in GA4. Use GTM only for non-GA4 tags (Ads, pixels, etc.).
 */
export const trackGtmEvent = (
  event: GtmEventName,
  params: GtmEventParams = {},
): void => {
  pushToDataLayer({ event, ...params });
  trackGa4Event(event, params);
};
