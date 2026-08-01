import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_FALLBACK_LANG } from "@yasserzakywafaa/client-core";

import arStory from "./locales/ar/story.json";
import arAuth from "./locales/ar/auth.json";
import arCommon from "./locales/ar/common.json";
import arDashboard from "./locales/ar/dashboard.json";
import arPage from "./locales/ar/page.json";
import arLibrary from "./locales/ar/library.json";
import deStory from "./locales/de/story.json";
import deAuth from "./locales/de/auth.json";
import deCommon from "./locales/de/common.json";
import deDashboard from "./locales/de/dashboard.json";
import dePage from "./locales/de/page.json";
import deLibrary from "./locales/de/library.json";
import enStory from "./locales/en/story.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enPage from "./locales/en/page.json";
import enLibrary from "./locales/en/library.json";
import frStory from "./locales/fr/story.json";
import frAuth from "./locales/fr/auth.json";
import frCommon from "./locales/fr/common.json";
import frDashboard from "./locales/fr/dashboard.json";
import frPage from "./locales/fr/page.json";
import frLibrary from "./locales/fr/library.json";
import { ensureNativeLtrForTouches } from "src/shared/utils/layoutDirection";
import { getStoredLanguage } from "src/shared/storage/preferencesStorage";

const NAMESPACES = [
  "common",
  "auth",
  "dashboard",
  "page",
  "story",
  "library",
] as const;

const initI18n = async (): Promise<typeof i18n> => {
  if (i18n.isInitialized) {
    return i18n;
  }

  ensureNativeLtrForTouches();

  const storedLng = await getStoredLanguage();
  const lng = storedLng ?? DEFAULT_FALLBACK_LANG;

  await i18n.use(initReactI18next).init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        page: enPage,
        story: enStory,
        library: enLibrary,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        dashboard: arDashboard,
        page: arPage,
        story: arStory,
        library: arLibrary,
      },
      de: {
        common: deCommon,
        auth: deAuth,
        dashboard: deDashboard,
        page: dePage,
        story: deStory,
        library: deLibrary,
      },
      fr: {
        common: frCommon,
        auth: frAuth,
        dashboard: frDashboard,
        page: frPage,
        story: frStory,
        library: frLibrary,
      },
    },
    lng,
    fallbackLng: DEFAULT_FALLBACK_LANG,
    supportedLngs: ["en", "ar", "de", "fr"],
    defaultNS: "common",
    ns: [...NAMESPACES],
    interpolation: { escapeValue: false },
    compatibilityJSON: "v3",
  });

  return i18n;
};

export { initI18n, NAMESPACES };
export default i18n;
