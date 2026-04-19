/**
 * Static routes for vite-plugin-prerender (no `import.meta` / app_constants).
 * Mirrors public paths in AppContent — omit dynamic segments (`:slug`, `:userId`).
 */
export const prerenderPaths: string[] = [
  "/",
  "/create",
  "/pricing",
  "/bedtime-stories",
  "/users-bedtime-stories",
  "/blogs",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/logout",
  "/checkout",
  "/unauthorized",
  "/bedtime-stories-for-kids",
  "/bedtime-stories-for-adults",
  "/short-bedtime-stories",
  "/christmas-bedtime-stories",
  "/bedtime-stories-for-girlfriend",
  "/bedtime-stories-for-toddlers",
  "/educational-bedtime-stories",
  "/baby-bedtime-stories",
  "/best-bedtime-stories",
  "/quick-bedtime-stories",
];
