const routes = {
  home: `/`,
  create: `/create`,
  explore: `/bedtime-stories`,
  story: (slug: string) => `/bedtime-story/${slug}`,
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
};

export default routes;
