/** Root native-stack screens (parent of marketing / dashboard drawers). */
export const rootRoutes = {
  marketing: "Marketing",
  main: "Main",
  dashboard: "Dashboard",
} as const;

export const mobileRoutes = {
  public: {
    home: "PublicHome",
    pricing: "PublicPricing",
    contact: "PublicContact",
    library: "PublicLibrary",
    login: "PublicLogin",
    register: "PublicRegister",
  },
  dashboard: {
    overview: "DashboardOverview",
    stories: "DashboardStories",
    adminUsers: "DashboardAdminUsers",
    adminStories: "DashboardAdminStories",
  },
  authenticated: {
    create: "CreateStory",
    viewStory: "ViewStory",
    myProfile: "MyProfile",
  },
  main: {
    shell: "MainShell",
    tabs: "MainTabs",
  },
  tabs: {
    create: "TabCreate",
    myStories: "TabMyStories",
    myAvatars: "TabMyAvatars",
    profile: "TabProfile",
  },
  /** Root-stack form sheets (auth + global menus). */
  sheet: {
    settings: "SheetSettings",
    account: "SheetAccount",
  },
} as const;

export type PublicRouteName =
  (typeof mobileRoutes.public)[keyof typeof mobileRoutes.public];

export type DashboardRouteName =
  (typeof mobileRoutes.dashboard)[keyof typeof mobileRoutes.dashboard];

export type RootSheetRouteName =
  | (typeof mobileRoutes.public)["login"]
  | (typeof mobileRoutes.public)["register"]
  | (typeof mobileRoutes.sheet)["settings"]
  | (typeof mobileRoutes.sheet)["account"];
