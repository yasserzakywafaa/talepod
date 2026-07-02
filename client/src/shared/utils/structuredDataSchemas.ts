import { absoluteUrl } from "./seoMeta";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TalePod",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icons/icon_512x512.png"),
  sameAs: [],
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TalePod",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  url: absoluteUrl("/"),
  description:
    "AI-powered personalized bedtime story generator with narration and watercolor illustrations for children and families.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available with paid plans for additional stories.",
  },
};

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const homepageFaqItems: FaqItem[] = [
  {
    question: "How do I create a bedtime story on your platform?",
    answer:
      "Navigate to the Create Story page and fill in the fields to create your own personalized story.",
  },
  {
    question: "Can I read and listen to stories created by other users?",
    answer:
      "Yes. Browse the Library page to find text and audio versions of various bedtime stories.",
  },
  {
    question: "How do I contact customer support if I have a question or issue?",
    answer: "Visit the Contact page from our menu to reach customer support.",
  },
  {
    question: "Are there any guidelines for creating stories?",
    answer:
      "We make sure that all stories created are appropriate for children and suitable for young audiences.",
  },
  {
    question: "Can I share the stories I create on social media?",
    answer:
      "Yes. Use the share button on your story page to post it on social media platforms.",
  },
  {
    question: "Is there a way to filter stories based on age or genre?",
    answer:
      "Our platform allows you to filter stories by age group and genre to find the perfect story.",
  },
];

// TODO: legal review — safety/COPPA FAQ copy below is draft only.
export const safetyFaqItems: FaqItem[] = [
  {
    question: "How does TalePod handle my child's data?",
    answer:
      "TalePod collects only the information needed to personalize stories, such as a child's first name, age, and interests entered by a parent or guardian. We do not sell personal data. See our Privacy Policy for full details on collection, storage, and retention.",
  },
  {
    question: "How does TalePod keep stories age-appropriate?",
    answer:
      "Stories are generated with kid-safe defaults and content filters designed to keep language and themes suitable for young audiences. Parents choose the child's age when creating a story to help tailor tone and complexity.",
  },
  {
    question: "Is TalePod compliant with children's privacy laws like COPPA?",
    answer:
      "TalePod is designed for use by parents and guardians who create stories on behalf of children. We aim to follow applicable children's privacy requirements, including limiting data collection to what is necessary. Full compliance details are in our Privacy Policy — please review before use.",
  },
  {
    question: "Does TalePod show ads to children?",
    answer:
      "TalePod does not display third-party advertising within the story creation or reading experience. Our focus is on a calm, ad-free bedtime routine for families.",
  },
];

export const homepageFaqSchema = buildFaqPageSchema([
  ...homepageFaqItems,
  ...safetyFaqItems,
]);

export const generatorFaqItems: FaqItem[] = [
  {
    question: "What is a personalized bedtime story generator?",
    answer:
      "A personalized bedtime story generator creates custom tales using details you provide — such as your child's name, age, and interests — and produces a unique story with narration and illustrations in seconds.",
  },
  {
    question: "How fast can TalePod generate a bedtime story?",
    answer:
      "Most stories are ready in under a minute. Enter your child's details, choose a theme, and TalePod generates a narrated story with watercolor illustrations.",
  },
  {
    question: "Can I personalize stories with my child's name and interests?",
    answer:
      "Yes. TalePod uses your child's name, age, gender, interests, and preferred setting to craft a one-of-a-kind bedtime story every time.",
  },
  {
    question: "Does TalePod support multiple languages?",
    answer:
      "TalePod supports 11 languages, so you can create personalized bedtime stories in the language your family speaks at home.",
  },
  ...safetyFaqItems,
];

export const generatorFaqSchema = buildFaqPageSchema(generatorFaqItems);
