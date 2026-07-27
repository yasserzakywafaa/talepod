import { getAbsoluteUrl } from "./schemaGenerators";

export const createWebPageSchema = (
  name: string,
  description: string,
  url: string,
  datePublished?: Date | string,
): object => {
  const page: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: getAbsoluteUrl(url),
    mainEntity: {
      "@type": "WebPage",
      "@id": getAbsoluteUrl(url),
    },
  };

  if (datePublished) {
    page.datePublished =
      typeof datePublished === "string"
        ? new Date(datePublished).toISOString()
        : datePublished.toISOString();
  }

  return page;
};
