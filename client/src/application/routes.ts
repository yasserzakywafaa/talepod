const routes = {
  home: `/`,
  create: `/create`,
  explore: `/explore`,
  story: (storyId: string) => `/story/${storyId}`,
  privacyPolicy: `/privacy-policy`,
  termsOfService: `/terms-of-service`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
};

export default routes;
