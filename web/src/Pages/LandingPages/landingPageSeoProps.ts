import { LandingPageSeo } from "./landingPageSeo";

export function landingPageSeoProps(seo: LandingPageSeo) {
  return {
    title: seo.title,
    description: seo.description,
    canonicalPath: seo.canonicalPath,
    ogTitle: seo.title,
    ogDescription: seo.description,
  };
}
