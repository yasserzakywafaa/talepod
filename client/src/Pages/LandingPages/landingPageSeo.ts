import routes from "src/application/routes";
import type { LandingPageSeoKey } from "src/shared/i18n/useLandingPageSeo";

export interface LandingPageSeo {
  title: string;
  description: string;
  canonicalPath: string;
}

/** Maps app route paths to `useLandingPageSeo` keys. */
export const landingPageRouteKeys: Record<string, LandingPageSeoKey> = {
  [routes.landingPages.bedtimeStoriesForKids]: "kids",
  [routes.landingPages.bedtimeStoriesForAdults]: "adults",
  [routes.landingPages.shortBedtimeStories]: "short",
  [routes.landingPages.christmasBedtimeStories]: "christmas",
  [routes.landingPages.bedtimeStoriesForGirlfriend]: "girlfriend",
  [routes.landingPages.bedtimeStoriesForToddlers]: "toddlers",
  [routes.landingPages.educationalBedtimeStories]: "educational",
  [routes.landingPages.babyBedtimeStories]: "baby",
  [routes.landingPages.bestBedtimeStories]: "best",
  [routes.landingPages.quickBedtimeStories]: "quick",
  [routes.landingPages.alternatives]: "alternatives",
  [routes.landingPages.personalizedBedtimeStoryGenerator]: "generator",
};

export const landingPageSeo: Record<string, LandingPageSeo> = {
  [routes.landingPages.bedtimeStoriesForKids]: {
    title: "Bedtime Stories for Kids | TalePod",
    description:
      "Create magical bedtime stories for kids with TalePod. Personalize tales with your child's name, age, and interests — illustrated and narrated in seconds.",
    canonicalPath: routes.landingPages.bedtimeStoriesForKids,
  },
  [routes.landingPages.bedtimeStoriesForAdults]: {
    title: "Bedtime Stories for Adults | TalePod",
    description:
      "Wind down with personalized bedtime stories for adults on TalePod. Custom themes, calming narration, and unique tales crafted for relaxation.",
    canonicalPath: routes.landingPages.bedtimeStoriesForAdults,
  },
  [routes.landingPages.shortBedtimeStories]: {
    title: "Short Bedtime Stories | TalePod",
    description:
      "Short bedtime stories made in under a minute. TalePod creates quick, personalized tales with narration and illustrations for busy bedtimes.",
    canonicalPath: routes.landingPages.shortBedtimeStories,
  },
  [routes.landingPages.christmasBedtimeStories]: {
    title: "Magical Christmas Bedtime Stories | TalePod",
    description:
      "Create magical Christmas bedtime stories with TalePod. Festive, personalized tales with your child's name, warm narration, and watercolor art.",
    canonicalPath: routes.landingPages.christmasBedtimeStories,
  },
  [routes.landingPages.bedtimeStoriesForGirlfriend]: {
    title: "Bedtime Stories for Girlfriend | TalePod",
    description:
      "Surprise her with a personalized bedtime story on TalePod. Romantic, custom tales with narration — a thoughtful gift for someone special.",
    canonicalPath: routes.landingPages.bedtimeStoriesForGirlfriend,
  },
  [routes.landingPages.bedtimeStoriesForToddlers]: {
    title: "Bedtime Stories for Toddlers | TalePod",
    description:
      "Short, engaging bedtime stories for toddlers on TalePod. Age-appropriate tales personalized with your little one's name and favorite themes.",
    canonicalPath: routes.landingPages.bedtimeStoriesForToddlers,
  },
  [routes.landingPages.educationalBedtimeStories]: {
    title: "Educational Bedtime Stories | TalePod",
    description:
      "Educational bedtime stories that teach while they soothe. TalePod creates personalized tales with morals, narration, and kid-safe illustrations.",
    canonicalPath: routes.landingPages.educationalBedtimeStories,
  },
  [routes.landingPages.babyBedtimeStories]: {
    title: "Bedtime Stories for Babies | TalePod",
    description:
      "Gentle bedtime stories for babies on TalePod. Calm, personalized tales with soft narration — perfect for the youngest listeners.",
    canonicalPath: routes.landingPages.babyBedtimeStories,
  },
  [routes.landingPages.bestBedtimeStories]: {
    title: "Best Bedtime Stories | TalePod",
    description:
      "Discover the best bedtime stories on TalePod. AI-crafted, personalized tales with illustrations, narration, and 11 languages.",
    canonicalPath: routes.landingPages.bestBedtimeStories,
  },
  [routes.landingPages.quickBedtimeStories]: {
    title: "Quick Bedtime Stories | TalePod",
    description:
      "Quick bedtime stories ready in under a minute. TalePod generates personalized tales with narration and watercolor illustrations instantly.",
    canonicalPath: routes.landingPages.quickBedtimeStories,
  },
  [routes.landingPages.alternatives]: {
    title: "TalePod Alternatives — Best Personalized Bedtime Story Apps",
    description:
      "Compare TalePod with StoryFox, Bedtimestory.ai, Storywish, Bairn, and DreamPages. Honest feature comparison of personalized bedtime story apps.",
    canonicalPath: routes.landingPages.alternatives,
  },
  [routes.landingPages.personalizedBedtimeStoryGenerator]: {
    title: "Personalized Bedtime Story Generator | TalePod",
    description:
      "TalePod is a personalized bedtime story generator for kids. Enter your child's name, age, and interests — get a narrated, illustrated story in seconds.",
    canonicalPath: routes.landingPages.personalizedBedtimeStoryGenerator,
  },
};

export const homepageSeo: LandingPageSeo = {
  title: "TalePod: AI-powered Bedtime Stories Creator",
  description:
    "Discover TalePod, where bedtime becomes magical with personalized, unique, enchanting bedtime stories crafted to your child's dreams and imagination.",
  canonicalPath: "/",
};
