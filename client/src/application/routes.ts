const routes = {
  home: `/`,
  create: `/create`,
  explore: `/explore`,
  story: (storyId: string) => `/story/${storyId}`,
  logout: `/logout`,
  checkout: `/checkout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
};

export default routes;
