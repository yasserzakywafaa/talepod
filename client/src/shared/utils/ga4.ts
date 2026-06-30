import APP_CONSTANTS from "src/application/shared/app_constants";
import { isPrerendering } from "src/shared/utils/prerender";

export interface Ga4PageViewParams {
  page_path: string;
  page_title: string;
  page_location: string;
}

type GtagEventParams = Record<string, string | number | boolean | undefined>;

type GtagCommand = "js" | "config" | "event";

declare global {
  interface Window {
    gtag?: (
      command: GtagCommand,
      targetOrEventName: string | Date,
      params?: GtagEventParams,
    ) => void;
  }
}

export const isGa4Enabled = (): boolean =>
  APP_CONSTANTS.IS_PROD &&
  Boolean(APP_CONSTANTS.GOOGLE_ANALYTICS_ID) &&
  !isPrerendering();

export const trackGa4PageView = (params: Ga4PageViewParams): void => {
  if (!isGa4Enabled() || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", { ...params });
};

/** Custom interaction events (clicks, conversions) — sent directly to GA4 via gtag. */
export const trackGa4Event = (
  eventName: string,
  params: GtagEventParams = {},
): void => {
  if (!isGa4Enabled() || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
};
