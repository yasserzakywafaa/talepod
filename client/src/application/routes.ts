const routes = {
  features: `/`,
  create: `/create`,
  pricing: `/pricing`,
  library: `/bedtime-stories`,
  usersStories: `/users-bedtime-stories`,
  story: (slug: string) => `/bedtime-story/${slug}`,
  paymentStatus: (sessionId: string) => `/payment-status/${sessionId}`,
  myStories: (userId: string) => `/my-bedtime-stories/${userId}`,
  myProfile: (userId: string) => `/my-profile/${userId}`,
  myStory: (userId: string, slug: string) =>
    `/my-bedtime-stories/${userId}/${slug}`,
  characters: `/characters`,
  blogs: `/blogs`,
  blog: (slug: string) => `/blog/${slug}`,
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
  },
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
  // Dashboard (Admin)
  dashboard: {
    base: "/dashboard",
    home: "/dashboard",
    users: "/dashboard/users",
    viewUser: (userId: string) => `/dashboard/users/${userId}`,
    viewUserStories: (userId: string) => `/dashboard/users/${userId}/stories`,
    stories: "/dashboard/stories",
  },
};

export default routes;
