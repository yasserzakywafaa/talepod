/**
 * Every React Query key in one place.
 *
 * Keys are the cache's identity: a typo produces a second, silently-empty
 * cache entry rather than an error, and invalidating after a mutation means
 * naming a key exactly. Centralising them keeps those two things honest and
 * makes "what invalidates what" answerable by reading one file.
 *
 * Keys are ordered general → specific so a prefix invalidates everything
 * under it: invalidating `["stories"]` clears every list and detail below it.
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
