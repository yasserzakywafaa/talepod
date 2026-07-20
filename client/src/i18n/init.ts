import { createAppI18n } from "@yasserzakywafaa/client-core/web/i18n";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import enDashboard from "./locales/en/dashboard.json";
import enPage from "./locales/en/page.json";
import enStory from "./locales/en/story.json";
import enLibrary from "./locales/en/library.json";
import enLanding from "./locales/en/landing.json";
import enBlog from "./locales/en/blog.json";
import arCommon from "./locales/ar/common.json";
import arAuth from "./locales/ar/auth.json";
import arDashboard from "./locales/ar/dashboard.json";
import arPage from "./locales/ar/page.json";
import arStory from "./locales/ar/story.json";
import arLibrary from "./locales/ar/library.json";
import arLanding from "./locales/ar/landing.json";
import arBlog from "./locales/ar/blog.json";
import deCommon from "./locales/de/common.json";
import deAuth from "./locales/de/auth.json";
import deDashboard from "./locales/de/dashboard.json";
import dePage from "./locales/de/page.json";
import deStory from "./locales/de/story.json";
import deLibrary from "./locales/de/library.json";
import deLanding from "./locales/de/landing.json";
import deBlog from "./locales/de/blog.json";
import frCommon from "./locales/fr/common.json";
import frAuth from "./locales/fr/auth.json";
import frDashboard from "./locales/fr/dashboard.json";
import frPage from "./locales/fr/page.json";
import frStory from "./locales/fr/story.json";
import frLibrary from "./locales/fr/library.json";
import frLanding from "./locales/fr/landing.json";
import frBlog from "./locales/fr/blog.json";

const namespaces = [
  "common",
  "auth",
  "dashboard",
  "page",
  "story",
  "library",
  "landing",
  "blog",
] as const;

const i18n = createAppI18n({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      dashboard: enDashboard,
      page: enPage,
      story: enStory,
      library: enLibrary,
      landing: enLanding,
      blog: enBlog,
    },
    ar: {
      common: arCommon,
      auth: arAuth,
      dashboard: arDashboard,
      page: arPage,
      story: arStory,
      library: arLibrary,
      landing: arLanding,
      blog: arBlog,
    },
    de: {
      common: deCommon,
      auth: deAuth,
      dashboard: deDashboard,
      page: dePage,
      story: deStory,
      library: deLibrary,
      landing: deLanding,
      blog: deBlog,
    },
    fr: {
      common: frCommon,
      auth: frAuth,
      dashboard: frDashboard,
      page: frPage,
      story: frStory,
      library: frLibrary,
      landing: frLanding,
      blog: frBlog,
    },
  },
  namespaces: [...namespaces],
});

export default i18n;
