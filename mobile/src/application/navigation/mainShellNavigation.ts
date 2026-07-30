import type { NavigationState, PartialState } from "@react-navigation/native";

import { mobileRoutes, rootRoutes } from "src/application/routes";

export const MAIN_TAB_ROUTE_ORDER = [
  mobileRoutes.tabs.create,
  mobileRoutes.tabs.myStories,
  mobileRoutes.tabs.myAvatars,
  mobileRoutes.tabs.profile,
] as const;

export type MainTabRouteName = (typeof MAIN_TAB_ROUTE_ORDER)[number];

type NavState = NavigationState | PartialState<NavigationState>;

const getMainTabIndex = (tabRoute: MainTabRouteName): number =>
  MAIN_TAB_ROUTE_ORDER.indexOf(tabRoute);

const resolveTabRouteFromTabsRoute = (
  tabsRoute: { name?: string; state?: NavState; params?: unknown },
): string | null => {
  if (tabsRoute.state?.routes?.length) {
    const index = tabsRoute.state.index ?? 0;
    return tabsRoute.state.routes[index]?.name ?? null;
  }

  const params = tabsRoute.params as { screen?: string } | undefined;
  return params?.screen ?? null;
};

/** Resolve the active main-shell tab from drawer or root navigation state. */
export const resolveActiveMainTabRoute = (
  state: NavState | undefined,
): string | null => {
  if (!state?.routes?.length) {
    return null;
  }

  const activeRoute = state.routes[state.index ?? 0];
  if (!activeRoute) {
    return null;
  }

  let shellRoute = activeRoute;

  if (activeRoute.name === rootRoutes.main && activeRoute.state) {
    const drawerState = activeRoute.state;
    shellRoute = drawerState.routes[drawerState.index ?? 0] ?? activeRoute;
  }

  if (shellRoute.name !== mobileRoutes.main.shell || !shellRoute.state) {
    return null;
  }

  const stackState = shellRoute.state;
  const stackRoute = stackState.routes[stackState.index ?? 0];
  if (!stackRoute || stackRoute.name !== mobileRoutes.main.tabs) {
    return null;
  }

  return resolveTabRouteFromTabsRoute(stackRoute);
};

export const buildMainDrawerShellState = (tabRoute: MainTabRouteName) => ({
  routes: [
    {
      name: mobileRoutes.main.shell,
      state: {
        routes: [
          {
            name: mobileRoutes.main.tabs,
            state: {
              routes: MAIN_TAB_ROUTE_ORDER.map((name) => ({ name })),
              index: getMainTabIndex(tabRoute),
            },
          },
        ],
        index: 0,
      },
    },
  ],
  index: 0,
});

export const buildMainShellTabParams = (tabRoute: MainTabRouteName) => ({
  screen: mobileRoutes.main.shell,
  params: {
    screen: mobileRoutes.main.tabs,
    params: { screen: tabRoute },
  },
});
