const routes = {
  home: `/`,
  create: `/create`,
  explore: `/explore`,
  story: (storyId: string) => `/story/${storyId}`,
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
};

export default routes;
