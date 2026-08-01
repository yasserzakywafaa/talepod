/**
 * Every React Query key, in one place because a typo silently creates a
 * second empty cache entry rather than failing.
 * 
 * Ordered general → specific, so invalidating a prefix clears everything
 * under it.
 */
export const queryKeys = {
  stories: {
    all: ["stories"] as const,
    library: (source: string, filters: unknown) =>
      [...queryKeys.stories.all, "library", source, filters] as const,
    mine: (filters: unknown) =>
      [...queryKeys.stories.all, "mine", filters] as const,
    bySlug: (slug: string) =>
      [...queryKeys.stories.all, "detail", slug] as const,
    status: (storyId: string) =>
      [...queryKeys.stories.all, "status", storyId] as const,
  },

  avatars: {
    all: ["avatars"] as const,
    list: () => [...queryKeys.avatars.all, "list"] as const,
  },

  pricing: {
    all: ["pricing"] as const,
    plans: (currency: string) =>
      [...queryKeys.pricing.all, "plans", currency] as const,
  },

  subscription: {
    all: ["subscription"] as const,
    current: () => [...queryKeys.subscription.all, "current"] as const,
  },

  admin: {
    all: ["admin"] as const,
    overview: () => [...queryKeys.admin.all, "overview"] as const,
    users: (filters: unknown) =>
      [...queryKeys.admin.all, "users", filters] as const,
    user: (userId: string) =>
      [...queryKeys.admin.all, "user", userId] as const,
    stories: (filters: unknown) =>
      [...queryKeys.admin.all, "stories", filters] as const,
    userStories: (userId: string, filters: unknown) =>
      [...queryKeys.admin.all, "userStories", userId, filters] as const,
  },
} as const;
