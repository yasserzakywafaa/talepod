const routes = {
  home: `/`,
  create: `/create`,
  explore: `/explore`,
  story: (slug: string) => `/story/${slug}`,
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
};

export default routes;
