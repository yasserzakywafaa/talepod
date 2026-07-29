import {
  DrawerActions,
  createNavigationContainerRef,
} from "@react-navigation/native";

import { mobileRoutes, rootRoutes, type DashboardRouteName, type RootSheetRouteName } from "src/application/routes";

import type { RootStackParamList } from "./types";
import type { User } from "src/shared/types/user";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
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

const mainShellMyStoriesParams = () => ({
  screen: mobileRoutes.main.shell,
  params: {
    screen: mobileRoutes.main.tabs,
    params: { screen: mobileRoutes.tabs.myStories },
  },
});

const resetToMainMyStories = () => ({
  name: rootRoutes.main,
  params: mainShellMyStoriesParams(),
});

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
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.main, {
      screen: mobileRoutes.main.shell,
      params: {
        screen: mobileRoutes.main.tabs,
        params: { screen: mobileRoutes.tabs.create },
      },
    });
  });
};

export const navigateToMainMyStories = () => {
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.main, mainShellMyStoriesParams());
  });
};

export const navigateToMainProfileTab = () => {
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.main, {
      screen: mobileRoutes.main.shell,
      params: {
        screen: mobileRoutes.main.tabs,
        params: { screen: mobileRoutes.tabs.profile },
      },
    });
  });
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

export const navigateToMyProfile = () => {
  whenReady(() => {
    rootNavigationRef.navigate(mobileRoutes.authenticated.myProfile);
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
    rootNavigationRef.navigate(rootRoutes.dashboard, { screen });
  });
};

export const navigateToMarketingHome = () => {
  whenReady(() => {
    rootNavigationRef.navigate(rootRoutes.marketing, {
      screen: mobileRoutes.public.home,
    });
  });
};

export const resetAfterLogin = (user: User | null | undefined) => {
  whenReady(() => {
    if (user && hasAdminRights(user)) {
      rootNavigationRef.reset({
        index: 0,
        routes: [
          {
            name: rootRoutes.dashboard,
            params: { screen: mobileRoutes.dashboard.overview },
          },
        ],
      });
      return;
    }
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
          name: rootRoutes.marketing,
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
