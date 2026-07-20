import { useTranslation } from "react-i18next";
import { LandingPageSeo } from "src/Pages/LandingPages/landingPageSeo";
import { landingPageSeoProps } from "src/Pages/LandingPages/landingPageSeoProps";

export type LandingPageSeoKey =
  | "kids"
  | "adults"
  | "short"
  | "christmas"
  | "girlfriend"
  | "toddlers"
  | "educational"
  | "baby"
  | "best"
  | "quick"
  | "alternatives"
  | "generator"
  | "home";

export type LandingPageContentKey = Exclude<
  LandingPageSeoKey,
  "home" | "alternatives"
>;

export function useLandingPageSeo(key: LandingPageSeoKey) {
  const { t } = useTranslation("landing");

  const seo: LandingPageSeo = {
    title: t(`seo.${key}.title`),
    description: t(`seo.${key}.description`),
    canonicalPath: t(`seo.${key}.path`),
  };

  return landingPageSeoProps(seo);
}
