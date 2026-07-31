import {
  DrawerActions,
  createNavigationContainerRef,
} from "@react-navigation/native";

import { mobileRoutes, rootRoutes, type DashboardRouteName, type PublicMarketingScreenRoute, type RootSheetRouteName } from "src/application/routes";
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

const mainShellMyStoriesParams = () =>
  buildMainShellTabParams(mobileRoutes.tabs.myStories);

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

export const openMainDrawer = () => {
  whenReady(() => {
    const state = rootNavigationRef.getRootState();
    const onMain = state.routes[state.index]?.name === rootRoutes.main;
    if (!onMain) {
      rootNavigationRef.navigate(rootRoutes.main, mainShellMyStoriesParams());
    }
    setTimeout(() => {
      rootNavigationRef.dispatch(DrawerActions.openDrawer());
    }, 100);
  });
};

export const navigateToViewStory = (slug: string) => {
  whenReady(() => {
    rootNavigationRef.navigate(mobileRoutes.authenticated.viewStory, { slug });
  });
};

export const navigateToDashboard = (
  screen: DashboardRouteName = mobileRoutes.dashboard.overview,
) => {
  whenReady(() => {
    closeMainDrawer();
    rootNavigationRef.navigate(rootRoutes.dashboard, { screen });
  });
};

export const navigateToMarketingHome = () => {
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.main, {
      screen: mobileRoutes.public.home,
    });
  });
};

/** Library, contact, pricing, privacy, and terms — drawer (guest) or shell stack (signed in). */
export const navigateToPublicMarketingScreen = (
  screen: PublicMarketingScreenRoute,
  isAuthenticated: boolean,
) => {
  whenReady(() => {
    closeMainDrawer();
    if (isAuthenticated) {
      rootNavigationRef.navigate(rootRoutes.main, {
        screen: mobileRoutes.main.shell,
        params: { screen },
      });
      return;
    }

    rootNavigationRef.navigate(rootRoutes.main, { screen });
  });
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
