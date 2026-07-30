/** Root native-stack screens (main app drawer + admin dashboard drawer). */
export const rootRoutes = {
  main: "Main",
  dashboard: "Dashboard",
} as const;

export const mobileRoutes = {
  public: {
    home: "PublicHome",
    pricing: "PublicPricing",
    contact: "PublicContact",
    library: "PublicLibrary",
    privacyPolicy: "PublicPrivacyPolicy",
    termsAndConditions: "PublicTermsAndConditions",
    login: "PublicLogin",
    register: "PublicRegister",
  },
  dashboard: {
    overview: "DashboardOverview",
    users: "DashboardUsers",
    stories: "DashboardStories",
  },
  authenticated: {
    create: "CreateStory",
    viewStory: "ViewStory",
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

/** Marketing screens reachable from the drawer or authenticated shell stack. */
export type PublicMarketingScreenRoute =
  | typeof mobileRoutes.public.library
  | typeof mobileRoutes.public.contact
  | typeof mobileRoutes.public.pricing
  | typeof mobileRoutes.public.privacyPolicy
  | typeof mobileRoutes.public.termsAndConditions;

export type DashboardRouteName =
  (typeof mobileRoutes.dashboard)[keyof typeof mobileRoutes.dashboard];

export type RootSheetRouteName =
  | (typeof mobileRoutes.public)["login"]
  | (typeof mobileRoutes.public)["register"]
  | (typeof mobileRoutes.sheet)["settings"]
  | (typeof mobileRoutes.sheet)["account"];
