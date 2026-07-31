import {
  DrawerActions,
  createNavigationContainerRef,
  type NavigatorScreenParams,
} from "@react-navigation/native";

import { mobileRoutes, rootRoutes, type DashboardSectionRouteName, type PublicMarketingScreenRoute, type RootSheetRouteName } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { buildDashboardShellParams } from "src/application/navigation/dashboardShellNavigation";
import {
  buildMainDrawerShellState,
  buildMainShellTabParams,
  type MainTabRouteName,
} from "src/application/navigation/mainShellNavigation";

import type { RootStackParamList } from "./types";
import type { User } from "src/shared/types/user";
import { getStoredAuth } from "src/shared/storage/authStorage";

/**
 * Reference to the root navigator (see App.tsx `ref={rootNavigationRef}`).
 * Use the helpers below instead of walking `navigation.getParent()` from drawers.
 */
export const rootNavigationRef =
  createNavigationContainerRef<RootStackParamList>();

const whenReady = (run: () => void) => {
  if (rootNavigationRef.isReady()) {
    run();
  }
};

const resetToMainMyStories = () => ({
  name: rootRoutes.main,
  state: buildMainDrawerShellState(mobileRoutes.tabs.myStories),
});

const closeMainDrawer = () => {
  rootNavigationRef.dispatch(DrawerActions.closeDrawer());
};

const navigateToMainTab = (tabRoute: MainTabRouteName) => {
  whenReady(() => {
    closeMainDrawer();
    rootNavigationRef.navigate(rootRoutes.main, buildMainShellTabParams(tabRoute));
  });
};

/** Opens a root-level form sheet (login, register, settings, account). */
export const openRootSheet = (screen: RootSheetRouteName) => {
  void (async () => {
    const stored = await getStoredAuth();
    const isAuthSheet =
      screen === mobileRoutes.public.login ||
      screen === mobileRoutes.public.register;
    if (isAuthSheet && stored.isAuthenticated && stored.user) {
      return;
    }

    whenReady(() => {
      rootNavigationRef.navigate(screen);
    });
  })();
};

export const navigateToCreateStory = () => {
  navigateToMainTab(mobileRoutes.tabs.create);
};

export const navigateToMainMyStories = () => {
  navigateToMainTab(mobileRoutes.tabs.myStories);
};

export const navigateToMainMyAvatars = () => {
  navigateToMainTab(mobileRoutes.tabs.myAvatars);
};

export const navigateToMainProfileTab = () => {
  navigateToMainTab(mobileRoutes.tabs.profile);
};

/** Push a screen onto the main shell stack (library, contact, story reader…). */
const navigateToShellScreen = <RouteName extends keyof MainShellStackParamList>(
  screen: RouteName,
  params?: MainShellStackParamList[RouteName],
) => {
  whenReady(() => {
    closeMainDrawer();
    rootNavigationRef.navigate(rootRoutes.main, {
      screen: mobileRoutes.main.shell,
      // `{ screen, params }` is well typed for each concrete RouteName, but TS
      // can't narrow the nested union while RouteName is still generic.
      params: { screen, params },
    } as NavigatorScreenParams<MainDrawerParamList>);
  });
};

export const navigateToViewStory = (slug: string) => {
  navigateToShellScreen(mobileRoutes.authenticated.viewStory, { slug });
};

export const navigateToDashboard = (
  screen: DashboardSectionRouteName = mobileRoutes.dashboard.overview,
) => {
  whenReady(() => {
    closeMainDrawer();
    rootNavigationRef.navigate(
      rootRoutes.dashboard,
      buildDashboardShellParams(screen) as NavigatorScreenParams<DashboardDrawerParamList>,
    );
  });
};

export const navigateToMarketingHome = () => {
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.main, {
      screen: mobileRoutes.public.home,
    });
  });
};

/**
 * Library, contact, pricing, privacy, and terms.
 *
 * These live in the shell stack for everyone. They used to be duplicated as
 * drawer screens for guests, which meant the same nav item landed on two
 * different screens — one with the tab bar, one without — depending on which
 * control you tapped, and left stories unreachable from the guest copy.
 */
export const navigateToPublicMarketingScreen = (
  screen: PublicMarketingScreenRoute,
) => {
  navigateToShellScreen(screen);
};

export const resetAfterLogin = (_user?: User | null) => {
  whenReady(() => {
    closeMainDrawer();
    rootNavigationRef.reset({
      index: 0,
      routes: [resetToMainMyStories()],
    });
  });
};

/** @deprecated Use resetAfterLogin(user) */
export const resetToDashboardAfterLogin = () => {
  resetAfterLogin(null);
};

export const resetToMarketingAfterLogout = () => {
  whenReady(() => {
    rootNavigationRef.reset({
      index: 0,
      routes: [
        {
          name: rootRoutes.main,
          params: { screen: mobileRoutes.public.home },
        },
      ],
    });
  });
};

/** True when the user is on the main dashboard area (not marketing). */
export const isOnDashboardRoot = (): boolean => {
  if (!rootNavigationRef.isReady()) {
    return false;
  }
  const state = rootNavigationRef.getRootState();
  const route = state.routes[state.index];
  return route.name === rootRoutes.dashboard;
};
