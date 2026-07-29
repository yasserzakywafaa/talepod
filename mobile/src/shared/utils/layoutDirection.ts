import { I18nManager } from "react-native";

export type LayoutDirection = "ltr" | "rtl";

export const getLayoutDirection = (lang: string): LayoutDirection =>
  lang === "ar" ? "rtl" : "ltr";

/**
 * Native `I18nManager.forceRTL` without a full reload breaks touch targets in Expo Go.
 * Navigation uses `direction="ltr"` explicitly; Arabic copy uses page-level `direction` / textAlign.
 */
export const ensureNativeLtrForTouches = (): void => {
  if (!I18nManager.isRTL) {
    return;
  }
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(false);
};
