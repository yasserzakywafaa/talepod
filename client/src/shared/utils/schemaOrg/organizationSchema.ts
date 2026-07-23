import {
  DEFAULT_LOCALE_CONFIG,
  localizedPath,
} from "@yasserzakywafaa/client-core/web/i18n";
import { routes } from "src/application/routes";
import { getAbsoluteUrl, getImageUrl } from "./schemaGenerators";

export const createOrganizationSchemaForSite = (
  locale: string = DEFAULT_LOCALE_CONFIG.defaultLocale,
): object => {
  const baseUrl = getAbsoluteUrl("");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TalePod",
    url: baseUrl,
    logo: getImageUrl("/icons/icon_512x512.png"),
    description:
      "AI-powered personalized bedtime story generator with narration and watercolor illustrations for children and families.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: getAbsoluteUrl(localizedPath(routes.contact, locale)),
    },
  };
};

export const createSoftwareApplicationSchema = (): object => {
  const baseUrl = getAbsoluteUrl("");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TalePod",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: "Free tier available with paid plans for additional stories.",
    },
    description:
      "AI-powered personalized bedtime story generator with narration and watercolor illustrations for children and families.",
    url: baseUrl,
    screenshot: getImageUrl("/icons/icon_512x512.png"),
  };
};
