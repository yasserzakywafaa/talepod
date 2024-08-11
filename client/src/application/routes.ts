const routes = {
  home: `/`,
  create: `/create`,
  explore: `/bedtime-stories`,
  story: (slug: string) => `/bedtime-story/${slug}`,
  myStories: (userId: string) => `/my-bedtime-stories/${userId}`,
  myStory: (userId: string, slug: string) =>
    `/my-bedtime-stories/${userId}/${slug}`,
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
  // Landing Pages
  landingPages: {
    bedtimeStoriesForKids: "/bedtime-stories-for-kids",
    bedtimeStoriesForAdults: "/bedtime-stories-for-adults",
    shortBedtimeStories: "/short-bedtime-stories",
    christmasBedtimeStories: "/christmas-bedtime-stories",
    bedtimeStoriesForGirlfriend: "/bedtime-stories-for-girlfriend",
    bedtimeStoriesForToddlers: "/bedtime-stories-for-toddlers",
    educationalBedtimeStories: "/educational-bedtime-stories",
    babyBedtimeStories: "/baby-bedtime-stories",
    bestBedtimeStories: "/best-bedtime-stories",
    quickBedtimeStories: "/quick-bedtime-stories",
  },
};

export default routes;
