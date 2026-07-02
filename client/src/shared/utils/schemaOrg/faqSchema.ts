import { getAbsoluteUrl } from "./schemaGenerators";

export interface FAQItem {
  question: string;
  answer: string;
}

export const createFAQPageSchema = (faqs: FAQItem[], url?: string): object => {
  const mainEntity = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
    ...(url && { url: getAbsoluteUrl(url) }),
  };
};
